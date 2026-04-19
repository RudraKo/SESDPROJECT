# SESDPROJECT

Social media content sharing platform based on the provided diagrams. This repo now includes a TypeScript OOP backend and a bold Tailwind-powered frontend.

## Stack

- Backend: Node.js, Express, TypeScript, Prisma, SQLite, JWT, Zod
- Frontend: Vite, HTML, Tailwind CSS, Vanilla JS

## Features

- Register, login, JWT auth
- Create posts with image URL and caption
- Follow and unfollow users
- Personalized feed from followed users
- Like/unlike posts
- Comment on posts

## Project Structure

- Client app: [client/](client/)
- Server app: [server/](server/)
- Diagrams: [assets/](assets/)

## Backend Setup (TypeScript)

1. Install dependencies
   - `cd server`
   - `npm install`
2. Configure environment
   - Copy `.env.example` to `.env` and update values if needed
3. Initialize database
   - `npx prisma migrate dev --name init`
   - `npx prisma generate`
4. Run the server
   - `npm run dev`
   - Server runs on `http://localhost:4000`

## Frontend Setup (HTML + Tailwind + JS)

1. Install dependencies
   - `cd client`
   - `npm install`
2. Run the client
   - `npm run dev`
   - App runs on `http://localhost:5173`

## API Highlights

- `POST /auth/register`
- `POST /auth/login`
- `GET /feed`
- `POST /posts`
- `POST /posts/:id/like`
- `DELETE /posts/:id/like`
- `POST /posts/:id/comments`
- `GET /posts/:id/comments`
- `POST /users/:id/follow`
- `DELETE /users/:id/follow`
- `GET /users/:id`

## Notes

- The backend follows a layered architecture (Controller-Service-Repository) and OOP principles.
- The frontend is intentionally bold and experimental to stand apart from boilerplate UI.
