import {makeExecutableSchema} from 'graphql-tools';
import * as express from 'express';
import {graphiqlExpress, graphqlExpress} from 'apollo-server-express';
import * as  bodyParser from 'body-parser';

import config from './config';
import typeDefs from './schema';
import resolvers from './resolvers';

import MongodbManager from './connector/MongodbManager';

MongodbManager.connect()
  .then(() => console.log(`connected to ${process.env.MONGO_DB_NAME || config.dbName} db`))
  .catch(err => console.error(err.message));

const SERVER_PORT = process.env.SERVER_PORT || config.defaultPort;

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const app = express();

app.use('/graphql', bodyParser.json(), graphqlExpress({schema}));

app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}));

app.listen(SERVER_PORT, () => console.log(`Server is running. Open http://localhost:${SERVER_PORT}/graphiql to run queries.`));
