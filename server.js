const express = require('express');
const expressGraphQL = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require('graphql');
const app = express();

// app.use((req, res, next) => {
//   console.log('Time:', Date.now())
//   next()
// })

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'HelloWorld',
    fields: () => ({
      message: { type: GraphQLString, resolve: () => 'Hello World' },
    }),
  }),
});

app.use('/graphql', expressGraphQL.graphqlHTTP({
  schema: schema,
  graphiql: true
}));

app.listen(5000, () => console.log('Serving is now running HAHA'));
