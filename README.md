# LocalLens

**LocalLens** is a crowdsourced review platform for local businesses. Users can browse businesses by category and location, submit reviews with quality/service/value ratings and optional photos, while admins approve reviews before they're published.

## Features

✅ **Browse Local Businesses** - Search, filter by category and location
✅ **Crowdsourced Reviews** - Users submit reviews with ratings for quality, service, and value
✅ **Photo Uploads** - Optional photo upload with reviews
✅ **Admin Dashboard** - Review moderation before publishing
✅ **Rating Breakdowns** - Overall and category-specific ratings

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account with configured project
- Environment variables set

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Set up Supabase tables (see `supabase/schema.sql`):
   - Run the SQL schema in your Supabase SQL editor
   - Run seed data if desired: `supabase/seed.sql`

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build for Production

```bash
npm run build
npm run start
```

## Tech Stack

- **Framework**: Next.js 16 with Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage

## Project Structure

```
app/                    # App Router pages
components/             # React components
lib/                    # Utilities and types
  ├── supabase/        # Supabase clients
  ├── types.ts         # TypeScript types
  └── env.ts           # Environment setup
supabase/               # Database schema and seed data
```

## Routes

- `/` - Browse businesses (homepage)
- `/login` - User login
- `/signup` - User registration
- `/business/[id]` - Business details and reviews
- `/admin` - Admin dashboard (admin only)

## Key Components

- **HomePage** - Business browsing with filters
- **ReviewFormSection** - Review submission form
- **AdminReviewRow** - Review card for admin approval
- **BusinessDetailsHeader** - Business info display
- **RatingStars** - Star rating display

## Admin Access

To make a user an admin:
1. Create a user account
2. Update the `profiles` table in Supabase
3. Set `role = 'admin'` for that user's profile

## Database Schema

- `profiles` - User profiles and roles
- `businesses` - Local business listings
- `reviews` - User reviews (pending/approved/rejected)
- `business_ratings` - Aggregate ratings view

See `supabase/schema.sql` for complete schema with RLS policies.
