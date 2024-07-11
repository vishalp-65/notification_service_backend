import { gql } from "apollo-server-express";

const typeDefs = gql`
    type Notification {
        id: String!
        userId: String!
        message: String!
        read: Boolean!
    }

    type Query {
        notifications(page: Int, limit: Int): [Notification!]!
        notification(id: String!): Notification
    }

    type Mutation {
        createNotification(message: String!): Notification!
        markNotificationAsRead(id: String!): Notification!
    }
`;

export default typeDefs;
