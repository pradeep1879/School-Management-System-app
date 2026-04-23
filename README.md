# 🎓 School ERP System

A full-stack, role-based School ERP platform built for day-to-day academic operations, classroom workflows, assessments, attendance, finance, and communication.

This project combines a modern React + TypeScript frontend with an Express + Prisma backend to deliver a production-style school management system for **Admins**, **Teachers**, and **Students**. It is designed around real operational flows such as class management, exam lifecycle control, result publishing, attendance approval, fee collection, timetable scheduling, announcements, and academic analytics.

---

## 🚀 Project Overview

The School ERP System centralizes core school operations into a single web application.

It helps schools manage:

- class and section administration
- teacher and student records
- subject allocation and syllabus tracking
- student and teacher attendance
- exams, marks entry, publishing, and rankings
- fees, installments, salary, and finance dashboards
- announcements, calendar events, and timetable management
- student-facing learning tools such as AI quiz practice

The project is structured as a multi-role system where each user sees workflows relevant to their responsibility:

- **Admin** manages the school end to end
- **Teacher** manages assigned academic work and personal attendance
- **Student** accesses results, homework, fees, timetable, attendance, and learning tools

---

## ✨ Features

### Admin Features

- 🔐 Secure admin authentication and profile management
- 🏫 Create and manage classes with **section + academic session**
- 👨‍🏫 Manage teachers and assign class teachers
- 👨‍🎓 Add and manage students with class-based enrollment
- 📚 Create subjects and map teachers to subjects
- 📝 Create exams with multiple subjects and marks configuration
- 🚦 Move exams through lifecycle states: `SCHEDULED → ONGOING → EVALUATION → PUBLISHED`
- 🔒 **Publish-lock exam workflow**
  - cannot publish until all marks are entered
  - cannot edit published exams
- 🏆 View exam analytics, grade distribution, toppers, and ranks
- ✅ Mark and monitor student attendance
- ✅ Review teacher attendance and approval status
- 📅 Create and manage school calendar events
- 🗓️ Create conflict-safe class timetable slots
- 📢 Send announcements to school-wide, teacher, or class-specific audiences
- 💰 Finance module
  - fee setup by class/session
  - fee components and installment generation
  - fee collection dashboard
  - salary generation and payout tracking
- 📊 Dashboard analytics for attendance, school overview, and operations

### Teacher Features

- 🔐 Teacher authentication and profile settings
- 📋 Personalized dashboard with:
  - assigned class context
  - today’s schedule
  - attendance request status
  - announcements
- 👩‍🏫 Class-teacher restricted access to class-bound modules
- 👨‍🏫 Subject-teaching timetable visibility across assigned slots
- ✅ Submit own attendance request
- 📚 View subjects and syllabus
- 📝 Manage class exams and marks entry
- 📈 Access result and exam analytics screens
- 🏫 Manage class activities and homework
- 📢 View announcements and school calendar
- 🕒 Access own timetable and personal attendance history

### Student Features

- 🔐 Student authentication and profile settings
- 🏠 Personalized student dashboard
- 📚 View subjects and syllabus progress
- 📝 View published exam results and rankings
- 📈 Track attendance analytics
- 🏫 View activities, homework, timetable, and calendar
- 💳 View fee details and installment status
- 🤖 Access AI Quiz dashboard, attempts, and results
- 📢 Read announcements with unread/read state handling

### Highlight Features

| Feature | Description |
|---|---|
| 🔒 Exam Publish Lock | Results cannot be published until all marks are entered, and published exams cannot be edited |
| 🏆 Ranking System | Student result flows compute and display rank and performance summaries |
| 📆 SaaS-style Timetable & Calendar | Role-aware timetable and calendar with admin CRUD and teacher/student filtered views |
| 🧾 Fee Installment Engine | Supports fee components, installment generation, collection tracking, and due management |
| 📣 Real-time Announcements | Announcement flow includes unread state management and WebSocket-driven updates |
| 👨‍🏫 Class-Teacher Access Guard | Class-specific teacher routes are protected so only eligible teachers can access them |
| 📊 Analytics Dashboards | Admin, exam, student, and attendance analytics are built into the product |

---

## 🏗️ Tech Stack

### Frontend

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite |
| Language | TypeScript |
| State Management | Zustand |
| Data Fetching | TanStack Query |
| Routing | React Router |
| Forms & Validation | React Hook Form + Zod |
| UI | Tailwind CSS + ShadCN UI + Radix UI |
| Charts | Recharts |
| Notifications | Sonner |

### Backend

| Layer | Technology |
|---|---|
| Runtime | Bun |
| Framework | Express.js |
| Language | TypeScript |
| ORM | Prisma |
| Validation | Zod |
| Auth | JWT |
| File Uploads | express-fileupload |
| Realtime | WebSocket (`ws`) |
| Scheduling | node-cron |

### Database & Infra

| Layer | Technology |
|---|---|
| Database | PostgreSQL |
| ORM Schema | Prisma Schema |
| Image Storage | ImageKit |
| Frontend Deployment | Vercel |
| Backend Deployment | Railway |

---

## 📂 Project Structure

```bash
school-management-system/
├── backend/
│   ├── index.ts
│   ├── package.json
│   └── src/
│       ├── middlewares/
│       ├── modules/
│       │   ├── admin/
│       │   ├── teacher/
│       │   ├── student/
│       │   ├── class/
│       │   ├── subject/
│       │   ├── exam/
│       │   ├── attendance/
│       │   ├── fee/
│       │   ├── salary/
│       │   ├── timetable/
│       │   ├── calendar/
│       │   ├── announcement/
│       │   ├── analytics/
│       │   ├── homeWork/
│       │   ├── activity/
│       │   └── aiQuiz/
│       ├── prisma/
│       │   └── schema.prisma
│       ├── services/
│       ├── utils/
│       └── websocket/
├── client/
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── api/
│       ├── app/
│       ├── components/
│       ├── layouts/
│       ├── store/
│       ├── features/
│       │   ├── admin/
│       │   ├── teacher/
│       │   ├── student/
│       │   ├── class/
│       │   ├── exam/
│       │   ├── attendance/
│       │   ├── announcements/
│       │   ├── timetable/
│       │   ├── calendar/
│       │   └── subject/
│       └── finance/
│           ├── fee/
│           └── salary/
└── ops/
    ├── deployment.yml
    ├── service.yml
    ├── manifest.yml
    └── kind.yml
```

### Structure Notes

- `backend/src/modules/*` follows a modular Express architecture by business domain.
- `client/src/features/*` groups UI, hooks, pages, and APIs by feature.
- `client/src/finance/*` isolates fee and salary workflows from academic modules.
- `ops/` contains deployment manifests for container/orchestration use.

---

## ⚙️ Installation & Setup

## Prerequisites

Make sure you have:

- **Node.js** 20+
- **npm**
- **Bun**
- **PostgreSQL**
- **ImageKit account** for media uploads
- optional: **Railway** and **Vercel** accounts for deployment

---

## 1. Clone the repository

```bash
git clone https://github.com/your-username/school-management-system.git
cd school-management-system
```

---

## 2. Install dependencies

### Frontend

```bash
cd client
npm install
```

### Backend

```bash
cd ../backend
bun install
```

---

## 3. Configure environment variables

### Backend `.env`

Create `backend/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB_NAME"
PORT=3000
JWT_SECRET="your_jwt_secret"
NODE_ENV="development"

IMAGEKIT_PUBLIC_KEY="your_imagekit_public_key"
IMAGEKIT_PRIVATE_KEY="your_imagekit_private_key"
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your-endpoint"

# Optional if using AI quiz/generative features
GEMINI_API_KEY="your_gemini_api_key"
```

### Frontend `.env`

Create `client/.env`:

```env
VITE_API_URL="http://localhost:3000/api/v1"
```

---

## 4. Prisma setup

Generate Prisma client:

```bash
cd backend
bun run prisma:generate
```

Apply migrations:

```bash
bun run prisma:migrate
```

If you are starting from scratch and need migration files generated during development, use Prisma’s standard dev migration flow in your local environment before deploying.

---

## 5. Run the backend

```bash
cd backend
bun run dev
```

Backend should be available at:

```bash
http://localhost:3000
```

Health check:

```bash
http://localhost:3000/health
```

---

## 6. Run the frontend

```bash
cd client
npm run dev
```

Frontend should be available at:

```bash
http://localhost:5173
```

---

## 7. Production build

### Frontend

```bash
cd client
npm run build
```

### Backend typecheck

```bash
cd backend
bun run typecheck
```

---

## 🔐 Authentication & Roles

The system uses **JWT-based authentication** with role-aware route protection.

### Supported Roles

| Role | Access Scope |
|---|---|
| `admin` | Full school control |
| `teacher` | Personal dashboard + teaching workflows + restricted class access |
| `student` | Personal academic and finance access |

### Access Control Design

- backend middleware verifies token and role before protected routes execute
- frontend route guards prevent unauthorized page access
- teacher-specific class flows are guarded so only valid class teachers can access class-bound pages
- student routes are scoped to the logged-in student’s own class, attendance, results, timetable, and fees

### Auth Flow

1. user logs in from role-specific login page
2. backend validates credentials and signs a JWT
3. frontend stores auth state using Zustand
4. Axios sends authenticated requests to the backend
5. protected routes and APIs enforce role permissions

---

## 📊 Modules Explanation

## 1. Admin

The admin module is the control center of the ERP.

It includes:

- teacher and student management
- class creation with section and academic session
- finance operations
- announcements
- timetable and calendar management
- school-level dashboards and analytics

---

## 2. Teachers

The teacher module provides a work-focused interface rather than a generic admin clone.

It includes:

- personalized dashboard
- class-teacher restricted class access
- timetable and daily schedule
- attendance request workflow
- exam creation and marks entry
- announcements and calendar
- class-specific student, subject, activity, and result flows

---

## 3. Students

The student module is a read-mostly academic portal.

It includes:

- dashboard
- attendance analytics
- subjects and syllabus
- homework and activities
- timetable and calendar
- published results
- fees and installment tracking
- AI quiz practice

---

## 4. Classes

The class module models:

- class slug
- section
- academic session
- class teacher
- linked students
- linked subjects
- linked exams, homework, attendance sessions, fees, timetable, and calendar events

The codebase also aligns fee setup and other class-bound flows with the class session so records stay scoped correctly to the academic year.

---

## 5. Students

The student module supports:

- admissions and profile records
- class assignment
- roll-number uniqueness within class
- attendance records
- fee installments
- exam results
- AI quiz attempts

---

## 6. Subjects & Syllabus

Subjects are created per class and can be assigned to teachers.

Syllabus is tracked through chapter entities with status, enabling subject-wise academic planning and progress tracking.

---

## 7. Exams & Results

This is one of the stronger parts of the system.

### Exam Flow

1. create exam for a class
2. attach subjects with total marks and passing marks
3. auto-generate result rows for enrolled students
4. move exam into evaluation
5. enter marks
6. publish only when all marks are complete
7. expose results to students

### Result Features

- published-result gating
- rank generation
- percentage calculation
- student result cards
- class result and exam analytics
- top student / topper style summaries

---

## 8. Attendance

### Student Attendance

- class attendance sessions
- date-scoped attendance marking
- attendance analytics and summaries
- student attendance profile pages

### Teacher Attendance

- teacher submits attendance request
- approval workflow exists on admin side
- teacher self-attendance views
- dashboard and historical statistics

---

## 9. Finance

### Fee Management

- class/session-based fee setup
- fee components
- installment generation
- fee collection
- due tracking
- finance dashboard

### Salary Management

- salary structure
- payroll generation
- payout status
- teacher self salary history

---

## 10. Timetable

The timetable module supports:

- recurring weekly slots
- class-based timetable management
- teacher conflict detection
- class overlap prevention
- teacher self timetable
- teacher daily schedule widgets
- student read-only timetable

---

## 11. Calendar

The calendar module supports:

- school-wide events
- class-specific events
- event types such as holidays, notices, exams, and events
- role-aware filtered visibility for admin, teacher, and student

---

## 12. Announcements

The announcement system supports:

- role-targeted communication
- unread/read tracking
- admin and teacher announcement flows
- real-time updates through WebSocket-backed client handling

---

## 13. Homework & Activities

These modules manage day-to-day academic operations outside exams:

- homework assignment
- activities by class
- due dates and scheduling
- teacher-facing class workflows
- student-facing read views

---

## 14. AI Quiz

The project also includes a student AI quiz module with:

- quiz dashboard
- attempt flow
- result flow
- AI-backed generation/service integration hooks

---

## 🧠 Architecture Overview

This application follows a **frontend-client ↔ API-server ↔ database** architecture.

### High-Level Flow

- React frontend handles UI, routing, local auth state, and data fetching
- Axios connects the frontend to REST APIs exposed by Express
- Express routes delegate to modular services/controllers
- Prisma manages database access and relations
- PostgreSQL stores school, academic, attendance, finance, and timetable data
- WebSocket support is used for real-time announcement updates

### API Flow

1. frontend page or hook triggers a query/mutation
2. Axios sends request to `/api/v1/*`
3. Express route validates request and checks JWT/role
4. controller delegates to service layer
5. service runs Prisma queries / business logic
6. response returns to frontend
7. TanStack Query updates cache and UI

### Mermaid Diagram

```mermaid
flowchart LR
    A["React + Vite Frontend"] --> B["Axios API Client"]
    B --> C["Express.js API (/api/v1)"]
    C --> D["Auth Middleware (JWT + Role Check)"]
    D --> E["Module Controllers"]
    E --> F["Service Layer"]
    F --> G["Prisma ORM"]
    G --> H["PostgreSQL"]

    C --> I["WebSocket Server"]
    I --> J["Realtime Announcements"]
```

### Frontend Architecture

```mermaid
flowchart TD
    A["Pages"] --> B["Feature Hooks"]
    B --> C["TanStack Query"]
    C --> D["Axios"]
    A --> E["Zustand Store"]
    A --> F["ShadCN + Tailwind UI"]
```

### Backend Architecture

```mermaid
flowchart TD
    A["Route"] --> B["Validation Middleware"]
    B --> C["Auth Middleware"]
    C --> D["Controller"]
    D --> E["Service"]
    E --> F["Prisma Client"]
    F --> G["PostgreSQL"]
```

---

## 📸 Screenshots

Add your latest product screenshots here before publishing the repository publicly.

### Admin Dashboard

```md
![Admin Dashboard](./docs/screenshots/admin-dashboard.png)
```

### Teacher Dashboard

```md
![Teacher Dashboard](./docs/screenshots/teacher-dashboard.png)
```

### Student Dashboard

```md
![Student Dashboard](./docs/screenshots/student-dashboard.png)
```

### Timetable

```md
![Timetable](./docs/screenshots/timetable.png)
```

### Calendar

```md
![Calendar](./docs/screenshots/calendar.png)
```

### Exam Results

```md
![Exam Results](./docs/screenshots/exam-results.png)
```

---

## 🚀 Deployment

## Frontend Deployment on Vercel

1. import the `client` folder as a Vercel project
2. set the build command:

```bash
npm run build
```

3. set the output directory:

```bash
dist
```

4. configure environment variable:

```env
VITE_API_URL=https://your-backend-domain/api/v1
```

---

## Backend Deployment on Railway

Deploy the `backend` folder as a separate Railway service.

### Recommended Railway Settings

- **Root Directory:** `backend`
- **Start Command:** `bun run start`
- **Build Command:** optional, or rely on install/postinstall
- **Port:** Railway injects `PORT`

### Required Railway Environment Variables

```env
DATABASE_URL=...
PORT=...
JWT_SECRET=...
NODE_ENV=production
IMAGEKIT_PUBLIC_KEY=...
IMAGEKIT_PRIVATE_KEY=...
IMAGEKIT_URL_ENDPOINT=...
GEMINI_API_KEY=...
```

### Important Deployment Notes

- ensure Railway is deploying the **backend** service, not the frontend root
- ensure `DATABASE_URL` points to the production PostgreSQL instance
- ensure Prisma migrations are applied in production
- point Vercel frontend `VITE_API_URL` to Railway backend `/api/v1`

---

## 🤝 Contribution Guide

Contributions are welcome if you want to improve the ERP, refactor modules, strengthen validations, or polish the UI.

### Recommended Workflow

1. fork the repository
2. create a feature branch

```bash
git checkout -b feature/your-feature-name
```

3. make changes in the relevant `client/` or `backend/` module
4. run checks locally

```bash
# frontend
cd client
npm run build

# backend
cd ../backend
bun run typecheck
```

5. open a pull request with:
- clear summary
- affected modules
- screenshots for UI changes
- migration notes if Prisma schema changed

### Contribution Guidelines

- keep modules feature-focused
- follow the current frontend feature structure
- keep backend business logic in services, not controllers
- do not bypass role-based guards
- document any new environment variables
- include migration notes for database changes

---

## 📄 License

This project currently does not include a formal open-source license file.

If you plan to make it public, add a license such as:

- MIT
- Apache-2.0
- GPL-3.0

Example placeholder:

```md
Copyright (c) 2026

All rights reserved until a LICENSE file is added.
```

---

## ✅ Summary

This School ERP System is a full-stack, role-aware academic operations platform built with modern frontend and backend tooling. It goes beyond basic CRUD by including exam publishing controls, ranking workflows, attendance approvals, finance modules, timetable/calendar management, real-time announcements, and student-facing academic utilities.

If you are evaluating the project, the strongest areas to explore first are:

- exam lifecycle and result publishing
- attendance and analytics flows
- class/session-aware fee management
- timetable and calendar modules
- multi-role dashboards and guarded routes
