const express = require('express')
const app = express()
const port = 3000

const MongoClient = require('mongodb').MongoClient;

const username = "santiago";
const pass = "taller1";
const cluster = "cluster0";

const uri = `mongodb+srv://${username}:${pass}@${cluster}.gxuusuy.mongodb.net/test`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
  console.log("Getting....");
  client.connect().then(() => {
    const db = client.db('TestDatabase');
      const collection = db.collection('Collection1');
      collection.find({}).toArray().then(docs => {
        console.log('Documents:', docs);
        res.send(docs);
      }).catch(err => {console.log("ERRR2: " + err)});
  }).catch(err => {console.log("ERRRRR: " + err)});
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});