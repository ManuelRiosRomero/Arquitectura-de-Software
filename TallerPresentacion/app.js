const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// -------CONECTAR CON MONGODB--------
const MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://localhost:27017/PresentacionArqui', (err, db) => {
  if (err) throw err

  db.collection('Animales').find().toArray((err, result) => {
    if (err) throw err

    console.log(result)
  })
})
