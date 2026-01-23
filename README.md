# 🧺 Laundry Management App

A **full-stack web application** built with **Next.js** (App Router), designed to help laundry businesses manage customers, orders, and daily operations efficiently.

The app integrates **frontend UI**, **backend APIs**, **GraphQL**, and **NextAuth.js** for authentication, all in a single Next.js project.

---

## 🚀 Features

- Customer management: add, update, view
- Laundry order tracking
- Pickup & delivery scheduling
- Order status: Pending, In Progress, Completed
- Authentication & authorization (NextAuth.js)
- Daily operational overview for laundry owners
- Clean, user-friendly interface
- Location selection modal
- Phone number input with country selector (client-side only)

---

## 🛠️ Tech Stack

**Framework & Language**
- Next.js (App Router)
- TypeScript / JavaScript
- React

**UI**
- Tailwind CSS
- react-phone-input-2 (client-side only)
- react-hot-toast

**Backend**
- GraphQL API (via graphql-request)
- Prisma ORM v7.2.0 (no Rust)

**Database**
- PostgreSQL / MySQL

**Authentication**
- NextAuth.js

---

## 📂 Project Structure
```
Laundry-app/
│
├── .next/ # Next.js build output
├── node_modules/ # Installed dependencies
├── prisma/ # Prisma ORM schema & migrations
├── public/ # Public assets (images, favicon, etc.)
├── src/
│ ├── app/ # Next.js App Router pages & layouts
│ │ ├── api/ # Backend API routes
│ │ ├── component/ # Reusable UI components
│ │ ├── create-profile/ # Profile creation page
│ │ ├── login/ # Login page
│ │ ├── providers/ # Auth providers configuration
│ │ ├── signup/ # Signup page
│ │ └── verify-email/ # Email verification page
│ │ ├── layout.tsx # Root layout
│ │ └── page.tsx # Default page
│ │
│ ├── controllers/ # Business logic for APIs
│ ├── graphql/ # GraphQL queries & mutations(resolvers and schema)
│ ├── lib/ # Utility files (e.g., prisma.ts)
│ ├── services/ # Service layer (e.g., authService)
│ ├── slices/ # Redux slices
│ ├── store/ # Redux store configuration
│ └── types/ # TypeScript types
│
├── public/ # Static assets
│ └── favicon.webp
│
├── .env.example # Example environment variables
├── docker-compose.yml # Docker configuration
├── eslint.config.mjs # ESLint configuration
├── next-env.d.ts # Next.js TypeScript env types
├── globals.css # Global styles
├── page.module.css # Page-specific styles
└── middleware.ts # Custom middleware
```
---

## ⚙️ Installation & Setup

1. Clone the repository:

```bash
git clone https://github.com/your-username/laundry-app.git
```
2. Install dependencies:
```
npm install
```
3. Run Prisma migrations:
```
npx prisma migrate dev
```
4. Start development server:
```
npm run dev
```

