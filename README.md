# Gidaa / RentDirect — MVP

This workspace contains a scaffold for converting the RentDirect prototype into a functional MVP using Next.js, TypeScript, Tailwind, and Supabase.

What's included:
- Next.js scaffold (src/pages)
- Supabase client wrapper (src/lib/supabaseClient.ts)
- Tailwind CSS setup
- Database schema: db/schema.sql (run in Supabase SQL editor)

Next steps (quick):
1. Install dependencies: `npm install`
2. Create a Supabase project and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in a `.env.local` file.
3. Run the SQL in `db/schema.sql` in your Supabase SQL editor to create tables and seed amenities.
4. Start dev server: `npm run dev`

I'll continue by implementing API routes, property pages, and the landlord/admin flows next. Want me to proceed with API routes and basic admin pages now?

Short one-line description of Gidaa: what it does and who it’s for.

[Optional badges: build | tests | license | coverage]

## Table of Contents
- [About](#about)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#usage)
- [Development](#development)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## About
A short paragraph describing the project in more detail. Mention the problem it solves and high-level architecture or tech stack.

## Features
- Feature 1 (what it does)
- Feature 2
- Feature 3

## Getting Started

### Prerequisites
List required tools and versions, e.g.:
- Node.js >= 18 (or Python 3.11, etc.)
- Docker (optional)
- Any external services or APIs

### Installation
Step-by-step install instructions. Example (Node):
```bash
git clone https://github.com/Bambazee/Gidaa.git
cd Gidaa
npm install
