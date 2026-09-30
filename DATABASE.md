# Database Schema

## 1. Database

The AI Gateway uses PostgreSQL as its relational database.

Prisma ORM is used to define the schema and access the database.

```text
Application
    |
    v
Prisma ORM
    |
    v
PostgreSQL
## 2. Entity Relationship

The database contains four main entities:

User
 |
 +----------------------+
 |                      |
 v                      v
Conversation           AIRequest
 |
 v
Message

Relationships:

User 1 ──── N Conversation

Conversation 1 ──── N Message

User 1 ──── N AIRequest

Conversation 1 ──── N AIRequest

A user can have multiple conversations.

A conversation can contain multiple messages.

A user can have multiple AI requests.

An AI request can optionally belong to a conversation.

## 3. User

The User table stores registered users.

Field	Type	Description
id	Int	Primary key
email	String	Unique user email
password	String	Hashed password
createdAt	DateTime	Creation time
updatedAt	DateTime	Last update time

Constraints:

id is the primary key.
email is unique.
password stores the user's hashed password and should never be returned through API responses.
## 4. Conversation

The Conversation table stores conversations belonging to users.

Field	Type	Description
id	Int	Primary key
userId	Int	Owner of the conversation
title	String?	Optional conversation title
createdAt	DateTime	Creation time
updatedAt	DateTime	Last update time

Relationship:

Conversation.userId
        |
        v
User.id

A conversation belongs to exactly one user.

The userId field is indexed to make user conversation queries more efficient.

## 5. Message

The Message table stores messages inside conversations.

Field	Type	Description
id	Int	Primary key
conversationId	Int	Conversation owner
role	MessageRole	USER, ASSISTANT, or SYSTEM
content	String	Message content
createdAt	DateTime	Creation time

Relationship:

Message.conversationId
        |
        v
Conversation.id

Messages belong to a conversation.

Messages are deleted automatically when their conversation is deleted.

## 6. AIRequest

The AIRequest table stores information about AI provider requests.

Field	Type	Description
id	Int	Primary key
userId	Int	User making the request
conversationId	Int?	Related conversation
model	String	AI model used
provider	String	AI provider
timestamp	DateTime	Request timestamp
latencyMs	Int?	Request latency in milliseconds
inputTokens	Int?	Input token count
outputTokens	Int?	Output token count
status	RequestStatus	Request result
errorMessage	String?	Error information

Possible request statuses:

SUCCESS
FAILED
TIMEOUT

For successful AI requests, the system records:

AI provider
AI model
request timestamp
latency
input tokens
output tokens
request status

For failed requests, the system records the error message when available.

This data is used to calculate usage and reliability metrics.

## 7. Enums
MessageRole

Messages can have one of three roles:

USER
ASSISTANT
SYSTEM
RequestStatus

AI requests can have one of three statuses:

SUCCESS
FAILED
TIMEOUT

These enums provide consistent values for message roles and AI request states.

## 8. Indexes

The database includes indexes for frequently queried fields.

Conversation
userId

This index improves queries that retrieve conversations belonging to a specific user.

AIRequest
userId
timestamp
status

These indexes support:

User-specific usage queries
Time-based usage statistics
Error and status statistics
## 9. Foreign Key Relationships

The main foreign key relationships are:

Conversation.userId
        |
        v
User.id
Message.conversationId
        |
        v
Conversation.id
AIRequest.userId
        |
        v
User.id
AIRequest.conversationId
        |
        v
Conversation.id

These relationships ensure that records remain associated with the correct user and conversation.

## 10. Delete Behavior

The database uses controlled delete behavior for related records.

User → Conversation

When a user is deleted, their conversations are deleted.

User deleted
     |
     v
Conversations deleted
Conversation → Message

When a conversation is deleted, its messages are deleted.

Conversation deleted
       |
       v
Messages deleted
User → AIRequest

When a user is deleted, their AI request records are deleted.

User deleted
     |
     v
AIRequests deleted
Conversation → AIRequest

When a conversation is deleted, the related conversationId in AIRequest is set to NULL.

The AI request record itself is preserved.

Conversation deleted
       |
       v
AIRequest.conversationId = NULL

This allows AI request monitoring data to remain available even if a conversation is removed.

## 11. Data Flow

A typical AI request produces data across the database as follows:

User
 |
 | creates request
 v
AIRequest
 |
 | optionally belongs to
 v
Conversation
 |
 v
Message

The application records the AI provider request in AIRequest and stores conversation messages in Message.

## 12. Usage Metrics

The AIRequest table provides the data required to calculate usage metrics.

Total Requests

The number of AI requests:

COUNT(AIRequest)
Total Tokens

The total number of tokens:

SUM(inputTokens + outputTokens)
Average Latency

The average AI request latency:

AVG(latencyMs)
Error Rate

The percentage of failed requests:

FAILED requests / TOTAL requests

For example:

Total requests = 100
Failed requests = 2

Error rate = 2 / 100 = 0.02

These metrics can be exposed through the Usage API.

## 13. Database Design Goals

The database is designed to support the main requirements of the AI Gateway:

User authentication
Conversation storage
Message history
AI request monitoring
Token usage tracking
Latency monitoring
Error tracking
Usage statistics
Multiple AI providers
Multiple AI models

The schema can be extended later to support:

Cost estimation
Model routing
Provider fallback
Request caching
Advanced analytics
Billing information
## 14. Prisma Schema

The database structure is defined using Prisma.

The main Prisma models are:

User
Conversation
Message
AIRequest

The Prisma schema is located at:

prisma/schema.prisma

Prisma migrations are stored in:

prisma/migrations

The application uses Prisma Client to access PostgreSQL from the backend service.

## 15. Security Considerations

The database contains sensitive application information.

Important security considerations include:

Passwords must be hashed before storage.
Passwords must never be returned in API responses.
Database credentials must be stored in environment variables.
The .env file must not be committed to Git.
User-specific queries should verify ownership through userId.
AI provider API keys must not be stored directly in the database.