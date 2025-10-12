# SkillSwap

[![Repo](https://img.shields.io/badge/View%20on-GitHub-blue?logo=github)](https://github.com/Ramtin26/the-skill-swap)
[![Live](https://img.shields.io/badge/View%20Live-Vercel-black?logo=vercel)](https://the-skill-swap-eosin.vercel.app)

A modern **job marketplace web app** built with **Next.js 15**, connecting job seekers and employers seamlessly.
Users can explore job listings, save opportunities, and track applications, while employers manage postings and candidates—all in one responsive, intuitive platform.

## 🚀 Features

- 🔍 **Job Filtering** – Filter by location type (in-office, hybrid, remote)

- 💼 **Employer Tools** – Post, edit, and manage job listings

- 👤 **Seeker Tools** – Apply to jobs and track your application status

- 📂 **File Upload** – Upload PDF resumes when applying

- ⭐ **Bookmarking** – Save and manage favorite jobs easily

- 🧾 **Application Management** – Employers can review, rate, accept, or reject candidates

- ⚡ **Real-time Updates** – Uses Next.js App Router + Server Actions

- 🎨 **Responsive Design** – Optimized for desktop, tablet, and mobile

- 🔐 **Authentication** – Google sign-in with Supabase Auth

- 🗄️ **Database** – PostgreSQL (hosted on Supabase)

## 🧠 Tech Stack

- **Frontend & Backend**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: NextAuth.js + Supabase
- **UI Enhancements**: Framer Motion
- **Date Handling**: date-fns
- **Icons**: Heroicons
- **Deployment**: Vercel

## ⚙️ How It Works

SkillSwap integrates **Supabase** for data persistence and authentication, providing a smooth, secure user experience.
All sensitive operations (like job posting, profile updates, and application handling) are executed via **Next.js Server Actions** on the backend.
The client layer runs React 19 with concurrent rendering, ensuring a fast and fluid UX without full-page reloads.

## 🧩 Environment Variables

Create a `.env.local` file in the project root:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret
```

## 🖼️ Live Demo

👉 [Live Demo: SkillSwap on Vercel](https://the-skill-swap-eosin.vercel.app)

## 💻 Run Locally

```bash
# Clone the repository

git clone https://github.com/Ramtin26/the-skill-swap.git

# Navigate to the project directory

cd the-skill-swap

# Install dependencies

npm install

# Run the development server

npm run dev
```
