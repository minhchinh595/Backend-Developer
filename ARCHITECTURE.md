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