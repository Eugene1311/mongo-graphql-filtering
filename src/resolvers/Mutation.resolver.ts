import MongodbManager from '../connector/MongodbManager';
import getNextSequenceValue from "../util/getNextSequenceValue";

export default {
  async addUser(root: any, {user: {name, age} }: any) {
    const collection = MongodbManager.getCollection('users');

    return await collection.insertOne({
      id: await getNextSequenceValue('users'),
      name,
      age: age || 0
    })
    .then(insertOneWriteOpResult =>
      collection.findOne({
        _id: insertOneWriteOpResult.insertedId
      })
    );
  }
}
