# EventHub 🚀

EventHub is a fullstack web application for managing events (CRUD), built with a modern architecture and integrated DevOps pipeline.

This project demonstrates:

* Clean architecture backend (Onion Architecture)
* React frontend (Vite + TypeScript)
* CI/CD with Jenkins and GitHub Actions
* Automated testing
* Docker containerization

---

## 🧱 Tech Stack

### Frontend (`client/`)

* React
* TypeScript
* Vite
* Vitest (testing)

### Backend (`server/`)

* Node.js
* Express
* TypeScript
* Prisma ORM
* PostgreSQL
* Jest (unit tests)
* Swagger (API docs)

### DevOps

* Docker / Docker Compose
* Jenkins (CI pipeline)
* GitHub Actions
* GitHub Webhook (auto trigger)

---

## 📁 Project Structure

```
eventhub/
├── client/        # Frontend React app
├── server/        # Backend API
├── Jenkinsfile    # Jenkins pipeline
├── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```
git clone https://github.com/JulieTrucVallet/projet-event-hub.git
cd projet-event-hub
```

---

## ▶️ Run the project locally

### Backend

```
cd server
npm install
npm run start
```

API available at:

```
http://localhost:8000/api/v1
```

---

### Frontend

```
cd client
npm install
npm run dev
```

Frontend available at:

```
http://localhost:5173
```

---

## 🐳 Run with Docker

```
cd server
docker compose up -d --build
```

---

## 🧪 Testing

### Frontend tests

```
cd client
npm run test:ci
```

### Backend tests

```
cd server
npm test
```

All tests are executed automatically in CI pipelines.

---

## 🔄 CI/CD Pipeline

### Jenkins Pipeline

The project includes a Jenkins pipeline defined in `Jenkinsfile`.

Stages:

* Install dependencies (frontend + backend)
* Run tests
* Build frontend
* Build Docker images
* Deploy (main branch only)

---

### GitHub Webhook 🔥

A webhook is configured so that:

➡️ Every `git push` automatically triggers Jenkins

This ensures continuous integration without manual intervention.

---

### GitHub Actions

A workflow is configured in:

```
.github/workflows/
```

It runs:

* install
* tests

This complements Jenkins CI.

---

## 🧠 Architecture (Backend)

The backend follows Onion Architecture:

* Domain → business rules
* Application → use cases
* Infrastructure → database (Prisma)
* Controllers → HTTP layer

This ensures:

* maintainability
* testability
* separation of concerns

---

## 📚 API Documentation

Swagger available at:

```
http://localhost:8000/api-docs
```

---

## ✨ Features

* Create event
* List events
* Get event by ID
* Update event
* Delete event

---

## 🚀 CI/CD Highlights (for presentation)

* Jenkins pipeline with multi-stage execution
* Automated test execution
* Docker build integration
* GitHub webhook triggering builds automatically

---

## 👨‍💻 Author

Julie Truc-Vallet