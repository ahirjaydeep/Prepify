<div align="center">

<img src="https://res.cloudinary.com/harshitnakrani/image/upload/v1758720618/logo-removebg-preview_niwu7z.png" alt="Prepify Logo" width="120" />

# Prepify

### 🚀 AI-Powered Interview Coaching Platform

**Transform your interview preparation with real-time AI feedback, intelligent scoring, and a built-in job board — all in one place.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-prepifyinterviewer.netlify.app-blue?style=for-the-badge&logo=netlify)](https://prepifyinterviewer.netlify.app)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com)
[![Groq](https://img.shields.io/badge/LLM-Groq%20%7C%20Llama--3.3-FF6B35?style=for-the-badge)](https://groq.com)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Reference](#-api-reference)
- [Environment Variables](#-environment-variables)
- [How It Works](#-how-it-works)
- [Team](#-team)
- [Contact](#-contact)

---

## 🌟 Overview

**Prepify** is a full-stack, AI-powered mock interview platform that bridges the gap between candidates looking for their next role and recruiters looking for top talent. It combines a smart job board with resume-aware, conversational AI interviews — all powered by the **Groq API (Llama 3.3 70B Versatile)**.

Whether you're a candidate sharpening your skills or a recruiter screening applicants at scale, Prepify gives both sides exactly what they need.

---

## ✨ Key Features

### 👤 For Candidates
- **AI Mock Interviews** — Upload your resume (`.docx`) and get immediately put into a live AI interview session tailored to your experience.
- **Job-Linked Interviews** — Apply to a specific job posting and get questions targeted to that role's skills and responsibilities.
- **Voice Input** — Answer questions naturally using the browser's built-in speech-to-text.
- **Interview History** — Review all past interview transcripts from your personal dashboard.
- **Resume Management** — Upload or update your resume directly from your candidate dashboard; it persists across sessions.

### 🏢 For Recruiters
- **Job Board Management** — Create, manage, and close job postings from a dedicated recruiter dashboard.
- **Applicant Tracking** — View all candidates who applied to each position.
- **Interview Transcripts** — Read the full AI interview transcript for every applicant to evaluate them at a glance.
- **Candidate Selection** — Mark top candidates as "selected" directly from the dashboard.

### 🤖 AI Engine
- **Context-Aware Questioning** — The AI reads the full resume and adapts every question to the candidate's background.
- **Warm-Up → Technical → Behavioral** — Questions naturally progress through interview stages.
- **Graceful Exit Feedback** — If a candidate ends the session early, the AI provides detailed improvement areas.
- **Rate-limit Resilience** — Handles Groq API rate limits gracefully with user-friendly fallback messages.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        PREPIFY PLATFORM                         │
├──────────────────────────┬──────────────────────────────────────┤
│      FRONTEND (Vite)     │           BACKEND (Express)          │
│      React 19 + TW       │           Node.js + Mongoose         │
│                          │                                       │
│  Landing Page            │  /api/v1/interview                    │
│  ├── Mode Select         │    ├── POST /start-interview          │
│  ├── Candidate Dashboard │    ├── POST /continue-interview       │
│  ├── Recruiter Dashboard │    ├── POST /by-job                   │
│  ├── Resume Upload       │    └── POST /by-candidate            │
│  └── Interview Chat      │                                       │
│                          │  /api/v1/job                          │
│  Auth: Clerk             │    ├── GET  /all                      │
│  HTTP: Axios             │    ├── POST /create                   │
│                          │    ├── POST /apply                    │
│                          │    ├── POST /select-candidate         │
│                          │    ├── POST /close                    │
│                          │    ├── POST /recruiter-jobs           │
│                          │    └── POST /applied-jobs             │
│                          │                                       │
│                          │  /api/v1/user                         │
│                          │    ├── POST /store                    │
│                          │    ├── POST /upload-resume            │
│                          │    ├── POST /update-resume            │
│                          │    └── POST /resume                   │
│                          │                                       │
│                          │  AI: Groq SDK (Llama-3.3-70B)        │
│                          │  DB: MongoDB Atlas (Mongoose)         │
│                          │  Files: Multer → Mammoth (.docx)      │
└──────────────────────────┴──────────────────────────────────────┘
```

---

## 📁 Project Structure

```
prepify/
├── Prepify-backend/
│   └── src/
│       ├── index.js                  # App entry point — DB connect & server listen
│       ├── server.js                 # Express app, CORS, route mounting
│       ├── controllers/
│       │   ├── interview.controller.js  # AI interview logic (start, continue, fetch)
│       │   ├── job.controller.js        # Job board CRUD
│       │   └── user.controller.js       # User registration & resume management
│       ├── models/
│       │   ├── interview.model.js    # Interview schema (candidate, resume, transcript)
│       │   ├── job.model.js          # Job schema (title, desc, applicants, status)
│       │   ├── user.model.js         # User schema (clerkID, role)
│       │   └── resume.model.js       # Resume schema (candidateId, resumetext)
│       ├── routes/
│       │   ├── interview.route.js    # Interview API routes
│       │   ├── job.route.js          # Job API routes
│       │   └── user.route.js         # User API routes
│       ├── middleware/
│       │   └── multer.middleware.js  # File upload handling
│       ├── database/
│       │   └── db.connect.js         # MongoDB Atlas connection
│       └── utils/
│           ├── ApiError.js           # Standardized error class
│           ├── ApiResponse.js        # Standardized response class
│           ├── asyncHandler.js       # Async error wrapper
│           └── prompt.js             # AI prompt templates
│
└── prepify-frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx                   # Routing (BrowserRouter + Routes)
        ├── main.jsx                  # React + ClerkProvider entry
        ├── Components/
        │   └── Header.jsx            # Persistent navigation bar
        └── Pages/
            ├── Landingpage.jsx       # Hero, features, how-it-works, testimonials
            ├── ModeSelect.jsx        # Candidate / Recruiter role selection
            ├── CandidateDashboard.jsx# Job browsing, application, interview history
            ├── RecruiterDashboard.jsx# Job management, applicant review
            ├── Resumeuplod.jsx       # Resume upload + interview start
            └── Interview.jsx         # Live AI interview chat (voice + text)
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite 7** | Build tooling & dev server |
| **TailwindCSS 3** | Utility-first styling |
| **React Router DOM 7** | 
| **Axios** | HTTP client for API calls |
| **Lucide React** | Icon library |
| **Web Speech API** | Voice recognition (browser native) |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express 5** | REST API server |
| **MongoDB + Mongoose 8** | Database & ODM |
| **Groq SDK** | LLM API client (Llama-3.3-70B) |
| **Multer** | `.docx` resume file uploads |
| **Mammoth** | `.docx` → plain text extraction |
| **dotenv** | Environment variable management |
| **CORS** | Cross-origin request handling |
| **Nodemon** | Dev server hot-reloading |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- A **MongoDB Atlas** cluster (free tier works)
- A **Groq API key** ([get one free](https://console.groq.com))
---

### Backend Setup

```bash
# 1. Navigate to the backend directory
cd Prepify-backend

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
# (then fill in the values — see Environment Variables section below)

# 4. Start the development server
npm start
```

The API server will start on the port defined in your `.env` (default: `8000`).

---

### Frontend Setup

```bash
# 1. Navigate to the frontend directory
cd prepify-frontend

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
# (then fill in the values — see Environment Variables section below)

# 4. Start the development server
npm run dev
```

The frontend dev server will start at `http://localhost:5173`.

---

## 📡 API Reference

### Interview Routes — `/api/v1/interview`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/start-interview` | Start a new AI interview session. Accepts `multipart/form-data` with `candidate`, `jobId` (optional), `candidateId` (optional), and a `.docx` resume file (`file`). | Public |
| `POST` | `/continue-interview` | Send a candidate's reply and get the next AI question. Body: `{ interviewId, userMessage }`. | Public |
| `POST` | `/by-job` | Get all interviews linked to a specific job. Body: `{ jobId }`. | Recruiter |
| `POST` | `/by-candidate` | Get all interviews for a candidate. Body: `{ candidateId }`. | Candidate |

### Job Routes — `/api/v1/job`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/all` | Fetch all open job postings. |
| `POST` | `/create` | Create a new job. Body: `{ jobTitle, jobDescription, recruiterClerkID }`. |
| `POST` | `/apply` | Candidate applies to a job. Body: `{ clerkID, jobId }`. |
| `POST` | `/select-candidate` | Recruiter selects a candidate. Body: `{ clerkID, jobId }`. |
| `POST` | `/close` | Close a job posting. Body: `{ jobId }`. |
| `POST` | `/recruiter-jobs` | Get all jobs created by a recruiter. Body: `{ recruiterClerkID }`. |
| `POST` | `/applied-jobs` | Get all jobs a candidate has applied to. Body: `{ clerkID }`. |

### User Routes — `/api/v1/user`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/store` | Register a user on first Clerk sign-in. Body: `{ clerkID, role }`. |
| `POST` | `/upload-resume` | Upload a new `.docx` resume. `multipart/form-data` with `clerkID` and `resume`. |
| `POST` | `/update-resume` | Replace an existing resume. `multipart/form-data` with `clerkID` and `resume`. |
| `POST` | `/resume` | Retrieve a stored resume. Body: `{ clerkID }`. |

---

## 🔐 Environment Variables

### Backend — `Prepify-backend/.env`

```env
PORT=8000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/prepify
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxx
GROQ_MODEL=llama-3.3-70b-versatile   # optional, this is the default
```

### Frontend — `prepify-frontend/.env`

```env
VITE_BACKEND_URL=http://localhost:8000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxx
```

---

## ⚙️ How It Works

```
1. User lands on the homepage and selects their role:
   ├── Candidate → enters name → Candidate Dashboard
   └── Recruiter → enters name → Recruiter Dashboard

2. Candidate Flow:
   ├── Browse open job listings
   ├── Apply to a job
   ├── Upload resume (.docx) → hits /start-interview
   │     └── Backend: extracts text (Mammoth) → stores in DB → calls Groq API
   │           └── Groq returns opening question using candidate's resume + job context
   ├── Interview page: candidate speaks/types answer → hits /continue-interview
   │     └── Backend: appends to transcript → calls Groq → returns next question
   └── End interview → AI provides improvement feedback

3. Recruiter Flow:
   ├── Create job postings
   ├── View applicants per job
   ├── Read full AI interview transcripts
   └── Mark candidates as "selected" or close the job
```

---

## 👥 Team

Prepify was built as a collaborative project by four passionate developers:

| Role | Name | Contribution |
|---|---|---|
| 🏆 **Project Lead & Full-Stack** | **Jaydeep Ahir** | Led the project end-to-end; contributed significantly to both frontend and backend architecture, AI integration, and overall system design. |
| ⚙️ **Backend Developer** | **Harshit Nakrani** | Built the Express REST API, MongoDB data models, Groq AI integration, Multer/Mammoth resume pipeline, and all server-side business logic. |
| 🎨 **Frontend Developer** | **Jihan Gajjar** | Developed the React UI — pages, routing, interview chat interface, and dashboards for both user roles. |
| 🖌️ **UI Designer** | **Kashyap Chauhan** | Designed the visual identity, UI/UX layouts, color system, and overall look-and-feel of the platform. |

---

<div align="center">

Built by the **Prepify Team**

*Powered by [Groq](https://groq.com) · [MongoDB Atlas](https://www.mongodb.com/atlas)

© 2026 Prepify. All rights reserved.

</div>
