import {MongoClient, Db, Collection} from 'mongodb';

import config from '../config';

const MONGO_URL = process.env.MONGO_URL || config.mongoDbUrl;

const MongodbManager = {
  db: Db,

  mongoClient: MongoClient,

  connect() {
    // TODO check db initialization after reconnection
    // TODO log db queries
    let mongoClientOptions = {};
    if (process.env.NODE_ENV !== 'production') {
      mongoClientOptions = {loggerLevel: 'info'}
    }

    return MongoClient.connect(MONGO_URL, mongoClientOptions)
      .then((client: MongoClient) => {
        this.mongoClient = client;
        this.db = client.db(this.getDbName());
      })
  },

  getDbName: () => process.env.MONGO_DB_NAME || config.dbName,

  getCollection(type: string): Collection<any> {
    return this.db.collection(type)
  },

  dropDatabase() {
    return this.db.dropDatabase();
  },

  closeConnection(): Promise<any> {
    return this.mongoClient.close();
  }
};

export default MongodbManager;
