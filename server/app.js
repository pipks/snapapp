const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');
const { importSchema } = require('graphql-import');

const resolvers = require('./graphql/resolvers');

//models
const User = require('./models/User');
const Snap = require('./models/Snap');

const server = new ApolloServer({
	typeDefs: importSchema('./graphql/schema.graphql'),
	resolvers,
	context: ({ req }) => ({
		User,
		Snap,
		activeUser: req.activeUser,
	})
});

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true })
	.then(() => console.log('Connected'))
	.catch((e) => console.log(e));
const app = express();

app.use((req, res, next) => {
	const token = req.headers['authorization'];
	console.log(token);
	next();
});

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);