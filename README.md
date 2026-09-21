# Workout Tracker

A RESTful API for tracking workouts, built with Node.js, Express, and MongoDB. Users can register, create workout plans made up of exercises, track progress over time, and generate reports on completed workouts.

This project is a solution to the [roadmap.sh Fitness Workout Tracker](https://roadmap.sh/projects/fitness-workout-tracker) backend project.

> **Note:** the roadmap.sh brief suggests a relational database. This implementation uses **MongoDB** (via Mongoose) instead.

## Features

- User registration and login with hashed passwords (bcrypt)
- JWT authentication (short-lived access token + refresh token flow)
- Create, read, update, and delete workout plans
- Each plan holds a list of exercises with sets, reps, and weight
- Schedule workouts to a specific date/time
- Track plan status (`pending`, `active`, `completed`)
- Add and delete comments on a plan
- Filter and sort workout plans by status and schedule date
- Seed the database with a starter set of exercises
- Generate aggregate reports (total workouts, total volume, breakdown by exercise and category)
- Users can only ever read or modify their own data
- Input validation on all write endpoints (`express-validator`)
- Integration tests with Vitest + Supertest + an in-memory MongoDB instance

## Tech stack

- **Runtime:** Node.js (ESM)
- **Framework:** Express 5
- **Database:** MongoDB + Mongoose
- **Auth:** JSON Web Tokens (`jsonwebtoken`), `bcrypt` for password hashing, HTTP-only cookies for the refresh token
- **Validation:** express-validator
- **Testing:** Vitest, Supertest, mongodb-memory-server

## Getting started

### Prerequisites

- Node.js (v18+ recommended)
- A MongoDB connection (this project is set up for a MongoDB Atlas cluster, but any MongoDB URI will work with a small change to `lib/connectDB.js`)

### Installation

```bash
git clone https://github.com/Hicham-Hal/Workout-Tracker.git
cd Workout-Tracker
npm install
```

### Environment variables

Create a `.env` file in the project root:

```env
PORT=3000
DB_USERNAME=your_mongodb_username
DB_PASSWORD=your_mongodb_password
ACCESS_TOKEN_SECRET=some_long_random_secret
REFRESH_TOKEN_SECRET=another_long_random_secret
```

| Variable | Description |
|---|---|
| `PORT` | Port the server listens on. Defaults to `3000` if omitted. |
| `DB_USERNAME` | MongoDB Atlas username, used to build the connection URI. |
| `DB_PASSWORD` | MongoDB Atlas password, used to build the connection URI. |
| `ACCESS_TOKEN_SECRET` | Secret used to sign/verify short-lived access tokens (30 min expiry). |
| `REFRESH_TOKEN_SECRET` | Secret used to sign/verify long-lived refresh tokens (15 day expiry), issued as an HTTP-only cookie. |

### Seed the database

Populates the `exercises` collection with a starter list of exercises (used when building a plan):

```bash
npm run seed
```

### Run the server

```bash
npm start
```

The server starts on `http://localhost:3000` (or your configured `PORT`).

### Run tests

```bash
npm test          # run once
npm run test:watch  # watch mode
```

Tests spin up an in-memory MongoDB instance, so no real database connection is required to run them.

## Authentication

Most endpoints require a valid access token. After logging in or registering, send the returned `accessToken` on subsequent requests:

```
Authorization: Bearer <accessToken>
```

Access tokens expire after 30 minutes. When one expires, call `POST /refresh-token` (the refresh token is sent automatically as an HTTP-only cookie set during login/register) to obtain a new access token, no need to log in again.

## API Reference

Base URL: `http://localhost:3000`

### Auth — `/`

| Method | Endpoint | Auth required | Description |
|---|---|---|---|
| POST | `/register` | No | Create a new account. |
| POST | `/login` | No | Log in and receive an access token; sets a refresh-token cookie. |
| POST | `/logout` | No | Clears the refresh-token cookie. |
| POST | `/refresh-token` | Refresh cookie | Exchange a valid refresh token for a new access token. |

**POST `/register`**

```json
{
  "username": "user123",
  "email": "user@example.com",
  "password": "SecurePass1"
}
```
- `username`: 3–50 characters
- `email`: must be a valid email
- `password`: minimum 8 characters, must contain at least one number

Response `201`:
```json
{ "message": "Account for user123 and with user@example.com was created successfully", "accessToken": "..." }
```

**POST `/login`**

```json
{ "email": "user@example.com", "password": "SecurePass1" }
```

Response `200`:
```json
{ "message": "welcome user123", "accessToken": "..." }
```

**POST `/logout`** — no body required. Response `200`.

**POST `/refresh-token`** — no body required (reads the `refreshToken` cookie). Response `200`:
```json
{ "accessToken": "..." }
```

### Workout Plans — `/plan`

All endpoints below require `Authorization: Bearer <accessToken>`.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/plan/add` | Create a new workout plan. |
| GET | `/plan` | List the current user's plans. Supports `?state=` filter. |
| GET | `/plan/:id` | Get a single plan by id. |
| PUT | `/plan/update/:id` | Update a plan's title, schedule, or exercises. |
| DELETE | `/plan/delete` | Delete a plan (id passed in the request body). |
| PUT | `/plan/:id/status` | Update a plan's status. |
| POST | `/plan/:id` | Add a comment to a plan. |
| DELETE | `/plan/:planId` | Delete a comment from a plan (comment id passed in the request body). |
| GET | `/plan/report` | Get an aggregate report of completed workouts in a date range. |

**POST `/plan/add`**

```json
{
  "title": "Push Day",
  "time": "2026-04-01T09:00:00.000Z",
  "exercises": [
    { "exercise": "<exerciseId>", "sets": 4, "reps": 10, "weight": 60 }
  ]
}
```

**GET `/plan`**

Optional query param:
- `state` — one of `pending`, `active`, `completed`. Omit to return all of the user's plans.

Results are sorted by `scheduledAt` (most recent first).

**GET `/plan/:id`**

Returns a single plan owned by the requesting user, or `404` if it doesn't exist / isn't theirs.

**PUT `/plan/update/:id`**

```json
{
  "title": "Push Day (updated)",
  "time": "2026-04-02T09:00:00.000Z",
  "exercises": [ { "exercise": "<exerciseId>", "sets": 5, "reps": 8, "weight": 65 } ]
}
```

All fields optional; only provided fields are updated.

**DELETE `/plan/delete`**

```json
{ "id": "<planId>" }
```

**PUT `/plan/:id/status`**

```json
{ "status": "completed" }
```

`status` must be one of `pending`, `active`, `completed`.

**POST `/plan/:id`** (add comment)

```json
{ "commentObj": { "comment": "Felt strong today, added 5kg to bench." } }
```

**DELETE `/plan/:planId`** (delete comment)

```json
{ "id": "<commentId>" }
```

**GET `/plan/report`**

Query params:
- `from` — ISO date string, start of range
- `to` — ISO date string, end of range

Example:
```
GET /plan/report?from=2026-01-01&to=2026-03-01
```

Response `200`:
```json
{
  "totalWorkoutsCompleted": 24,
  "totalVolume": 48200,
  "byExercise": [
    { "exercise": "Bench Press", "sessions": 8, "maxWeight": 75, "totalVolume": 12000 },
    { "exercise": "Squat", "sessions": 6, "maxWeight": 100, "totalVolume": 15000 }
  ],
  "byCategory": {
    "strength": 18,
    "cardio": 6
  }
}
```

Only plans with `status: "completed"` and a `scheduledAt` within the given range are included. `totalVolume` is the sum of `sets × reps × weight` across all matched plans.

## Project structure

```
├── app.js                  # Express app setup
├── index.js                # Entry point, connects to DB and starts the server
├── controllers/            # Route handler logic
├── routes/                 # Route definitions
├── models/                 # Mongoose schemas (User, Plan, Exercise)
├── middlewares/            # Auth middleware (JWT verification)
├── validators/             # express-validator rule sets
├── lib/                    # Shared utilities (DB connection)
├── seed/                   # Exercise seed data + seeding script
└── test/                   # Integration tests
```

## License

ISC