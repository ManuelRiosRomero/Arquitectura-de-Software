const express = require('express');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');

const app = express();
app.use(cors());

const username = "santiago";
const pass = "taller1";
const cluster = "csqr";

const port = 3000

//Build the uri to connect to the client
const mongoUri = `mongodb+srv://${username}:${pass}@${cluster}.etmozzm.mongodb.net/test`;

//Create a mongoDB client
const client = new MongoClient(mongoUri);

// Define the schema for the GraphQL API
const schema = buildSchema(`
  type User {
    _id: String!
    name: String!
    email: String!
  }

  input UserInput {
    name: String!
    email: String!
  }

  type Query {
    getUser(id: String!): User!
    users: [User!]!
  }
  `);

// Define the resolvers for the GraphQL API

const resolvers = {
  getUser: async({ id }) => {
    console.log("Got a request to getUser");
    try{
      const db = client.db('queryDB');
      const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
      if (!user) {
        throw new Error(`User with id ${id} not found`);
      }
      console.info(user)
      return user;
    }
    catch(error)
    {
      console.error("Error: " + error);
      throw new Error("An error ocurred while processing the query");
    }
  },
  users: async() => {
    console.log("Got a request to get all users");
    try{
      const db = client.db('queryDB');
      const users = await db.collection('users').find().toArray();
      console.log(`Found ${users.length} users`);
      return users;
    }
    catch(error)
    {
      console.log("Error: " +  error);
      throw new Error("An error ocurred while processing the query");
    }
  }
};

// Define the GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: resolvers,
  graphiql: true,
}));


// Start the server
// Connect to MongoDB and start the server
client.connect().then(() => {
  app.listen(port, () => {
    console.log(`Query server started on localHost port ${port}`);
  });
});
