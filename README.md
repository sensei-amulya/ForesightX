This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file
# ForesightX

Multi-tenant analytics platform for small businesses.

## Features
- **Multi-tenant Authentication**: Secure login with organization isolation.
- **KPI Analytics & Trends**: Visual dashboards with revenue, orders, and customer metrics.
- **Date-Range Filtering**: Filter analytics by last 7 or 30 days.
- **CSV Bulk Upload**: Easily upload large datasets for analysis.
- **Secure Tenant Isolation**: Data privacy ensured via strict org-level filtering.

## Architecture
- **Framework**: Next.js (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based auth with custom middleware
- **Styling**: Tailwind CSS / Vanilla CSS
- **Visualization**: Recharts for trend analysis

## Screenshots
> *(Screenshots placeholder - Add dashboard images here)*

## How to Run
1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd foresightx
   ```

2. **Setup Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/foresightx"
   JWT_SECRET="your-secret-key"
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Run Database Migrations**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
