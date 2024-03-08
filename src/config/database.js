const { cli } = require("winston/lib/winston/config");

const MongoClient = require("mongodb").MongoClient;
let client = null;

const connect = async () => {
  if (!client) client = new MongoClient(process.env.MONGO_CONNECTION);

  await client.connect();
  return client.db(process.env.DATABASE);
};

const disconnect = async () => {
  if (!client) return true;

  await client.close();
  client = null;
  return true;
};

module.exports = { connect, disconnect };
