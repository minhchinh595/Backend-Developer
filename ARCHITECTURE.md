# Architecture

## 1. Overview

AI Gateway is a backend service that provides authenticated AI features and conversation management.

The application is built with:

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- Groq API
- JWT authentication

The main responsibilities of the system are:

1. Authenticate users using JWT.
2. Receive AI requests from clients.
3. Send AI requests to the Groq provider.
4. Record AI request metrics and status.
5. Manage conversations and messages.
6. Store application data in PostgreSQL.

---

## 2. High-Level Architecture

```text
Client / Postman
       |
       v
   Express API
       |
       +----------------------+
       |                      |
       v                      v
Authentication          Controllers
   Middleware           / Controllers
       |                      |
       |              +-------+-------+
       |              |               |
       |              v               v
       |          AI Service    Conversation
       |              |           Service
       |              v               |
       |       Groq Provider          |
       |              |               |
       |              v               |
       |           Groq API           |
       |                              |
       +--------------+---------------+
                      |
                      v
                   Prisma
                      |
                      v
                 PostgreSQL
## 3. Project Structure
src/
├── controllers/
│   ├── ai.controller.ts
│   └── conversation.controller.ts
│
├── middleware/
│   └── auth.middleware.ts
│
├── providers/
│   └── groq.provider.ts
│
├── services/
│   ├── ai.service.ts
│   └── conversation.service.ts
│
├── routes/
│   ├── ai.routes.ts
│   └── conversation.routes.ts
│
└── lib/
    └── prisma.ts
## 4. Request Flow
4.1 AI Request
Client
  |
  | POST /api/ai/chat
  v
AI Route
  |
  v
JWT Authentication
  |
  v
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
  |
  v
AI Response
  |
  v
AI Service
  |
  +--> Save AIRequest
  |
  v
Controller
  |
  v
Client

The AI service is responsible for measuring request latency and recording request status.

Successful requests are stored with:

model
provider
latency
input tokens
output tokens
status

Failed requests are stored with the error message.

## 5. Authentication Flow

The API uses JWT Bearer authentication.

The client sends:

Authorization: Bearer <JWT_TOKEN>

The authentication middleware:

Reads the Authorization header.
Checks the Bearer format.
Verifies the JWT using JWT_SECRET.
Extracts the user ID and email.
Stores the authenticated user in req.user.
Allows the request to continue.

Invalid or expired tokens return:

401 Unauthorized
## 6. Conversation Flow
Get Conversations
GET /api/conversations

Flow:

Client
  |
  v
Authentication
  |
  v
Conversation Controller
  |
  v
Conversation Service
  |
  v
Prisma
  |
  v
PostgreSQL

The API returns conversations belonging to the authenticated user.

Get Conversation Detail
GET /api/conversations/:id

The API verifies both:

the conversation ID
the authenticated user ID

This prevents a user from accessing another user's conversation.

The endpoint also returns the messages belonging to the conversation.

## 7. AI Provider Layer

The Groq integration is isolated in:

src/providers/groq.provider.ts

The provider is responsible for:

creating requests to Groq
selecting the AI model
handling request timeout
retrying temporary provider errors
returning AI response content
returning model and token usage information

Retryable errors include:

429
500
502
503
504

Permanent errors such as authentication or invalid-request errors are not retried.

## 8. Database

Prisma is used as the ORM.

Main entities:

User
 |
 +---- Conversation
 |          |
 |          +---- Message
 |
 +---- AIRequest
User

Stores application users.

Conversation

Stores conversations belonging to users.

Message

Stores messages belonging to conversations.

Messages have one of the following roles:

USER
ASSISTANT
SYSTEM
AIRequest

Stores AI request monitoring information:

model
provider
timestamp
latencyMs
inputTokens
outputTokens
status
errorMessage
## 9. Error Handling

The API uses HTTP status codes to communicate request results.

Common responses include:

200 OK
400 Bad Request
401 Unauthorized
404 Not Found
500 Internal Server Error

AI provider errors are caught by the service layer and recorded in the AIRequest table.

## 10. Environment Variables

Sensitive configuration is stored in environment variables.

Example:

DATABASE_URL=...
JWT_SECRET=...
GROQ_API_KEY=...
GROQ_MODEL=...

The actual .env file must not be committed to Git.

Only .env.example should be included in the repository.

## 11. Design Principles

The project separates responsibilities into different layers:

Routes

Define HTTP endpoints.

Middleware

Handles cross-cutting concerns such as authentication.

Controllers

Handle HTTP requests and responses.

Services

Contain application/business logic.

Providers

Communicate with external services such as Groq.

Prisma

Handles database access.

This separation makes the application easier to test, maintain, and extend.


## Bước 3: kiểm tra

Lưu file rồi nhìn project sẽ có:

```text
ai-gateway/
├── API.md
├── ARCHITECTURE.md  
├── .env.example
├── package.json
├── prisma/
└── src/