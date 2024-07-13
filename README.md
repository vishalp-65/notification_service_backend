
# Realtime Notification System

This project consists of three microservices: Auth Service, Notification Service, and Realtime Service. The services use Kafka for message streaming and are containerized using Docker.

## Folder Structure

### Project Root
```
realtime-notification/
├── auth-service/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── resolvers/
│   │   ├── schema/
│   │   ├── utils/
│   │   └── index.ts
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── notification-service/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── resolvers/
│   │   ├── schema/
│   │   ├── utils/
│   │   └── index.ts
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── realtime-service/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   └── index.ts
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── .env
├── docker-compose.yml
└── README.md
```

### Environment Variables

Create a `.env` file at the root of the project with the following variables or add directly to docker-compose.yml:

```
DB_URI=mongodb+srv://username:password@cluster0.mongodb.net/realtime_notification?retryWrites=true&w=majority
JWT_SECRET_KEY=your_jwt_secret_key
KAFKA_CLIENT_ID=api-server
KAFKA_BROKERS=kafka-broker-url
KAFKA_USERNAME=kafka-username
KAFKA_PASSWORD=kafka-password
KAFKA_GROUP_ID=your-group
KAFKA_TOPICS=your-topic
```

## Running the Project

### Prerequisites

- Docker
- Docker Compose

### Commands

1. **Build and start the services:**
   ```bash
   docker-compose up --build
   ```

2. **Stop the services:**
   ```bash
   docker-compose down
   ```

### Docker Compose File

```yaml
version: '3.8'

services:
  auth-service:
    build:
      context: ./auth-service
    ports:
      - "8082:8082"
    environment:
      - DB_URI=${DB_URI}
      - JWT_SECRET_KEY=${JWT_SECRET_KEY}

  notification-service:
    build:
      context: ./notification-service
    ports:
      - "9000:9000"
    environment:
      - DB_URI=${DB_URI}
      - JWT_SECRET_KEY=${JWT_SECRET_KEY}
      - KAFKA_CLIENT_ID=${KAFKA_CLIENT_ID}
      - KAFKA_BROKERS=${KAFKA_BROKERS}
      - KAFKA_USERNAME=${KAFKA_USERNAME}
      - KAFKA_PASSWORD=${KAFKA_PASSWORD}
      - KAFKA_GROUP_ID=${KAFKA_GROUP_ID}
      - KAFKA_TOPICS=${KAFKA_TOPICS}

  realtime-service:
    build:
      context: ./realtime-service
    ports:
      - "9001:9001"
      - "8000:8000"
    environment:
      - DB_URI=${DB_URI}
      - JWT_SECRET_KEY=${JWT_SECRET_KEY}
      - WS_PORT=8000
      - KAFKA_CLIENT_ID=${KAFKA_CLIENT_ID}
      - KAFKA_BROKERS=${KAFKA_BROKERS}
      - KAFKA_USERNAME=${KAFKA_USERNAME}
      - KAFKA_PASSWORD=${KAFKA_PASSWORD}
```

## Services and Endpoints

### Auth Service

**Port:** 8082

**GraphQL Endpoint:** `http://localhost:8082/graphql`

**GraphQL Queries:**
- `users: [User]`
- `user(id: ID!): User`

**GraphQL Mutations:**
- `register(username: String!, email: String!, password: String!): String`
- `login(email: String!, password: String!): String`

### Notification Service

**Port:** 9000

**GraphQL Endpoint:** `http://localhost:9000/graphql`

**GraphQL Queries:**
- `notifications(page: Int, limit: Int): [Notification]`
- `notification(id: String!): Notification`

**GraphQL Mutations:**
- `createNotification(message: String!): Notification`
- `markNotificationAsRead(id: String!): Notification`

### Realtime Service

**Port:** 9001 (API), 8000 (WebSocket)

**WebSocket Endpoint:** `ws://localhost:8000`

## REST API endpoints 

**Auth services:**
- `POST /api/login` - User login(`email:email`, `password:string`)
- `POST /api/register` - User registration(`username`,`email`,`password`)

**Notification service:**
- `POST /api/notification` - Notification create (`message:string`)
- `GET /api/notifications` - Get all notification for User
- `GET /api/notifications/:id` - Notification by ID
- `PUT /api/notifications/:id` - Change read status of notification

Make sure to send JWT `token` for Authorization as a `Bearer Token` for all the services after login the user. 

### Contact me 

If you have any query please feel free to contact me - `vishal65.p@gmail.com`
