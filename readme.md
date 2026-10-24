# COYM API

The REST API for **COYM (Comment on Your Major)**, a platform for students to explore university majors and share comments about them. This service provides account and profile operations, major data, comments, replies, likes, and user-submitted requests.

## Features

- Browse the major catalogue and view popular majors.
- Create accounts, sign in, validate sessions, and manage profile details.
- Create, edit, delete, and browse comments and replies.
- Like and unlike comments, and retrieve like and activity counts.
- Submit feedback and other requests.
- Persist application data in MySQL with relational tables and foreign keys.

## Technology

- Node.js and TypeScript
- Express
- MySQL with `mysql2`
- `ts-node-dev` for local development

## Getting started

### Requirements

- Node.js (18 or later recommended)
- npm
- A MySQL database

### Install dependencies

```bash
npm install
```

### Configure the database

Create a MySQL database, then provide its connection details through environment variables. For local development, create a `.env` file in the repository root:

```dotenv
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database
```

The same variable names must be configured in your hosting provider's environment settings. Do not commit `.env` or put real credentials in source control.

The SQL files in [`configs/sql/`](configs/sql/) create the available tables. Run the scripts in this order so referenced tables exist before foreign keys are added:

1. `accounts.sql`
2. `majors.sql` (creates and seeds the major catalogue)
3. `commet.sql` (creates `comments`; the filename is retained as it exists in the repository)
4. `like.sql` and `reply.sql`
5. `request.sql`

The account profile routes also read and update `url` and `sns` fields. Add these columns to `accounts` if they are not included in your database:

```sql
ALTER TABLE accounts
  ADD COLUMN url VARCHAR(255),
  ADD COLUMN sns VARCHAR(255);
```

The module activity route refers to `modules` and `moduleComments`, but their table definitions are not included in this repository.

### Run locally

Start the development server with automatic TypeScript reloads:

```bash
npm run dev
```

Compile TypeScript and start the compiled server:

```bash
npm run build
npm run start
```

The server listens on `PORT` when provided by the environment, or port `10000` by default.

## Deployment

The API can be deployed as a Node.js web service. For a Render web service using this repository:

| Setting | Value |
| --- | --- |
| Build command | `npm install && npm run build` |
| Start command | `npm run start` |

Set `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` in the service's environment settings. Configure database TLS as required by your MySQL provider.

## API reference

All routes are registered at the server root; there is no homepage route at `/`. Replace `:id` with the relevant record ID. The route handlers use JSON request bodies for POST operations unless noted otherwise.

### Accounts

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/signUp` | Create an account |
| `GET` | `/signIn` | Sign in |
| `GET` | `/cookieValidation` | Validate the session cookie |
| `GET` | `/getUserDetails` | Get the signed-in user's profile |
| `POST` | `/updateUserDetails` | Update profile details |
| `GET` | `/getAllUsers` | List users |
| `GET` | `/getUserDetailsByID/:id` | Get a user by ID |
| `GET` | `/getUserID` | Get the signed-in user's ID |
| `GET` | `/getUserCommentDetails/:id` | Get a user's comment activity by major |
| `GET` | `/getUserModuleCommentDetails/:id` | Get a user's module-comment activity; requires module tables |
| `GET` | `/getTotalAccountCount` | Get the account count |

### Majors and comments

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/getMajorList` | List majors |
| `GET` | `/getMajorName/:id` | Get a major name by ID |
| `GET` | `/getPopularMajors` | List popular majors based on comments |
| `GET` | `/getRecentComments` | List recent comments |
| `GET` | `/getComment/:id` | Get comments for a major |
| `POST` | `/postComment/:id` | Add a comment for a major |
| `GET` | `/getCommentCount` | Get comment count information |
| `GET` | `/getTotalCommentCount` | Get the total comment count |
| `POST` | `/editComment/:id` | Edit a comment |
| `POST` | `/deleteComment/:id` | Delete a comment |

### Replies, likes, and requests

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/getReply/:id` | Get replies for a comment |
| `POST` | `/postReply/:id` | Add a reply |
| `POST` | `/editReply/:id` | Edit a reply |
| `POST` | `/deleteReply/:id` | Delete a reply |
| `GET` | `/getTotalReplyCount` | Get the total reply count |
| `GET` | `/getLike/:id` | Get likes for a comment |
| `POST` | `/postLike/:id` | Like or unlike a comment |
| `GET` | `/getTotalLikeCount` | Get the total like count |
| `POST` | `/postRequest` | Submit a request or feedback |
| `GET` | `/getTest` | Simple test endpoint |

### Example

```bash
curl https://coym-backend.onrender.com/getMajorList
```

Successful responses use a JSON envelope similar to:

```json
{
  "status": true,
  "message": []
}
```

## Project structure

```text
configs/       Database connection, CORS options, and SQL setup files
models/        Database queries and application operations
routes/        Express route definitions
utils/         Shared utilities
server.ts      Express application entry point
```

## Notes

- The API expects its database tables to be initialized before database-backed routes are used.
- `npm test` is currently a placeholder and does not run a test suite.
- The repository does not currently include schema definitions for module comments.
