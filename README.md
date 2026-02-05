# Wortise Fullstack Challenge

A modern Article Management System built with the latest Next.js stack, demonstrating clean architecture, type safety, and server-first data fetching.

## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **API:** [tRPC v11](https://trpc.io/) (Server Actions & Client Hooks)
- **Database:** [MongoDB](https://www.mongodb.com/) (Native Driver)
- **Validation:** [Zod](https://zod.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Auth:** [Better Auth](https://better-auth.com/)
- **State/Forms:** React Hook Form

## 🏗️ Architecture

This project follows a layered architecture to ensure separation of concerns and maintainability:

### Data Flow
1. **Presentation Layer (Server Components):** Pages fetch data directly using tRPC "Server Callers" (`api.article.listPaginated`), ensuring type safety without standard HTTP overhead for initial renders.
2. **Procedure Layer (tRPC Routers):** Defines API contracts and input validation using Zod. Located in `src/server/trpc/routers`.
3. **Domain Layer (Repositories):** Encapsulates all database logic (`src/server/repositories`). This abstraction allows swapping the DB driver if needed and centralizes query logic.
4. **Data Layer (MongoDB):** Direct connection via native driver for high performance.

### Key Decisions
- **Server Components:** `page.tsx` is completely server-side rendered. Data is fetched on the server and passed to the UI.
- **Repository Pattern:** Logic for pagination, soft deletes, and CRUD is isolated in `article.repository.ts`, keeping routers clean.
- **Soft Deletes:** Articles are not physically removed. A `deletedAt` timestamp is set, and queries automatically filter these out.
- **Manual Pagination:** Efficient server-side pagination using `skip` and `limit`, returning metadata (`totalPages`, `total`, etc.) for UI controls.

## 🛠️ Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd wortise-fullstack-challenge
   ```

2. **Environment Variables:**
   Copy the example file and fill in your credentials:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with:
   ```env
   # Database
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/dbname

   # BetterAuth
   BETTER_AUTH_SECRET=your_generated_secret
   BETTER_AUTH_URL=http://localhost:3000
   ```

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📍 Available Routes

| Route | Description |
|-------|-------------|
| `/` | Home page redirecting to articles or dashboard |
| `/articles` | List of articles with search & pagination |
| `/articles/[id]` | Article detail view |
| `/articles/new` | Create a new article |
| `/articles/[id]/edit` | Edit an existing article |
| `/login` | User authentication |
| `/register` | User registration |

## ⚠️ Assumptions & Limitations

- **Search:** Implemented via MongoDB text search or regex on specific fields (assumed case-insensitive match on title/content).
- **Soft Deletes:** Deleted articles effectively disappear from the UI but remain in the DB for audit/recovery.
- **Pagination:** Uses standard Page/Limit strategy.
