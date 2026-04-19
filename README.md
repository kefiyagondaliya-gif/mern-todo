# TaskFlow — MERN Stack Todo Application

A full-stack task management app built with **MongoDB, Express.js, React.js, and Node.js** featuring JWT authentication, responsive dark UI, and clean architecture.

---
## 🚀 Live Demo

Experience the application here:  
👉 https://pink-rhinoceros-348647.hostingersite.com/login

## 🗂 Project Structure

```
mern-todo/
├── backend/                   # Node.js + Express API
│   ├── server.js
│   ├── .env.example
│   ├── models/
│   │   ├── User.js            # Mongoose user model (bcrypt hashing)
│   │   └── Task.js            # Task model (priority, dueDate, status)
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── task.controller.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── task.routes.js
│   └── middleware/
│       └── auth.middleware.js # JWT verify middleware
│
└── frontend/                  # React + Vite
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── App.jsx             # Routes (Public/Private guards)
        ├── index.css           # Global design tokens
        ├── context/
        │   └── AuthContext.jsx # Auth state (login/register/logout)
        ├── utils/
        │   └── api.js          # Axios instance + all API functions
        ├── components/
        │   ├── Input.jsx / .module.css
        │   ├── Button.jsx / .module.css
        │   ├── TaskCard.jsx / .module.css
        │   └── TaskModal.jsx / .module.css
        └── pages/
            ├── Login.jsx / Auth.module.css
            ├── Register.jsx
            └── Dashboard.jsx / Dashboard.module.css
```

---

## ✨ Features

### Authentication
- Register with name, email, password (bcrypt hashed, salt rounds: 12)
- Login with JWT token (7-day expiry)
- Protected routes — redirect to /login if unauthenticated
- Global 401 interceptor in Axios (auto-logout on token expiry)

### Task Management
- ✅ Create tasks with title, description, priority (low/medium/high), due date
- ✅ View all tasks with live stats (total/pending/completed)
- ✅ Toggle task complete/pending
- ✅ Edit any task inline via modal
- ✅ Delete individual tasks
- ✅ Clear all completed tasks (bulk delete)
- ✅ Filter by status (all/pending/completed)
- ✅ Filter by priority (low/medium/high)
- ✅ Client-side search across title & description
- ✅ Progress bar showing overall completion %
- ✅ Overdue date highlighting

### Backend API
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login & get JWT |
| GET | /api/auth/me | Get current user |
| GET | /api/tasks | Get all user tasks (filterable) |
| POST | /api/tasks | Create new task |
| PUT | /api/tasks/:id | Update task |
| PATCH | /api/tasks/:id/toggle | Toggle task status |
| DELETE | /api/tasks/:id | Delete task |
| DELETE | /api/tasks/clear-completed | Bulk delete completed |

---

## 🚀 Setup & Installation

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/mern-todo.git
cd mern-todo
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb+srv://kaifiyagondaliya_db_user:kaifiya19@cluster0.3lf8w77.mongodb.net/?appName=Cluster0
JWT_SECRET=8f9aK#92jd!sL0pQx@12LmZJWT_EXPIRE=7d
NODE_ENV=development

```

```bash
npm run dev    # Development with nodemon
npm start      # Production
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev    # Development server (port 5173)
npm run build  # Production build
```

---

## ☁️ Deployment

### Frontend → Vercel
1. Push code to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Set root directory to `frontend`
4. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`
5. Deploy!

### Backend → Render
1. Create new **Web Service** on [render.com](https://render.com)
2. Set root directory to `backend`
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add all environment variables from `.env`
6. Deploy!

---

## 🔧 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, React Router v6, Vite |
| Styling | CSS Modules, custom design system |
| HTTP Client | Axios (with interceptors) |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Validation | express-validator |
| Notifications | react-hot-toast |

---

## 👨‍💻 Developer

**Kaifiya Gondaliya**  
📧 kefiyagondaliya19@gmail.com  
📞 88495 08085  
🔗 [LinkedIn](https://www.linkedin.com/in/kaifiya-gondaliya-40a744369)
