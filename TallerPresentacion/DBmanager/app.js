const express = require('express');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const app = express();

const username = "santiago";
const pass = "taller1";
const cluster = "csqr";

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
  }

  type Mutation {
    createUser(input: UserInput!): User!
    updateUser(id: String!, input: UserInput!): User!
    deleteUser(id: String!): Boolean
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
  createUser: async ({ input }) => {
    console.log("Got a request to CreateUser");
    try{
      const db = client.db('commandDB');
      const result = await db.collection('users').insertOne(input);
      const dbQ = client.db('queryDB');
      console.log("Id created: " + result.insertedId)
      const user = await dbQ.collection('users').findOne({ _id: result.insertedId });
      console.log("Id gotten: " + user._id);
      if (!user) {
        throw new Error(`User with id ${result.insertedId} not found`);
      }
      return user;
    }
    catch(error)
    {
      console.error("Error: " + error);
      throw new Error("An error ocurred while processing the query");
    }
  },
  updateUser: async ({ id, input }) => {
    console.log("Got a request to UpdateUser");
    try{
      const db = client.db('commandDB');
      await db.collection('users').updateOne({ _id: new ObjectId(id) }, { $set: input });
      const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
      if (!user) {
        throw new Error(`User with id ${id} not found`);
      }
      return user;
    }
    catch(error)
    {
      console.error("Error: " + error);
      throw new Error("An error ocurred while processing the query");
    }
  },
  deleteUser: async ({ id }) => {
    console.log("Got a request to DeleteUser");
    try {
      const db = client.db('commandDB');
      const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount === 1;
    }
    catch(error)
    {
      console.error("Error: " + error);
      throw new Error("An error ocurred while processing the query");
    }
  },
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
  app.listen(8080, () => {
    console.log('Server started on port 8080');
  });
});
