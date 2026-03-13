# EventHub API

Backend API for the **EventHub** project.  
This API provides event management features (CRUD) following a clean layered architecture,
based on **Onion Architecture**, **Repository Pattern**, and **business-driven TDD**.

---

## Tech Stack

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- Jest (unit testing)
- Swagger / OpenAPI

---

## Architecture Overview

The application follows a layered architecture with clear separation of concerns:

- **Domain**: business entities and repository interfaces
- **Application**: use cases (business logic)
- **Infrastructure**: technical implementations (Prisma, database repositories)
- **Controllers**: HTTP request handling
- **Routes**: REST API endpoint definitions

Business rules are implemented inside entities and use cases, independently from
the database or framework.

---

## Installation

Install dependencies:

```bash
npm install
```

**Running the Project**

Start the API in development mode:

```bash
npm run start
```

The API will be available at:

```bash
http://localhost:8000/api/v1
```

**Database**

The project uses PostgreSQL with Prisma ORM.

To initialize the database and apply migrations:

```bash
npx prisma migrate dev
```

**API Documentation (Swagger)**

Swagger documentation is available at:

```bash
http://localhost:8000/api-docs
```

It documents all Event-related endpoints and data schemas.

**Implemented Features:**

- Create an event
- List all events
- Get an event by ID
- Update an event
- Delete an event

**Testing**

Unit tests are implemented to validate business rules at the use case level.

Run tests with:

```bash
npm test
```

Test coverage includes:

- valid event creation
- business validation errors
- event update
- event deletion