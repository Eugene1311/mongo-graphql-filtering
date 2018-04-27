import MongodbManager from '../connector/MongodbManager';

/**
 * AutoIncrement implementation
 * @param {string} sequenceName - name of the collection to increment
 * @return {Promise<string>} - Promise with next value
 */
export default async function getNextSequenceValue(sequenceName: string): Promise<string> {
  const sequenceDocument = await MongodbManager.getCollection('counters').findOneAndUpdate(
    {_id: sequenceName},
    {$inc: {sequence_value: 1}},
    {
      upsert: true,
      returnOriginal: false
    }
  );

  return sequenceDocument.value.sequence_value.toString();
}
