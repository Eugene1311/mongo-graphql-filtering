"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tools_1 = require("graphql-tools");
const express = require("express");
const apollo_server_express_1 = require("apollo-server-express");
const bodyParser = require("body-parser");
const config_1 = require("./config");
const schema_1 = require("./schema");
const resolvers_1 = require("./resolvers");
const MongodbManager_1 = require("./connector/MongodbManager");
MongodbManager_1.default.connect()
    .then(() => console.log(`connected to ${process.env.MONGO_DB_NAME || config_1.default.dbName} db`))
    .catch(err => console.error(err.message));
const SERVER_PORT = process.env.SERVER_PORT || config_1.default.defaultPort;
const schema = graphql_tools_1.makeExecutableSchema({
    typeDefs: schema_1.default,
    resolvers: resolvers_1.default
});
const app = express();
app.use('/graphql', bodyParser.json(), apollo_server_express_1.graphqlExpress({ schema }));
app.use('/graphiql', apollo_server_express_1.graphiqlExpress({ endpointURL: '/graphql' }));
app.listen(SERVER_PORT, () => console.log(`Server is running. Open http://localhost:${SERVER_PORT}/graphiql to run queries.`));
