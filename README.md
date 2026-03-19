# LocalLens

**LocalLens** is a crowdsourced review platform for local businesses. Users can browse businesses by category and location, submit reviews with quality/service/value ratings and optional photos, while admins approve reviews before they're published.
It includes:
- Business discovery with search and multi-filter support
- Category and location based browsing
- Business detail pages with reviews and ratings
- Favorites and profile pages persisted in local storage
- Mock auth flow with role-based admin access
- Admin dashboard for review moderation and content management

# Contributors 

**Ayushi Gupta** - Backend & Database<br>
**Lakshika** - Backend <br>
**Khushi Kankheria** - Frontend (User Dashboard & Admin Dashboard) <br>
**Hemlata** - Added Image Feature   <br>
**Divya Verma**- Implemented Animation<br>

## User Dashboard 
![image alt](https://github.com/Khushikankheria/Local_lens/blob/main/WhatsApp%20Image%202026-03-19%20at%206.04.49%20PM.jpeg?raw=true)
![image alt](https://github.com/Khushikankheria/Local_lens/blob/main/WhatsApp%20Image%202026-03-19%20at%206.05.23%20PM.jpeg?raw=true)
![image alt](https://github.com/Khushikankheria/Local_lens/blob/main/WhatsApp%20Image%202026-03-19%20at%206.05.46%20PM.jpeg?raw=true)

## Admin Dashboard
![image alt](https://github.com/Khushikankheria/Local_lens/blob/main/WhatsApp%20Image%202026-03-19%20at%206.06.07%20PM.jpeg?raw=true)
![image alt](https://github.com/Khushikankheria/Local_lens/blob/main/WhatsApp%20Image%202026-03-19%20at%206.06.53%20PM.jpeg?raw=true)


## Features

**Browse Local Businesses** - Search, filter by category and location <br>
**Crowdsourced Reviews** - Users submit reviews with ratings for quality, service, and value <br>
**Photo Uploads** - Optional photo upload with reviews <br>
**Admin Dashboard** - Review moderation before publishing <br>
**Rating Breakdowns** - Overall and category-specific ratings <br>

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


```
h RLS policies.
