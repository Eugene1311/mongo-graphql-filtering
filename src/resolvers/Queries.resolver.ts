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
      if (whereInput[inputKey].length === 0) {
        return;
      }

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
