# Jamoveo Server

This is the backend for **Jamoveo**, a real-time collaborative music rehearsal app developed as part of a coding assignment for Moveo. It manages user authentication, session coordination, and real-time socket communication between players and the admin.

Link to Render - https://server-gsv6.onrender.com

## Features

- Express.js server with RESTful API
- User registration and login (JWT-based authentication)
- Admin session creation and management
- Real-time synchronization using Socket.IO
- Song data retrieval from local JSON or external (scraped) sources
- MongoDB-based persistence (if used)

## Endpoints

- `POST /auth/signup` – Create a new user (instrument specified)
- `POST /auth/login` – Authenticate and return token
- `POST /admin/signup` – Register a new admin
- `GET /songs` – Fetch songs (supports optional search query)
- `GET /songs/:id` – Fetch full song data (lyrics & chords)

## Socket Events

- `join-session` – Connect a player to a session
- `start-song` – Broadcast selected song to all users
- `quit-session` – Ends the current session

## Setup

```bash
npm install
npm run dev

## Deployment
Deployed on Render.
