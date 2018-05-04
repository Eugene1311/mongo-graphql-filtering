import MongodbManager from '../connector/MongodbManager';
import generateQuery from "../util/generateQuery";

export default {
  async users(root: any, {where}: any) {
    const collection = MongodbManager.getCollection('users');

    return await collection.find(generateQuery(where))
      .toArray();
  }
};
