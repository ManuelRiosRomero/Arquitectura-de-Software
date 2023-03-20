const express = require('express');
const { MongoClient } = require('mongodb');
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
  type ShoppingList {
    id: ID!
    name: String!
    description: String
    value: Float
  }

  type Mutation {
    createShoppingList(id: ID!, name: String!, description: String, value: Float): ShoppingList!
    updateShoppingList(id: ID!, name: String, description: String, value: Float): ShoppingList!
    deleteShoppingList(id: ID!): ID!
  }

  type Query {
    shoppingLists: [ShoppingList!]!
    shoppingList(id: ID!): ShoppingList
  }
`);

// Define the resolvers for the GraphQL API
const resolvers = {
  shoppingList: async ({ id }) => {
    try {
      // Connect to the query database
      await client.connect();

      // Find the item in the query database
      const queryCollection = client.db('queryDB').collection('ShoppingList');
      const result = await queryCollection.findOne({ _id: id });

      // Disconnect from the query database
      await client.close();

      // Return the item as a response
      
      return result == null ? "Null":{ ...result, id: result._id };
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while processing the query.');
    }
  },

  createShoppingList: async ({ id, name, description, value }) => {
    console.log("Recieved request for creating shoppingList");
    try {
      // Connect to the command database
      await client.connect();
      qCollection = client.db('queryDB').collection('ShoppingList');
      const existent = await qCollection.findOne({ _id: id });
      if(existent) updateSoppingList({id, name, description, value});

      collection = client.db('commandDB').collection('ShoppingList');
      document = {id: id, name: name, description: description, value: value };
      collection.insertOne(document, (err, result) => {
        if (err) {
          console.log('Error inserting document:', err);
        } else {
          console.log('Document inserted:', result.ops[0]);
        }
        
        // Disconnect from the command database
        client.close();
        return `Item ${id} ${result.upsertedCount ? 'created' : 'updated'} successfully.`;
      });
      // Return a success message
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while processing the command.');
    }
  },

  updateShoppingList: async ({id, name, description, value}) => {
    console.log("Recieved request to update shoppingList");

  }
};

// Define the GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: resolvers,
  graphiql: true,
}));


// Start the server
app.listen(8080, () => {
  console.log('Server started on port 8080');
});
