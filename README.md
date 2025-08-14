# Fixora

Device repair platform for Kolkata with pickup and return.

## Tech Stack
- Next.js (App Router) + TailwindCSS
- Firebase (Auth, Firestore, Storage)
- Google Maps JavaScript API
- Vercel + Firebase Hosting/Functions

## Getting Started
1. Copy `.env.local.example` to `.env.local` and fill in your Firebase and Google Maps keys.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```

## Project Structure
- `app/` — App Router routes and layouts
- `components/` — UI components
- `lib/firebase.ts` — Firebase initialization
- `types/` — Shared TypeScript types

## Scripts
- `dev` — Start dev server
- `build` — Build production bundle
- `start` — Start production server
- `lint` — Lint source files
