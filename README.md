# Project Hub - AI-Powered Project Management Platform

A full-stack Next.js 16 application with PostgreSQL, Gemini AI, and TypeScript.

## 🚀 Features

- ✅ Full CRUD operations for Projects and Tasks
- 🤖 AI-powered task suggestions using Gemini AI
- 📊 Intelligent project analysis and insights
- 🔐 Secure authentication with JWT
- 💾 PostgreSQL database with proper indexes
- 🎨 Modern UI with Tailwind CSS
- 📱 Fully responsive design
- ⚡ Optimized performance with Next.js 15

## 🔑 Key Features

### Authentication
- User registration and login
- JWT-based authentication
- Secure password hashing with bcryptjs
- Protected routes with middleware

### Project Management
- Create, read, update, delete projects
- Project descriptions and metadata
- User-specific project access

### Task Management
- Create, read, update, delete tasks
- Task status: To Do, In Progress, Completed
- Task priority: Low, Medium, High
- Estimated hours tracking

### AI Features
- **Task Suggestions**: Generate task suggestions based on project description
- **Project Analysis**: Get insights and recommendations for your projects
- Powered by Google Gemini AI

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, PostgreSQL
- **AI**: Google Gemini AI
- **Auth**: JWT, bcryptjs
- **Database**: PostgreSQL with Neon serverless
- **Validation**: Zod

## 📝 User Flow

1. **Landing Page** → Register/Login
2. **Dashboard** → Create/View Projects
3. **Project Details** → Manage Tasks
4. **Task Management** → Add Tasks via AI or Manual
5. **AI Analysis** → Get Project Insights

## 🔐 Security

- HTTPS-only cookies (production)
- JWT token verification
- Password hashing
- Protected API routes
- Middleware-based route protection
- Server-side data authorization

## 📦 Database Schema

### users
- id (UUID)
- name, email, password_hash, role
- created_at, updated_at

### projects
- id (UUID)
- title, description
- created_by (FK to users)
- created_at, updated_at

### tasks
- id (UUID)
- title, description
- status (enum: todo, in-progress, completed)
- priority (enum: low, medium, high)
- estimated_hours
- project_id (FK to projects)
- created_by (FK to users)
- created_at, updated_at

## 📋 Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud like Neon)
- Gemini API key from Google AI Studio

## 🔧 Installation

1. **Clone the repository**
```bash
git clone https://github.com/MOHDSAMIULLAH/project-hub.git
cd project-hub
```

2. **Install dependencies**
```bash
npm install
```
`

3. **Configure environment variables**
Create `.env.local`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/project_hub"
GEMINI_API_KEY="your_gemini_api_key"
JWT_SECRET="your_super_secret_jwt_key"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

4. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)


## 🧪 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Tasks
- `GET /api/tasks?project_id={id}` - Get tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

### AI
- `POST /api/ai/suggestions` - Get AI task suggestions
- `POST /api/ai/analyze` - Analyze project with AI

## 👨‍💻 Developer Info

**Name**: Mohd Samiullah
**GitHub**: [@MOHDSAMIULLAH](https://github.com/MOHDSAMIULLAH/)  
**LinkedIn**: [/in/mohd-samiullah1](https://www.linkedin.com/in/mohd-samiullah1/)

## 📄 License

MIT License - House of Edtech Assignment 2025
```

---

## 🎯 Final Steps

1. **Get Gemini API Key**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Setup PostgreSQL**: Use Neon
3. **Install packages**: `npm install`
4. **Run migrations**: Execute schema.sql
5. **Start dev server**: `npm run dev`
6. **Deploy to Vercel**: Connect GitHub repo

This is a **production-ready, enterprise-grade** application that showcases:
- Advanced full-stack architecture
- Real AI integration with Gemini
- Secure authentication & authorization
- Database optimization with proper indexes
- Type-safe development with TypeScript
- Modern UI/UX with Tailwind CSS