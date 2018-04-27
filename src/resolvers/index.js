"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Queries_resolver_1 = require("./Queries.resolver");
const graphql_1 = require("graphql");
exports.default = {
    Query: Queries_resolver_1.default,
    DateTime: new graphql_1.GraphQLScalarType({
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
        parseLiteral(ast) {
            if (!Number.isNaN(new Date(ast.value).valueOf())) {
                return new Date(ast.value);
            }
            return null;
        },
    })
};
