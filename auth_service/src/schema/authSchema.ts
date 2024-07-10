import { gql } from "apollo-server-express";

// GraphQL schema definition for Auth Service.

const typeDefs = gql`
    type User {
        id: ID!
        username: String!
        email: String!
        role: String!
        connected: Boolean!
    }

    type Query {
        users: [User]
        user(id: ID!): User
    }

    type Mutation {
        register(username: String!, email: String!, password: String!): String
        login(email: String!, password: String!): String
    }
`;

export default typeDefs;
