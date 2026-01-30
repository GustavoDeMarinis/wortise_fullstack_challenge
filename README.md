# Wortise Fullstack Challenge

Fullstack CMS application built as part of the **Wortise technical challenge**.  
The project is implemented using **Next.js App Router** with a fully type-safe backend powered by **tRPC**, **MongoDB (native driver)**, and **BetterAuth**.

---

## 🚀 Tech Stack

### Core
- **Next.js** (App Router)
- **TypeScript**
- **tRPC** (end-to-end type safety)
- **MongoDB** (native driver)
- **BetterAuth** (authentication)

### Frontend
- **React**
- **Tailwind CSS**
- **TanStack Query**
- **React Hook Form**
- **Zod**

### Tooling
- **Docker** (MongoDB for local development)
- **ESLint**
- **Prettier** (optional)

---

## 🧱 Architecture Overview

This project follows a **fullstack monolith architecture** using Next.js:

- **Frontend** and **Backend** live in the same codebase
- Backend logic is implemented via **tRPC**, not REST
- MongoDB access uses the **native driver**
- Authentication is centralized via **BetterAuth**
- Strong typing is enforced end-to-end using **TypeScript + Zod**

### High-level structure

```txt
src/
├── app/            # Next.js App Router (UI + API routes)
├── server/         # Backend logic (db, auth, trpc, schemas)
├── utils/          # Shared utilities (tRPC client)
