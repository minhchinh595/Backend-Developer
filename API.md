# AI Gateway API Documentation

## 1. Base URL

```text
http://localhost:3000

All API endpoints are available under this base URL when the application is running locally.

2. Authentication

Protected endpoints use JWT Bearer Authentication.

The client must send the following HTTP header:

Authorization: Bearer <JWT_TOKEN>

The authentication middleware:

Reads the Authorization header.
Checks the Bearer token format.
Verifies the JWT using JWT_SECRET.
Extracts the authenticated user information.
Stores the authenticated user in req.user.
Allows the request to continue.

If the token is missing, invalid, or expired, the API returns:

401 Unauthorized
3. AI Analyze
Endpoint
POST /api/ai/analyze
Authentication

Required.

Authorization: Bearer <JWT_TOKEN>
Request Body
{
  "message": "Explain REST API for a beginner."
}
Example Request
POST http://localhost:3000/api/ai/analyze
Purpose

This endpoint sends a message to the AI service for analysis or explanation.

The request is processed through the AI service and AI provider layer before returning the AI response.

Main Flow
Client / Postman
       |
       v
POST /api/ai/analyze
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
4. AI Chat
Endpoint
POST /api/ai/chat
Authentication

Required.

Authorization: Bearer <JWT_TOKEN>
Request Body

Example:

{
  "message": "Explain REST API for a beginner."
}
Purpose

This endpoint sends a chat message to the AI service.

The AI service communicates with the configured AI provider and returns the generated response.

Main Flow
Client / Postman
       |
       v
POST /api/ai/chat
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

The AI service can record information about the AI request such as provider, model, latency, token usage, and request status when available.

5. Get Conversations
Endpoint
GET /api/conversations
Authentication

Required.

Authorization: Bearer <JWT_TOKEN>
Purpose

Returns the conversations belonging to the authenticated user.

Request

No request body is required.

Example
GET http://localhost:3000/api/conversations
Main Flow
Client
   |
   v
GET /api/conversations
   |
   v
JWT Authentication
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
   |
   v
Conversation List
Security

The authenticated user's ID is used to retrieve only conversations belonging to that user.

A user cannot retrieve another user's conversations through this endpoint.

Successful Response
{
  "success": true,
  "data": []
}
6. Get Conversation Detail
Endpoint
GET /api/conversations/:id
Authentication

Required.

Authorization: Bearer <JWT_TOKEN>
Path Parameter

id

The id parameter represents the conversation ID.

Example
GET http://localhost:3000/api/conversations/1
Main Flow
Client
   |
   v
GET /api/conversations/:id
   |
   v
JWT Authentication
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
   |
   v
Conversation + Messages
Security

The API verifies:

The conversation ID is valid.
The conversation exists.
The conversation belongs to the authenticated user.

This prevents a user from accessing another user's conversation.

Successful Response
{
  "success": true,
  "data": {}
}
Invalid Conversation ID

If the conversation ID is invalid:

400 Bad Request

Example:

{
  "success": false,
  "message": "Invalid conversation id"
}
Conversation Not Found

If the conversation does not exist or does not belong to the authenticated user:

404 Not Found

Example:

{
  "success": false,
  "message": "Conversation not found"
}
7. HTTP Status Codes

The API uses standard HTTP status codes.

Status Code	Meaning
200	Request successful
400	Bad Request
401	Unauthorized
404	Resource Not Found
500	Internal Server Error
8. Error Response Format

API errors generally follow this structure:

{
  "success": false,
  "message": "Error message"
}

Successful responses generally follow this structure:

{
  "success": true,
  "data": {}
}
9. AI Request Monitoring

AI requests can be recorded in the AIRequest database table.

The table can contain information such as:

model
provider
timestamp
latencyMs
inputTokens
outputTokens
status
errorMessage

Possible request statuses:

SUCCESS
FAILED
TIMEOUT

This information can be used for:

Request monitoring
Token usage tracking
Latency monitoring
Error tracking
Usage statistics
10. Conversation Data

Conversations are stored in PostgreSQL through Prisma ORM.

The main entities are:

User
   |
   +---- Conversation
             |
             +---- Message
   |
   +---- AIRequest

A conversation belongs to a user.

A conversation can contain multiple messages.

An AI request can optionally belong to a conversation.

11. AI Provider

The current AI provider is Groq.

The provider integration is isolated from the main application logic.

AI Service
    |
    v
Groq Provider
    |
    v
Groq API

The Groq API key and model configuration are stored in environment variables.

Example:

GROQ_API_KEY=...
GROQ_MODEL=...

Sensitive values must not be committed to Git.

12. Environment Variables

The application uses environment variables for sensitive configuration.

Example:

DATABASE_URL=...
JWT_SECRET=...
GROQ_API_KEY=...
GROQ_MODEL=...

The actual .env file must not be committed to the repository.

Only .env.example should be included in Git.

13. API Architecture

The API follows a layered architecture:

Routes
   |
   v
Middleware
   |
   v
Controllers
   |
   v
Services
   |
   +--------> Providers
   |
   v
Prisma
   |
   v
PostgreSQL
Routes

Define HTTP endpoints.

Middleware

Handles cross-cutting concerns such as authentication.

Controllers

Handle HTTP requests and responses.

Services

Contain application and business logic.

Providers

Communicate with external AI providers such as Groq.

Prisma

Provides database access through Prisma ORM.

PostgreSQL

Stores application data.

14. API Endpoints Summary
Method	Endpoint	Authentication	Description
POST	/api/ai/analyze	Required	Analyze a message using AI
POST	/api/ai/chat	Required	Send a chat message to AI
GET	/api/conversations	Required	Get authenticated user's conversations
GET	/api/conversations/:id	Required	Get conversation details and messages
15. Testing with Postman

The API can be tested using Postman.

AI Analyze
POST http://localhost:3000/api/ai/analyze
AI Chat
POST http://localhost:3000/api/ai/chat
Get Conversations
GET http://localhost:3000/api/conversations
Get Conversation Detail
GET http://localhost:3000/api/conversations/1

For protected endpoints, configure:

Authorization
Type: Bearer Token
Token: <JWT_TOKEN>

The expected successful HTTP response is generally:

200 OK
16. Local Development

Start the backend application:

npm run dev

The API will be available at:

http://localhost:3000

The database is accessed through Prisma ORM and PostgreSQL.

17. Security Considerations

The API implements several security measures:

JWT authentication for protected endpoints.
User ownership verification for conversations.
Passwords are stored as hashed values.
Sensitive environment variables are not committed to Git.
AI provider API keys are stored in environment variables.
Users cannot access conversations belonging to other users.