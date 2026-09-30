# AI Gateway

AI Gateway is a backend service that provides authenticated AI features, conversation management, AI request monitoring, and usage tracking.

The project is built with Node.js, TypeScript, Express, Prisma, PostgreSQL, JWT authentication, and the Groq API.

---

## 1. Project Overview

The purpose of this project is to build a backend AI Gateway that provides a structured API between clients and AI providers.

Instead of allowing clients to communicate directly with an AI provider, requests are handled by the backend.

```text
Client / Postman
       |
       v
Express API
       |
       v
Authentication
       |
       v
Controllers
       |
       v
Services
       |
       v
AI Provider
       |
       v
Groq API

The backend also stores application data and AI request information in PostgreSQL using Prisma ORM.

2. Main Features

The AI Gateway provides the following features:

User authentication using JWT
Protected API endpoints
AI chat functionality
AI analysis functionality
Groq AI provider integration
Conversation management
Conversation message storage
AI request monitoring
Request latency tracking
Input and output token tracking
AI request status tracking
Error logging
PostgreSQL database integration
Prisma ORM
Retry handling for temporary AI provider errors
Request timeout handling
User ownership verification for conversations
3. Tech Stack
Backend
Node.js
TypeScript
Express.js
Database
PostgreSQL
Prisma ORM
Authentication
JSON Web Token (JWT)
AI Provider
Groq API
Groq SDK
Development and Testing
npm
Postman
Git
GitHub
4. Architecture

The application follows a layered backend architecture.

Client / Postman
       |
       v
Routes
       |
       v
Authentication Middleware
       |
       v
Controllers
       |
       v
Services
       |
       +-------------> Providers
       |                    |
       |                    v
       |                Groq API
       |
       v
Prisma
       |
       v
PostgreSQL
Routes

Routes define the available HTTP endpoints.

Middleware

Middleware handles authentication and other cross-cutting concerns.

Controllers

Controllers receive HTTP requests, validate input, call services, and return HTTP responses.

Services

Services contain application and business logic.

Providers

Providers communicate with external services such as Groq.

Prisma

Prisma provides database access between the application and PostgreSQL.

PostgreSQL

PostgreSQL stores application data, conversations, messages, users, and AI request information.

More detailed architecture information is available in:

ARCHITECTURE.md

5. Project Structure
ai-gateway/
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── src/
│   ├── controllers/
│   │   ├── ai.controller.ts
│   │   ├── conversation.controller.ts
│   │   └── usage.controller.ts
│   │
│   ├── middleware/
│   │   └── auth.middleware.ts
│   │
│   ├── providers/
│   │   └── groq.provider.ts
│   │
│   ├── routes/
│   │   ├── ai.routes.ts
│   │   ├── conversation.routes.ts
│   │   └── usage.routes.ts
│   │
│   ├── services/
│   │   ├── ai.service.ts
│   │   ├── conversation.service.ts
│   │   └── usage.service.ts
│   │
│   └── lib/
│       └── prisma.ts
│
├── .env.example
├── API.md
├── ARCHITECTURE.md
├── DATABASE.md
├── package.json
├── prisma7.config.ts
└── README.md
6. API Endpoints

The main API endpoints are:

Method	Endpoint	Authentication	Description
POST	/api/ai/analyze	Required	Analyze a message using AI
POST	/api/ai/chat	Required	Send a chat message to AI
GET	/api/conversations	Required	Get user's conversations
GET	/api/conversations/:id	Required	Get conversation details
GET	/api/usage	Required	Get AI usage statistics

All protected endpoints require a JWT Bearer token.

Example:

Authorization: Bearer <JWT_TOKEN>

Detailed API documentation is available in:

API.md

7. Authentication

The application uses JWT Bearer Authentication.

After successful authentication, the server generates a JWT containing the authenticated user's information.

Protected endpoints require:

Authorization: Bearer <JWT_TOKEN>

The authentication middleware:

Reads the Authorization header.
Validates the Bearer token format.
Verifies the JWT using JWT_SECRET.
Extracts the user ID and email.
Stores the authenticated user in req.user.
Allows the request to continue.

Invalid or expired tokens return:

401 Unauthorized
8. AI Integration

The application integrates with the Groq API through a dedicated provider layer.

AI Service
    |
    v
Groq Provider
    |
    v
Groq API

The provider layer is responsible for:

Sending requests to Groq
Selecting the AI model
Handling request timeout
Retrying temporary provider errors
Returning AI response content
Returning model information
Returning token usage information

Temporary errors such as the following can be retried:

429
500
502
503
504

Permanent errors are not retried.

The current AI model used by the provider is configured in the application provider implementation.

9. AI Request Monitoring

Each AI request can be recorded in the AIRequest database table.

The system tracks information such as:

Model
Provider
Timestamp
Request latency
Input tokens
Output tokens
Request status
Error message

Possible request statuses are:

SUCCESS
FAILED
TIMEOUT

This information allows the application to monitor:

Number of AI requests
Token usage
Request latency
Failed requests
AI provider errors
Usage statistics
10. Conversations

The application supports conversation management.

A user can have multiple conversations.

A conversation can contain multiple messages.

User
 |
 +---- Conversation
          |
          +---- Message

Conversation endpoints verify the authenticated user's ID.

This prevents users from accessing conversations belonging to other users.

11. Database

The application uses PostgreSQL as its relational database.

Prisma ORM is used to define the database schema and access PostgreSQL.

Main database models:

User
 |
 +---- Conversation
 |          |
 |          +---- Message
 |
 +---- AIRequest

Main Prisma models:

User
Conversation
Message
AIRequest

The Prisma schema is located at:

prisma/schema.prisma

Database migrations are stored in:

prisma/migrations

More detailed database information is available in:

DATABASE.md

12. Environment Variables

The application uses environment variables for sensitive configuration.

Create a local .env file based on .env.example.

Example:

DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=your_groq_model

Do not commit the actual .env file to Git.

Only .env.example should be included in the repository.

13. Installation
1. Clone the repository
git clone https://github.com/minhchinh595/Backend-Developer.git
2. Enter the project directory
cd Backend-Developer
3. Install dependencies
npm install
4. Configure environment variables

Create a .env file and configure:

DATABASE_URL=...
JWT_SECRET=...
GROQ_API_KEY=...
GROQ_MODEL=...
5. Generate Prisma Client
npx prisma generate
6. Run database migrations
npx prisma migrate dev
14. Running the Project

Start the development server:

npm run dev

The backend API will be available at:

http://localhost:3000
15. Testing

The API was tested using Postman.

The main tested endpoints include:

POST /api/ai/analyze
POST /api/ai/chat
GET  /api/conversations
GET  /api/conversations/:id
GET  /api/usage

Protected endpoints require a valid JWT Bearer token.

Example:

Authorization
Type: Bearer Token
Token: <JWT_TOKEN>

Successful requests generally return:

{
  "success": true
}
16. Example AI Chat Request
Request
POST /api/ai/chat

Authorization:

Authorization: Bearer <JWT_TOKEN>

Request body:

{
  "message": "Explain REST API for a beginner."
}

The backend processes the request through:

AI Controller
      |
      v
AI Service
      |
      v
Groq Provider
      |
      v
Groq API
17. Example Conversation Request
Get Conversations
GET /api/conversations

Authorization:

Authorization: Bearer <JWT_TOKEN>

Example successful response:

{
  "success": true,
  "data": []
}
Get Conversation Detail
GET /api/conversations/1

Example successful response:

{
  "success": true,
  "data": {}
}
18. Error Handling

The API uses standard HTTP status codes.

Status Code	Meaning
200	Request successful
400	Bad Request
401	Unauthorized
404	Resource Not Found
500	Internal Server Error

General error response format:

{
  "success": false,
  "message": "Error message"
}
19. Security

The project includes several security considerations:

JWT authentication for protected endpoints.
Passwords are hashed before storage.
Passwords are not returned in API responses.
User ownership is verified when accessing conversations.
Database credentials are stored in environment variables.
AI provider API keys are stored in environment variables.
The .env file is not committed to Git.
Permanent AI provider errors are not unnecessarily retried.
20. Documentation

Additional project documentation:

API Documentation

API.md

Contains:

API endpoints
Authentication
Request examples
Response examples
HTTP status codes
Postman testing information
Architecture Documentation

ARCHITECTURE.md

Contains:

System architecture
Request flow
Authentication flow
Conversation flow
Provider layer
Error handling
Design principles
Database Documentation

DATABASE.md

Contains:

Database structure
Entity relationships
Prisma models
Foreign keys
Indexes
Delete behavior
Usage metrics
Security considerations
21. Project Goals

The project demonstrates how to build a backend AI Gateway that separates:

Client
   |
   v
API
   |
   v
Authentication
   |
   v
Business Logic
   |
   v
AI Provider
   |
   v
Database

The architecture is designed to make the system easier to maintain and extend.

Possible future improvements include:

Multiple AI provider support
Provider fallback
Model routing
Response caching
Cost estimation
Advanced analytics
Rate limiting
Streaming AI responses
Billing support
22. Current Project Status

The main backend functionality has been implemented and tested.

Completed components include:

JWT authentication
Protected API routes
AI Analyze API
AI Chat API
Groq provider integration
Conversation APIs
AI request monitoring
PostgreSQL database
Prisma ORM
Usage statistics
Error handling
Request timeout
Retry handling
API documentation
Architecture documentation
Database documentation
23. Repository

GitHub repository:

https://github.com/minhchinh595/Backend-Developer.git
24. License

This project was created for educational and internship assessment purposes.