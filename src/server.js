import { GraphQLServer, PubSub } from 'graphql-yoga'

import { fragmentReplacements, resolvers } from './resolvers/index'
import prisma from './prisma'

const pubSub = new PubSub()

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context(request) {
    return { pubSub, prisma, request }
  },
  fragmentReplacements
})

export default server
