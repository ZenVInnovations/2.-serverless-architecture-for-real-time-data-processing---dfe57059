/**
 * IBM Cloud Function: processIoTData
 * Triggered by HTTP POST from IoT device
 */

const { MongoClient } = require("mongodb");

const uri = "<YOUR_MONGODB_ATLAS_CONNECTION_URI>";
const dbName = "iotDB";
const collectionName = "sensorData";

async function main(params) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const data = {
      deviceId: params.deviceId,
      timestamp: new Date(),
      temperature: params.temperature,
      humidity: params.humidity,
    };

    await collection.insertOne(data);

    return {
      statusCode: 200,
      body: {
        message: "Data stored successfully",
        data,
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: { error: error.message },
    };
  } finally {
    await client.close();
  }
}

exports.main = main;
