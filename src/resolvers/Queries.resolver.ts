import MongodbManager from '../connector/MongodbManager';

export default {
  async users(root: any, { where }: any) {
    const collection = MongodbManager.getCollection('users');
    // const query = typeof version !== 'undefined' ? {
    //   'version.revision': version
    // } : {};

    return await collection.find({})
      .toArray();
  }
};
