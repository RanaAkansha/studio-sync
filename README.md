# StudioSync

A modern, light, role-aware client collaboration portal built for digital agencies like **Studio137**. Replace scattered email chains, Google Drive links, and WhatsApp threads with a single unified dashboard for managing projects, client assets, and interactive feedback.

---

## Key Features

- **🔑 Role-Aware Access Control (Admin vs. Client)**:
  - **Admins** can create client projects, upload deliverables/files, assign tasks, and monitor all clients.
  - **Clients** get a focused, read-only view of their specific projects, shared files, and direct feedback channels without administrative clutter.
- **💬 Real-Time Discussion Threads**: A Linear-style chat interface inside projects allowing clients to request revisions and admins to reply in real-time, styled with clear sender roles and custom avatars.
- **📂 Asset Deliverables Manager**: Central repository for tracking all design mockups, booking widget configurations, and asset links with direct source access.
- **🎨 Premium Minimalist UI**: Built using custom Tailwind CSS variables inspired by modern SaaS applications (Notion, Linear, Vercel). No heavy AI-style gradients or glassmorphism, just clean borders, sharp typography, and smooth transitions.

---

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, React Router v7, Axios, Lucide Icons
- **Backend**: Node.js, Express, JSON Web Tokens (JWT) for secure stateful sessions
- **Database**: PostgreSQL (Hosted on Neon serverless postgres)

---

## Getting Started

### 1. Database Initialization
Ensure you have your environment variables set in `server/.env`.
```bash
cd server
npm install
npm run seed
```
> The seeder automatically drops old tables, runs migrations (if needed), and populates authentic demo data tailored to actual Studio137 projects (Wine & Company, Hermanus Whale Festival, etc.).

### 2. Run Backend Dev Server
```bash
npm run dev
```
The server will boot on `http://localhost:5000`.

### 3. Run Frontend Client
```bash
cd ../client
npm install
npm run dev
```
Vite will start the client interface on `http://localhost:5173`.

---

## 🔐 Seeded Test Credentials

To preview both roles instantly, log in with the following credentials after seeding:

### 🛠️ Agency Admin Role
- **Email**: `stephen@studio137.co.za`
- **Password**: `admin123`
*(Simulates the perspective of Stephen Diederichs managing multiple client accounts)*

### 👤 Client Role
- **Email**: `client@wineandco.co.za`
- **Password**: `client123`
*(Simulates the client view inspecting the "Wine & Company E-Commerce Redesign" project)*

---

## 🚀 Production Deployment

### Frontend (e.g. Vercel / Netlify)
Set the environment variable on build:
```env
VITE_API_URL=https://your-deployed-backend.com/api
```

### Backend (e.g. Render / Heroku)
Set the following variables:
```env
DATABASE_URL=your_postgresql_uri
JWT_SECRET=your_jwt_secret
```
