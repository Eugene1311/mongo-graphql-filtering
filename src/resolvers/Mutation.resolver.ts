import MongodbManager from '../connector/MongodbManager';
import getNextSequenceValue from "../util/getNextSequenceValue";

export default {
  async addUser(root: any, {user: {name, age} }: any) {
    const collection = MongodbManager.getCollection('users');
    const newDocument = {
      id: await getNextSequenceValue('users'),
      name,
      age: age || 0
    };

    return await collection.insertOne(newDocument)
    .then(insertOneWriteOpResult =>
      collection.findOne({
        _id: insertOneWriteOpResult.insertedId
      })
    );
  }
}
