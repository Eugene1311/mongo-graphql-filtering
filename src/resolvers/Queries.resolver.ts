import MongodbManager from '../connector/MongodbManager';

export default {
  async users(root: any, { type, version, limit = 10, skip = 0 }: any) {
    const collection = MongodbManager.getCollection(type);
    const query = typeof version !== 'undefined' ? {
      'version.revision': version
    } : {};

    return await collection.find(query)
      .skip(skip)
      .limit(limit)
      .toArray();
  }
};
