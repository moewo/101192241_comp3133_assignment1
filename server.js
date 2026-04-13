const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://admin:admin123@cluster0.wari9jz.mongodb.net/?appName=Cluster0';
const PORT = process.env.PORT || 5001;

async function startServer() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  await mongoose.connect(MONGO_URI);
  console.log('MongoDB connected');

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}/graphql`);
});
}

startServer().catch(err => {
  console.error('Server failed to start:', err.message);
});
