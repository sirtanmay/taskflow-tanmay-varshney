# TaskFlow — Full Stack Task Management System

## 1. Overview

TaskFlow is a minimal yet production-oriented task management system that enables users to manage projects and tasks with proper authentication, relational data handling, and a clean REST API design.

The system supports:

- User authentication using JWT
- Project creation and ownership
- Task management with status, priority, and assignment
- Filtering, pagination, and aggregation (stats)

The goal of this project is not just feature completion, but demonstrating **clean architecture, strong API design, and thoughtful engineering decisions**.

---

## 2. Tech Stack

### Backend

- Node.js + Express
- TypeScript
- PostgreSQL
- Prisma ORM
- Zod (validation)
- JWT (authentication)
- Bcrypt (password hashing)

### Infrastructure

- Docker (multi-container setup)
- Docker Compose

---

## 3. Architecture Decisions

### 3.1 Layered Architecture

The backend follows a modular layered architecture:

- **Controllers** handle HTTP layer
- **Services** contain business logic
- **Schemas (Zod)** handle validation
- **Middleware** handles authentication & errors

This ensures:

- Separation of concerns
- Testability
- Maintainability

---

### 3.2 Prisma Over Raw SQL

Prisma was chosen because:

- Type-safe queries
- Explicit relational modeling
- Migration support
- Developer productivity

Tradeoff:

- Slight abstraction overhead vs raw SQL
- Less control over extremely complex queries

---

### 3.3 JWT Authentication

- Stateless authentication
- 24-hour expiry
- Payload includes `user_id` and `email`

Tradeoff:

- No refresh token flow (kept simple for scope)

---

### 3.4 Relational Integrity

Instead of manually assigning foreign keys, relations are handled using:

```ts
project: {
  connect: {
    id: projectId;
  }
}
creator: {
  connect: {
    id: userId;
  }
}
```

This ensures:
• Data consistency
• Referential integrity
• Cleaner abstractions
• Prevention of orphan records

### 3.5 Authorization Design

Access rules implemented:

| Resource | Rule                               |
| -------- | ---------------------------------- |
| Project  | Only owner can modify/delete       |
| Task     | Owner OR creator can update/delete |

This prevents unauthorized access while maintaining flexibility.

---

## 4. API Design

### Auth

- `POST /auth/register`
- `POST /auth/login`

---

### Projects

- `GET /projects`
- `POST /projects`
- `GET /projects/:id`
- `PATCH /projects/:id`
- `DELETE /projects/:id`

---

### Tasks

- `GET /projects/:id/tasks`
- `POST /projects/:id/tasks`
- `PATCH /tasks/:id`
- `DELETE /tasks/:id`

Supports:

- Filtering (`status`, `assignee`)
- Pagination (`page`, `limit`)

---

### Stats (Bonus)

- `GET /projects/:id/stats`

Returns:

- Total tasks
- Tasks grouped by status
- Tasks grouped by assignee

Example:

```json
{
  "total_tasks": 5,
  "by_status": {
    "todo": 2,
    "in_progress": 1,
    "done": 2
  },
  "by_assignee": [{ "user_id": "unassigned", "count": 5 }]
}
```

---

## 5. Pagination

Implemented using:

```ts
skip = (page - 1) * limit;
take = limit;
```

Supports:

- `/projects?page=&limit=`
- `/projects/:id/tasks?page=&limit=`

---

## 6. Running Locally

### Prerequisites

- Docker
- Docker Compose

---

### Setup

```bash
git clone <repo-url>
cd taskflow
cp .env.example .env
docker compose up
```

---

### Access

Frontend: http://localhost:3000  
Backend: http://localhost:5001

---

## 7. Database & Migrations

- Managed via Prisma migrations
- No auto-sync used
- Explicit schema evolution

---

### Run migrations manually (if needed):

```bash
npx prisma migrate dev
```

---

## 8. Seed Data

The project includes:

- 1 test user
- 1 project
- Multiple tasks

Example credentials:

Email: test@example.com  
Password: password123

---

## 9. Error Handling

- Centralized error middleware
- Structured responses:

```json
{
  "error": "validation failed",
  "fields": {
    "email": "is required"
  }
}
```

---

## 10. Design Decisions & Tradeoffs

### What was prioritized:

- Clean architecture
- Data integrity
- API clarity
- Real-world patterns (auth, relations, pagination)

### What was intentionally simplified:

- No refresh token flow
- No role-based access system
- No caching layer
- No rate limiting

---

## 11. What I Would Do With More Time

- Add refresh tokens & session management
- Introduce role-based permissions
- Add Redis caching for stats
- Implement WebSocket-based real-time updates
- Add integration tests (Jest + Supertest)
- Improve query performance with indexing

---

## 12. Key Highlights

- Strong separation of concerns
- Proper relational data modeling
- Clean REST API design
- Thoughtful handling of edge cases (null → "unassigned")
- Bonus features (stats + pagination)

---

## 13. Conclusion

This project focuses on building a small but complete system, demonstrating not just functionality, but engineering decisions, tradeoffs, and production-oriented thinking.
