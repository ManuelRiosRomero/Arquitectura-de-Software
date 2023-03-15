const express = require('express')
const app = express()
const port = 3000

const MongoClient = require('mongodb').MongoClient;


const uri = 'mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
  client.connect(err => {
    if (err) {
      console.error('Error connecting to MongoDB:', err);
      res.send('Error connecting to MongoDB');
    } else {
      const db = client.db('mydatabase');
      const collection = db.collection('mycollection');
      collection.find({}).toArray((err, docs) => {
        if (err) {
          console.error('Error fetching documents:', err);
          res.send('Error fetching documents');
        } else {
          console.log('Documents:', docs);
          res.send(docs);
        }
        client.close();
      });
    }
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
