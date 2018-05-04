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

/**
 * Generates mongo db query from whereInput
 * @param whereInput
 * @return {object} query Result query
 */
export default function generateQuery(whereInput: any): object {
  const query: any = {};
  const groupedByFieldName: any = {};
  const logicalQueries: any = {};

  Object.keys(whereInput).forEach((inputKey: string) => {
    /*
    * generate query logical operators
    */
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

    /*
    * group queries by field
    */
    groupedByFieldName[fieldName] = groupedByFieldName[fieldName] || [];
    groupedByFieldName[fieldName] = groupedByFieldName[fieldName].concat([insertValue(queryForField, whereInput[inputKey])]);
  });

  console.log('groupedByFieldName', groupedByFieldName);

  /*
  * generate query for single fields
  */
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

  /*
  * merge queries for single fields and logical operators
  */
  Object.assign(query, logicalQueries);

  console.log('query', query);

  return query;
}

/**
 * Inserts value in query taken from inputFieldsToQueries map
 * @param {object | undefined} queryForField Initial query
 * @param value Value to insert in query
 * @return {object} queryForField Modified query with inserted value
 */
function insertValue(queryForField: object | undefined, value: any): object {
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
