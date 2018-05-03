import MongodbManager from '../connector/MongodbManager';

const inputFieldsToQueries: Map<string, any> = new Map([
  ['', undefined],
  ['not', {$not: {$eq: undefined}}],
  ['in', {$in: undefined}],
  ['not_in', {$nin: undefined}],

  ['lt', {$lt: undefined}],
  ['lte', {$lte: undefined}],
  ['gt', {$gt: undefined}],
  ['gte', {$gte: undefined}],

  ['contains', {$regex: '.*value.*'}],
  ['not_contains', {$regex: '^((?!value).)*$'}],
  ['starts_with', {$regex: '^value.*'}],
  ['not_starts_with', {$regex: '^(?!value.*$).*'}],
  ['ends_with', {$regex: '^.*value$'}],
  ['not_ends_with', {$regex: '.*(?<!value)$'}],
]);

const logicalInputFieldsToQueries: Map<string, string> = new Map([
  ['AND', '$and'],
  ['OR', '$or'],
  ['NOT', '$nor'],
]);

export default {
  async users(root: any, {where}: any) {
    const collection = MongodbManager.getCollection('users');

    console.log('where', where);

    return await collection.find(generateQuery(where))
      .toArray();
  }
};

function generateQuery(whereInput: any): object {
  const query: any = {};
  const groupedByFieldName: any = {};
  const logicalQueries: any = {};

  Object.keys(whereInput).forEach((inputKey: string) => {
    if (logicalInputFieldsToQueries.has(inputKey)) {
      const operatorName: string = logicalInputFieldsToQueries.get(inputKey) || '$and'; // Typescript non-sense?

      // TODO convert array to object for $and operator?
      logicalQueries[operatorName] = whereInput[inputKey].map(generateQuery);
      return;
    }

    const fieldName = inputKey.match(/^((?!_).)*(_|$)/g)![0].replace('_', '');
    const queryForField = inputFieldsToQueries.get(inputKey.replace(/^((?!_).)*_/g, ''));

    groupedByFieldName[fieldName] = groupedByFieldName[fieldName] || [];
    groupedByFieldName[fieldName] = groupedByFieldName[fieldName].concat([insertValue(queryForField, whereInput[inputKey])]);
  });

  console.log('groupedByFieldName', groupedByFieldName);

  Object.keys(groupedByFieldName).forEach(key => {
    if (groupedByFieldName[key].length === 1) {
      query[key] = groupedByFieldName[key][0];
    } else {
      // TODO find out is there another solution to combine queries for one field
      query['$and'] = groupedByFieldName[key].map((query: any) => ({
        [key]: query
      }));
    }
  });

  Object.assign(query, logicalQueries);

  console.log('query', query);

  return query;
}

function insertValue(queryForField: object | undefined, value: any) {
  if (typeof queryForField === 'undefined') {
    return value;
  }

  const queryObject: any = {...queryForField};

  Object.keys(queryObject).forEach(key => {
    if (typeof queryForField === 'undefined') {
      queryObject[key] = value;
      return;
    }

    if (key === '$regex') {
      queryObject[key] = new RegExp(queryObject[key].replace(/value/g, value));
      return;
    }

    if (typeof queryForField === 'object') {
      queryObject[key] = insertValue(queryObject[key], value);
    }
  });

  return queryObject;
}

// const UserWhereInput = {
//   // AND: [UserWhereInput!],
//   // OR: [UserWhereInput!],
//   // NOT: [UserWhereInput!],
//
//   id: 'UniqueString', // {id: value}
//   id_not: 'UniqueString', // {id: {$not: {$eq: value}}}
//   id_in: ['UniqueString'!], // {id: {$in: [value1, value2, ...valueN]}}
//   id_not_in: ['UniqueString'!], // {id: {$nin: [value1, value2, ...valueN]}}
//
//   id_lt: 'UniqueString', // {id: {$lt: value}}
//   id_lte: 'UniqueString', // {id: {$lte: value}}
//   id_gt: 'UniqueString', // {id: {$gt: value}}
//   id_gte: 'UniqueString', // {id: {$gte: value}}
//   // only for strings
//   id_contains: 'UniqueString', // {id: {$regex: /.*value.*/}}
//   id_not_contains: 'UniqueString', // {id: {$regex: /^((?!value).)*$/}}
//   id_starts_with: 'UniqueString', // {id: {$regex: /^value.*/}}
//   id_not_starts_with: 'UniqueString', // {id: {$regex: /^(?!value.*$).*/}}
//   id_ends_with: 'UniqueString', // {id: {$regex: /^.*value$/}}
//   id_not_ends_with: 'UniqueString', // {id: {$regex: //.*(?<!value)$//}}
//
//   name: 'String',
//   name_not: 'String',
//   name_in: ['String'!],
//   name_not_in: ['String'!],
//   name_lt: 'String',
//   name_lte: 'String',
//   name_gt: 'String',
//   name_gte: 'String',
//   name_contains: 'String',
//   name_not_contains: 'String',
//   name_starts_with: 'String',
//   name_not_starts_with: 'String',
//   name_ends_with: 'String',
//   name_not_ends_with: 'String',
//
//   age: 0, // Int
//   age_not: 0,
//   age_in: [0], // [Int!]
//   age_not_in: [0], // [Int!]
//   age_lt: 0,
//   age_lte: 0,
//   age_gt: 0,
//   age_gte: 0,
// };
