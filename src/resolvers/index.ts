import Query from './Queries.resolver';
import Mutation from './Mutation.resolver';

import {GraphQLScalarType, StringValueNode} from 'graphql';

export default  {
  Query,
  Mutation,
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'An ISO-8601 encoded UTC date string.',
    parseValue(value) {
      if (!Number.isNaN(new Date(value).valueOf())) {
        return new Date(value);
      }
      return null;
    },
    serialize(value) {
      if (!Number.isNaN(new Date(value).valueOf())) {
        return value.toString();
      }
      return null;
    },
    parseLiteral(ast: StringValueNode) {
      if (!Number.isNaN(new Date(ast.value).valueOf())) {
        return new Date(ast.value);
      }
      return null;
    },
  })
};
