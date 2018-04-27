"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const config_1 = require("../config");
const MONGO_URL = process.env.MONGO_URL || config_1.default.mongoDbUrl;
const MongodbManager = {
    db: mongodb_1.Db,
    mongoClient: mongodb_1.MongoClient,
    connect() {
        let mongoClientOptions = {};
        if (process.env.NODE_ENV !== 'production') {
            mongoClientOptions = { loggerLevel: 'info' };
        }
        return mongodb_1.MongoClient.connect(MONGO_URL, mongoClientOptions)
            .then((client) => {
            this.mongoClient = client;
            this.db = client.db(this.getDbName());
        });
    },
    getDbName: () => process.env.MONGO_DB_NAME || config_1.default.dbName,
    getCollection(type) {
        return this.db.collection(type);
    },
    dropDatabase() {
        return this.db.dropDatabase();
    },
    closeConnection() {
        return this.mongoClient.close();
    }
};
exports.default = MongodbManager;
