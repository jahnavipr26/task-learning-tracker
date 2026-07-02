# Personal Task & Learning Tracker 📋

A full-stack web application for managing tasks and tracking learning progress with real-time statistics and interactive charts.

## 🎯 Features

### ✅ Core Features
- **User Authentication** — Secure registration and login with JWT
- **Task Management** — Create, edit, delete, prioritize, and track tasks
- **Learning Tracker** — Track progress on learning topics (0-100%)
- **Dashboard** — Real-time statistics and interactive charts
- **Search & Filter** — Find tasks by title, filter by status/priority
- **Activity Log** — View all user actions and history
- **Responsive Design** — Works on desktop, tablet, and mobile

### 📊 Dashboard Features
- **4 Interactive Charts** using Recharts:
  - Task completion by day (last 7 days)
  - Task distribution by priority
  - Task breakdown by status
  - Learning progress tracking
- **Statistics Cards** — Total tasks, completed, pending, learning topics

### 🔒 Security
- JWT token-based authentication (7-day expiry)
- Bcrypt password hashing
- User data isolation
- Input validation on all endpoints

---

## 🏗️ Tech Stack

### Frontend
- **Framework:** Next.js 14 + React
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **State Management:** React Context API

### Backend
- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Authentication:** JWT + Passport.js

### DevOps
- **Containerization:** Docker & Docker Compose
- **Database:** PostgreSQL 16

---

## 📦 Project Structure
---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose installed

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/task-learning-tracker.git
cd task-tracker
```

2. **Start with Docker**
```bash
docker-compose up --build
```

3. **Access the application**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Database:** PostgreSQL on localhost:5432

---

## 📝 Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `passwordHash` (String)
- `name` (String)
- `createdAt` (Timestamp)

### Tasks Table
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key)
- `title` (String)
- `description` (String, Optional)
- `priority` (Enum: LOW, MEDIUM, HIGH)
- `status` (Enum: PENDING, IN_PROGRESS, COMPLETED)
- `dueDate` (Timestamp, Optional)
- `completedAt` (Timestamp, Optional)

### Learning Topics Table
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key)
- `title` (String)
- `description` (String, Optional)
- `progress` (Integer: 0-100)
- `notes` (String, Optional)
- `completed` (Boolean)

### Activity Logs Table
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key)
- `action` (String)
- `entityType` (String)
- `entityId` (String)
- `createdAt` (Timestamp)

---

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` — Create new account
- `POST /auth/login` — Login (returns JWT token)
- `GET /auth/me` — Get current user info

### Tasks
- `POST /tasks` — Create task
- `GET /tasks` — List user's tasks (supports ?search=, ?status=, ?priority=)
- `GET /tasks/:id` — Get single task
- `PATCH /tasks/:id` — Update task
- `DELETE /tasks/:id` — Delete task
- `PATCH /tasks/:id/complete` — Mark task as completed

### Learning
- `POST /learning` — Create learning topic
- `GET /learning` — List user's learning topics
- `GET /learning/:id` — Get single topic
- `PATCH /learning/:id` — Update topic
- `PATCH /learning/:id/progress` — Update progress (0-100%)
- `PATCH /learning/:id/complete` — Mark as completed
- `DELETE /learning/:id` — Delete topic

### Dashboard
- `GET /dashboard/stats` — Get stats + chart data

---

## 💡 Usage Guide

### 1. Register & Login
- Go to http://localhost:3000
- Click "Register here" to create account
- Login with your credentials

### 2. Create Tasks
- Go to Tasks page
- Click "+ New Task" button
- Fill in details and submit

### 3. Track Learning
- Go to Learning page
- Click "+ New Topic" button
- Use progress slider to track (0-100%)

### 4. View Dashboard
- See real-time statistics
- View 4 interactive charts
- Monitor progress

### 5. Search & Filter
- Use search box to find tasks
- Filter by status and priority

### 6. View Activity Log
- Click "Activity Log" to see all actions
- Color-coded by action type

---

## 📊 Achievements

✅ 30+ REST API endpoints
✅ Full CRUD operations
✅ Real-time dashboard with 4 charts
✅ User authentication & authorization
✅ Responsive design (mobile, tablet, desktop)
✅ Database with proper schema
✅ Docker containerization
✅ Search & filter functionality
✅ Activity logging
✅ Professional UI with Tailwind CSS

---

## 🚀 Deployment

### Deploy Backend (Railway)
1. Go to https://railway.app
2. Connect GitHub repo
3. Select `backend` directory
4. Deploy!

### Deploy Frontend (Vercel)
1. Go to https://vercel.com
2. Import GitHub repo
3. Select `frontend` directory
4. Deploy!

---

## 🤝 Contributing

Feel free to fork and submit pull requests!

---

## 📝 License

MIT License

---

## 👨‍💻 Author

Built during internship as a full-stack project

---

**Happy tracking! 🎉**
EOF---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose installed

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/task-learning-tracker.git
cd task-tracker
```

2. **Start with Docker**
```bash
docker-compose up --build
```

3. **Access the application**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Database:** PostgreSQL on localhost:5432

---

## 📝 Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `passwordHash` (String)
- `name` (String)
- `createdAt` (Timestamp)

### Tasks Table
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key)
- `title` (String)
- `description` (String, Optional)
- `priority` (Enum: LOW, MEDIUM, HIGH)
- `status` (Enum: PENDING, IN_PROGRESS, COMPLETED)
- `dueDate` (Timestamp, Optional)
- `completedAt` (Timestamp, Optional)

### Learning Topics Table
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key)
- `title` (String)
- `description` (String, Optional)
- `progress` (Integer: 0-100)
- `notes` (String, Optional)
- `completed` (Boolean)

### Activity Logs Table
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key)
- `action` (String)
- `entityType` (String)
- `entityId` (String)
- `createdAt` (Timestamp)

---

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` — Create new account
- `POST /auth/login` — Login (returns JWT token)
- `GET /auth/me` — Get current user info

### Tasks
- `POST /tasks` — Create task
- `GET /tasks` — List user's tasks (supports ?search=, ?status=, ?priority=)
- `GET /tasks/:id` — Get single task
- `PATCH /tasks/:id` — Update task
- `DELETE /tasks/:id` — Delete task
- `PATCH /tasks/:id/complete` — Mark task as completed

### Learning
- `POST /learning` — Create learning topic
- `GET /learning` — List user's learning topics
- `GET /learning/:id` — Get single topic
- `PATCH /learning/:id` — Update topic
- `PATCH /learning/:id/progress` — Update progress (0-100%)
- `PATCH /learning/:id/complete` — Mark as completed
- `DELETE /learning/:id` — Delete topic

### Dashboard
- `GET /dashboard/stats` — Get stats + chart data

---

## 💡 Usage Guide

### 1. Register & Login
- Go to http://localhost:3000
- Click "Register here" to create account
- Login with your credentials

### 2. Create Tasks
- Go to Tasks page
- Click "+ New Task" button
- Fill in details and submit

### 3. Track Learning
- Go to Learning page
- Click "+ New Topic" button
- Use progress slider to track (0-100%)

### 4. View Dashboard
- See real-time statistics
- View 4 interactive charts
- Monitor progress

### 5. Search & Filter
- Use search box to find tasks
- Filter by status and priority

### 6. View Activity Log
- Click "Activity Log" to see all actions
- Color-coded by action type

---

## 📊 Achievements

✅ 30+ REST API endpoints
✅ Full CRUD operations
✅ Real-time dashboard with 4 charts
✅ User authentication & authorization
✅ Responsive design (mobile, tablet, desktop)
✅ Database with proper schema
✅ Docker containerization
✅ Search & filter functionality
✅ Activity logging
✅ Professional UI with Tailwind CSS

---

## 🚀 Deployment

### Deploy Backend (Railway)
1. Go to https://railway.app
2. Connect GitHub repo
3. Select `backend` directory
4. Deploy!

### Deploy Frontend (Vercel)
1. Go to https://vercel.com
2. Import GitHub repo
3. Select `frontend` directory
4. Deploy!

---

## 🤝 Contributing

Feel free to fork and submit pull requests!

---

## 📝 License

MIT License

---

## 👨‍💻 Author

Built during internship as a full-stack project

---

**Happy tracking! 🎉**
