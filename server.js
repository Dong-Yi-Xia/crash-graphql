const express = require('express');
const expressGraphQL = require('express-graphql');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql');

const app = express();

// app.use((req, res, next) => {
//   console.log('Time:', Date.now())
//   next()
// })

// const schema = new GraphQLSchema({
//   query: new GraphQLObjectType({
//     name: 'HelloWorld',
//     fields: () => ({
//       message: {
//         type: GraphQLString,
//         resolve: () => 'Hello World'
//       },
//     }),
//   }),
// });

const authors = [
  {id: 1, name: 'JKRow'},
  {id: 2, name: 'Peking'},
  {id: 3, name: 'BDCost'}
]

const books = [
  {id: 1, name: 'Book 1', authorId: 1},
  {id: 2, name: 'Book 2', authorId: 1},
  {id: 3, name: 'Book 3', authorId: 1},
  {id: 4, name: 'Book 4', authorId: 2},
  {id: 5, name: 'Book 5', authorId: 2},
  {id: 6, name: 'Book 6', authorId: 2},
  {id: 7, name: 'Book 7', authorId: 3},
  {id: 8, name: 'Book 8', authorId: 3},
]

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: 'This represents an author of a book',
  //fields can take a function instead of an object. This way the code inside the function won't be evaluated immediately
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt)},
    name: { type: new GraphQLNonNull(GraphQLString)},
    // Find all the books
    books: {
      type: new GraphQLList(BookType),
      resolve: (author) => {
        return books.filter(book => book.authorId === author.id)
      }
    }
  })
})

const BookType = new GraphQLObjectType({
  name: 'Book',
  description: 'This represents a book written by an author',
  //fields can take a function instead of an object. This way the code inside the function won't be evaluated immediately
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt)},
    name: { type: new GraphQLNonNull(GraphQLString)},
    authorId: { type: new GraphQLNonNull(GraphQLInt)},
    // Find the author
    author: {
      type: AuthorType,
      // Resolve callback properties (parent, args)
      resolve: (book) => {
        return authors.find(author => author.id === book.authorId)
      }
     }
  })
})

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    book: {
      type: BookType,
      description: 'A single Book',
      args: {
        id: { type: GraphQLInt}
      },
      resolve: (parent, args) => {
        return books.find(book => book.id === args.id)
      }
    },
    books: {
      type: new GraphQLList(BookType), // Array list
      description: 'List of All Books',
      resolve: () => books //return the books json object
    },
    authors: {
      type: new GraphQLList(AuthorType), // Array list
      description: 'List of All Authors',
      resolve: () => authors //return the authors json object
    }
  })
})

const schema = new GraphQLSchema({
  query: RootQueryType
})

app.use('/graphql', expressGraphQL.graphqlHTTP({
  schema: schema,
  graphiql: true
}));

app.listen(5000, () => console.log('Serving is now running HAHA'));



/*
doesn't need to add query {}
can remove query, default implies
api endpoint localhost:5000/graphql

{
  book(id:1){
    name
  }

  books {
    name
    author {
      name
    }
  }

  author {
    name
    books {
      name
    }
  }
}

*/
