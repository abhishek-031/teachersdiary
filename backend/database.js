require('dotenv').config();
const { MongoClient } = require('mongodb');


let db;

async function connect(){
  const client = new MongoClient(process.env.MONGODB_URI,{useNewUrlParser:true,useUnifiedTopology:true});
  await client.connect();
  db = client.db();
}


function getDb(){
  return db;
}

module.exports = { getDb, connect };