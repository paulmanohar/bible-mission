# Bible Mission Website

## Overview
Full-stack web application for Bible Mission, a global religious organization headquartered in Guntur, Andhra Pradesh. Inspired by the design of GTY.org and Ligonier.org.

## Tech Stack
- **Frontend**: React 19 (JSX), Tailwind CSS v4, React Router (routing), Redux Toolkit (state management)
- **Backend**: Express 5, Node.js (separated API layer)
- **Database**: AWS RDS MySQL 8 with Drizzle ORM
- **Fonts**: Inter (sans), Lora (serif)

## Architecture
- Frontend uses JSX files (not TSX) with Redux for all state management
- API service layer (`client/src/services/api.js`) handles all HTTP calls to the backend
- Redux store with 6 slices: books, events, blog, media, auth, forms
- Backend Express routes serve API endpoints under `/api/*`
- Single port (5000) serves both Vite dev server and Express API

## Project Structure
```
client/src/
├── components/       # Reusable UI components (JSX)
│   ├── ui/           # shadcn/ui primitives (TSX, library code)
│   ├── Navbar.jsx    # Sticky navigation with auth state
│   ├── Hero.jsx      # Hero banner section
│   ├── ResourcesSection.jsx  # Books library with search & language tabs
│   ├── MeetingsSection.jsx   # Upcoming events
│   ├── MediaSection.jsx      # Livestreams & podcasts
│   ├── DevotionalSection.jsx # Blog posts & newsletter subscribe
│   ├── CTASection.jsx        # Prayer requests, join as member/pastor
│   └── Footer.jsx    # Footer with bank details, links, contacts
├── pages/
│   ├── Home.jsx          # Main landing page
│   ├── AboutPage.jsx     # About Us - mission, history, values, leadership
│   ├── ResourcesPage.jsx # Full book library, blog posts, podcasts, newsletter
│   ├── MeetingsPage.jsx  # All upcoming events with submit event modal
│   ├── ConnectPage.jsx   # Prayer/pastor/contact forms, helpline, bank details
│   ├── LoginPage.jsx     # Auth (login & register) with Redux
│   └── not-found.tsx
├── store/
│   ├── store.js          # Redux store configuration
│   └── slices/
│       ├── booksSlice.js     # Books state + async thunks
│       ├── eventsSlice.js    # Events state + async thunks
│       ├── blogSlice.js      # Blog posts state
│       ├── mediaSlice.js     # Podcasts & livestreams
│       ├── authSlice.js      # User authentication
│       └── formsSlice.js     # Form submissions (prayer, pastor, contact, newsletter)
├── services/
│   └── api.js            # API service layer (all backend calls)
└── lib/

server/
├── index.ts          # Express server entry
├── routes.ts         # API routes (books, events, blog, podcasts, auth, etc.)
├── storage.ts        # Database storage layer (Drizzle)
├── seed.ts           # Database seeder
├── static.ts         # Production static file serving
└── vite.ts           # Dev server Vite integration

shared/
└── schema.ts         # Drizzle schema + Zod validation schemas
```

## Database Tables
- `users` - Auth & profiles (member/pastor roles)
- `books` - Library of books (English & Telugu)
- `events` - Meetings with approval flow
- `prayer_requests` - User prayer submissions
- `blog_posts` - Devotional articles with slugs
- `podcasts` - Audio episodes
- `livestreams` - Scheduled & live broadcasts
- `newsletter_subscriptions` - Email signups
- `pastor_applications` - Pastor partnership requests
- `contact_messages` - General contact form

## Global Search System
- `search_index` table: denormalized view of all content (books, events, articles, podcasts, livestreams)
- Tags stored as text arrays on each content table + search index
- Faceted search with type/category/author/tag counts
- `POST /api/search/rebuild` regenerates the search index from source tables
- Redux `searchSlice` manages search state, filters, pagination
- SearchPage (`/search`) shows Ligonier-style results with sidebar facets

## API Routes (all prefixed /api)
- GET/POST `/api/books` - Books CRUD, search by query & language
- GET/POST `/api/events` - Events (approved only for GET)
- POST `/api/prayer-requests` - Submit prayer request
- GET/POST `/api/blog` - Blog posts
- GET/POST `/api/podcasts` - Podcast episodes
- GET/POST `/api/livestreams` - Livestream schedule
- POST `/api/newsletter` - Newsletter subscription
- POST `/api/pastor-applications` - Pastor partnership
- POST `/api/contact` - Contact messages
- POST `/api/auth/register` - Register (returns user + JWT token)
- POST `/api/auth/login` - Login (returns user + JWT token)
- POST `/api/auth/forgot-password` - Generate reset token
- POST `/api/auth/reset-password` - Reset password with token
- GET `/api/auth/me` - Get authenticated user profile (JWT required)
- PUT `/api/auth/profile` - Update profile (JWT required)
- PUT `/api/auth/change-password` - Change password (JWT required)
- GET `/api/search` - Global search (query: q, types, categories, tags, author, sort, page, limit)
- POST `/api/search/rebuild` - Rebuild search index

## Frontend Routes
- `/` - Home page
- `/about` - About Us page
- `/resources` - Book library, blog, podcasts, newsletter
- `/meetings` - Events list with submit event modal
- `/search` - Global search with faceted filtering
- `/connect` - Prayer requests, pastor applications, contact forms
- `/login` - Login / Register / Forgot Password / Reset Password
- `/profile` - User profile (edit profile, change password, account info)
- `/books/:id/:slug?` - Book detail page
- `/articles/:id/:slug?` - Article/blog post detail page
- `/podcasts/:id/:slug?` - Podcast episode detail page
- `/events/:id/:slug?` - Event/meeting detail page

## Detail Page Routing
- All cards (books, articles, podcasts, events) link to detail pages using SEO-friendly URLs
- URL pattern: `/{type}/{id}/{slug}` where slug is auto-generated from title
- Slug utility: `client/src/utils/slug.js` exports `toSlug()` and `itemPath()`
- Cards are clickable on: image, title, description, and action buttons
- Search results also link to detail pages (except Livestream which has no detail page)

## Media Components
- `client/src/components/media/` contains 4 media viewers + a switcher:
  - `PdfViewer.jsx` - Interactive PDF viewer (iframe-based) with download and fullscreen
  - `ImageViewer.jsx` - Image viewer with zoom in/out, rotate, reset, and fullscreen modal
  - `VideoPlayer.jsx` - Video player with custom controls, PiP mode; auto-detects YouTube URLs for embed
  - `AudioPlayer.jsx` - Styled audio player with play/pause, skip 15s, seek bar, mute
  - `MediaRenderer.jsx` - Switcher component that picks the right viewer based on `sourceType`
- Schema fields: `sourceUrl` (the media URL) and `sourceType` (pdf|image|video|audio|text)
- Tables with source fields: books, blogPosts, podcasts, livestreams, events
- Each detail page renders MediaRenderer when `sourceUrl` is present

## Admin Panel
- Accessible at `/admin/login` with admin credentials (role="admin" users only)
- Admin token stored separately in localStorage as `bm_admin_token`
- Admin API routes: `/api/admin/*` protected by `adminMiddleware` (JWT + role check)
- Full CRUD for: Books, Blog Posts (Articles), Podcasts, Events, Livestreams
- Admin dashboard shows content counts
- Dark sidebar layout with professional content management forms
- Login supports both username and email
- Admin pages: `client/src/pages/admin/`
- Admin Redux slice: `client/src/store/slices/adminSlice.js`
- Admin API methods: `adminApiService` in `client/src/services/api.js`

## Key Features
- Book search in both English and Telugu
- Upcoming meetings with pin locations and Google Maps links
- Livestream & podcast sections
- Prayer request system with 24/7 helpline info
- Newsletter subscription
- Pastor/Member registration
- Official bank details with fraud warning
- Responsive design (mobile + desktop)

## Authentication System
- JWT tokens (7 day expiry) stored in localStorage (key: `bm_token`)
- Passwords hashed with bcrypt (12 rounds)
- Auto-restore session on page load via `fetchProfile` thunk in `AuthBootstrap`
- Forgot password generates a reset token (valid 1 hour)
- Protected routes use `authMiddleware` in Express (Bearer token header)
- Redux `authSlice` manages all auth state (user, token, loading, errors, success flags)
- Packages: `jsonwebtoken`, `bcryptjs`
- Env var: `JWT_SECRET` (auto-generated, shared environment)

## Important Notes
- Database is AWS RDS MySQL 8.0 — drizzle-orm import path must be `drizzle-orm/mysql2` (NOT `drizzle-orm/node-postgres`)
- MySQL differences: No `.returning()` — use `insertAndReturn()` helper; use `like` not `ilike`; tags are `json` columns; tag filtering uses `JSON_CONTAINS()`
- RDS credentials: `RDS_HOST`, `RDS_PORT` (3306), `RDS_USER`, `RDS_PASSWORD`, `RDS_DATABASE`
- Migration workflow: update `shared/schema.ts` → `npm run db:generate` → `npm run db:migrate`
- All frontend components use JSX (not TSX), except shadcn/ui primitives
- Redux Toolkit is used for all state management (not TanStack Query)
- API service layer is at `client/src/services/api.js`
