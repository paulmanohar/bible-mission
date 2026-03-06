# Bible Mission

Full-stack web application for **Bible Mission** ([biblemission.life](https://biblemission.life)), a global religious organization headquartered in Guntur, Andhra Pradesh. Inspired by the design of [GTY.org](https://www.gty.org) and [Ligonier.org](https://www.ligonier.org).

## Tech Stack

| Layer      | Technology                                         |
| ---------- | -------------------------------------------------- |
| Frontend   | React 19 (JSX), Tailwind CSS v4, wouter, Redux Toolkit |
| Backend    | Node.js, Express 5                                 |
| Database   | PostgreSQL with Drizzle ORM                        |
| Auth       | JWT (jsonwebtoken) + bcryptjs                      |
| Fonts      | Inter (sans), Lora (serif)                         |

---

## Prerequisites

- **Node.js** v20+
- **PostgreSQL** 15+ (running locally or a hosted instance)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/paulmanohar/bible-mission.git
cd bible-mission
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/bible_mission
JWT_SECRET=your-secret-key-here
```

> Generate a strong JWT secret:  
> `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### 4. Push the database schema

```bash
npm run db:push
```

This uses Drizzle Kit to create all tables in your PostgreSQL database.

### 5. Run the development server

```bash
npm run dev
```

This starts both the Express backend (API on port 5000) and the Vite frontend dev server. Open your browser at the URL shown in the terminal.

---

## Project Structure

```
bible-mission/
├── client/                  # Frontend (React + Redux)
│   ├── src/
│   │   ├── components/      # Reusable UI components (Navbar, Footer, Hero, etc.)
│   │   ├── pages/           # Route pages (Home, About, Resources, etc.)
│   │   ├── store/
│   │   │   ├── slices/      # Redux Toolkit slices (auth, books, events, etc.)
│   │   │   └── store.js     # Redux store configuration
│   │   ├── services/
│   │   │   └── api.js       # API service layer (all backend calls)
│   │   └── App.tsx          # Root component with routes and auth bootstrap
│   └── index.html
├── server/                  # Backend (Express)
│   ├── routes.ts            # All API route handlers
│   ├── storage.ts           # Database storage interface + Drizzle implementation
│   ├── seed.ts              # Seed data for development
│   └── index.ts             # Server entry point
├── shared/
│   └── schema.ts            # Drizzle ORM schema + Zod validation schemas
├── drizzle.config.ts        # Drizzle Kit configuration
├── package.json
├── tailwind.config.ts
├── vite.config.ts
└── tsconfig.json
```

---

## API Routes

### Public Endpoints

| Method | Route                   | Description                          |
| ------ | ----------------------- | ------------------------------------ |
| GET    | `/api/books`            | List books (query: `q`, `language`)  |
| GET    | `/api/books/:id`        | Get a single book                    |
| GET    | `/api/events`           | List approved events                 |
| GET    | `/api/blog`             | List published blog posts            |
| GET    | `/api/podcasts`         | List published podcasts              |
| GET    | `/api/livestreams`      | List livestreams                     |
| GET    | `/api/search`           | Global search with faceted filtering |
| POST   | `/api/prayer-requests`  | Submit a prayer request              |
| POST   | `/api/newsletter`       | Subscribe to newsletter              |
| POST   | `/api/pastor-applications` | Submit pastor partnership         |
| POST   | `/api/contact`          | Submit contact message               |

### Auth Endpoints

| Method | Route                       | Description                        |
| ------ | --------------------------- | ---------------------------------- |
| POST   | `/api/auth/register`        | Create account (returns JWT)       |
| POST   | `/api/auth/login`           | Sign in (returns JWT)              |
| POST   | `/api/auth/forgot-password` | Request password reset token       |
| POST   | `/api/auth/reset-password`  | Reset password with token          |
| GET    | `/api/auth/me`              | Get profile (JWT required)         |
| PUT    | `/api/auth/profile`         | Update profile (JWT required)      |
| PUT    | `/api/auth/change-password` | Change password (JWT required)     |

---

## Frontend Routes

| Route        | Page                                          |
| ------------ | --------------------------------------------- |
| `/`          | Home page                                     |
| `/about`     | About Us (mission, history, leadership)       |
| `/resources` | Book library, blog, podcasts, newsletter      |
| `/meetings`  | Events list with submit event modal           |
| `/search`    | Global search with faceted filtering          |
| `/connect`   | Prayer requests, pastor apps, contact, bank details |
| `/login`     | Login / Register / Forgot Password            |
| `/profile`   | User profile, edit info, change password      |

---

## Key Features

- Book library searchable in English and Telugu
- Global search across all content with faceted filters (type, category, tags, author)
- Upcoming meetings with location pins and Google Maps links
- Livestream and podcast sections
- Prayer request system with 24/7 helpline info
- Newsletter subscription
- Pastor and member registration
- Official bank details with fraud warning
- JWT authentication with password hashing (bcrypt)
- Forgot password and reset password flow
- User profile management
- Responsive design with full-screen mobile navigation
- Redux Toolkit state management throughout

---

## Database

The app uses **10 PostgreSQL tables** managed by Drizzle ORM:

`users`, `books`, `events`, `prayer_requests`, `blog_posts`, `podcasts`, `livestreams`, `newsletter_subscriptions`, `pastor_applications`, `contact_messages`, `search_index`

To reset and re-push the schema:

```bash
npm run db:push
```

---

## License

MIT
