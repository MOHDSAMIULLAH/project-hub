# Project Hub - AI-Powered Project Management Platform

A full-stack Next.js 15 application with PostgreSQL, Gemini AI, and TypeScript.

## 🚀 Features

- ✅ Full CRUD operations for Projects and Tasks
- 🤖 AI-powered task suggestions using Gemini AI
- 📊 Intelligent project analysis and insights
- 🔐 Secure authentication with JWT
- 💾 PostgreSQL database with proper indexes
- 🎨 Modern UI with Tailwind CSS
- 📱 Fully responsive design
- ⚡ Optimized performance with Next.js 15

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, PostgreSQL
- **AI**: Google Gemini AI
- **Auth**: JWT, bcryptjs
- **Database**: PostgreSQL with Neon serverless
- **Validation**: Zod

## 📋 Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud like Neon)
- Gemini API key from Google AI Studio

## 🔧 Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd project-hub
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up PostgreSQL database**
```bash
# Create database
createdb project_hub

# Run schema
psql -d project_hub -f schema.sql
```

4. **Configure environment variables**
Create `.env.local`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/project_hub"
GEMINI_API_KEY="your_gemini_api_key"
JWT_SECRET="your_super_secret_jwt_key"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

5. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📦 Deployment to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy on Vercel**
- Import project from GitHub
- Add environment variables
- Deploy

3. **Database Setup**
- Use Neon, Supabase, or Vercel Postgres
- Update DATABASE_URL in environment variables

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

**Name**: [Your Name]  
**GitHub**: [@yourusername](https://github.com/yourusername)  
**LinkedIn**: [/in/yourprofile](https://linkedin.com/in/yourprofile)

## 📄 License

MIT License - House of Edtech Assignment 2025
```

---

## 🎯 Final Steps

1. **Get Gemini API Key**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Setup PostgreSQL**: Use Neon (free), Supabase, or local PostgreSQL
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

**Update footer with your details before deploying!** 🚀