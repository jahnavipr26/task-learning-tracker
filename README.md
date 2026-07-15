# Personal Task & Learning Tracker 📋

A simple app to track daily tasks and learning progress, built with Next.js, NestJS, and PostgreSQL.

## Source Code

Git repository: `https://github.com/jahnavipr26/task-learning-tracker`

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, Recharts
- **Backend:** NestJS, TypeScript, JWT + Passport.js
- **Database:** PostgreSQL with Drizzle ORM
- **DevOps:** Docker & Docker Compose

## Database Schema

**Users**
- `id`, `email`, `passwordHash`, `name`, `createdAt`

**Tasks**
- `id`, `userId`, `title`, `description`, `priority` (LOW/MEDIUM/HIGH), `status` (PENDING/IN_PROGRESS/COMPLETED), `dueDate`, `completedAt`

**Learning Topics**
- `id`, `userId`, `title`, `description`, `progress` (0–100), `notes`, `completed`

## Setup Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/YOUR_USERNAME/task-learning-tracker.git
   cd task-tracker
   ```

2. **Start with Docker**
   ```bash
   docker-compose up --build
   ```

3. **Access the app**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Database: PostgreSQL on localhost:5432

## Architecture

- **Frontend** (Next.js) talks to the **Backend** (NestJS) over REST.
- Backend handles auth (JWT), business logic, and database access via Drizzle ORM.
- **PostgreSQL** stores all persistent data.
- Everything runs in Docker containers, orchestrated with Docker Compose for local development.

## Database Design

- Three core tables: `users`, `tasks`, `learning_topics`.
- `tasks` and `learning_topics` both reference `users.id` as a foreign key, so each user only sees their own data.
- Enums (`priority`, `status`) keep task states consistent instead of using free-text fields.
- `progress` on learning topics is a simple integer (0–100) to drive a progress bar in the UI.

## API Design

- REST API built with NestJS, versioned under `/api`.
- Auth: `POST /auth/register`, `POST /auth/login` (returns JWT).
- Tasks: `GET/POST /tasks`, `PATCH/DELETE /tasks/:id`.
- Learning Topics: `GET/POST /learning-topics`, `PATCH/DELETE /learning-topics/:id`.
- All task/learning routes are protected by JWT auth guards and scoped to the logged-in user.

## Challenges Faced

_Add your own notes here, e.g. auth edge cases, ORM migrations, syncing frontend state with the backend, Docker networking issues, etc._

## Future Improvements

- Add recurring tasks / reminders
- Add data visualizations for learning progress over time (Recharts)
- Add tagging/categories for tasks and topics
- Add tests (unit + e2e) and CI pipeline
