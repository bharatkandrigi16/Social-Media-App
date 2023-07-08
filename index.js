const { ApolloServer} = require('apollo-server'); 
//const {PubSub} = require('graphql-subscriptions')
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typedefs');
const resolvers = require('./graphql/resolvers');
const { MONGODB } = require('./config.js');

//const pubsub = new PubSub();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        const token = req.headers.authorization || '';
        return { req, token };
    }
});

mongoose.connect(MONGODB, {useNewUrlParser: true})
    .then(() => {
        console.log('MongoDB Connected');
        return server.listen({port: 8000});
    })
    .then(res => {
        console.log(`Server running at ${res.url}`);
    })
