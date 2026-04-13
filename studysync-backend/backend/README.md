# StudySync — Backend API

Express.js + MongoDB REST API for the StudySync Student Study Group Finder.

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT + bcryptjs
- **Validation:** express-validator

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
```
Edit `.env` and set:
- `MONGO_URI` — your MongoDB connection string (local or MongoDB Atlas)
- `JWT_SECRET` — a long random secret string
- `CLIENT_URL` — your frontend URL (default: http://localhost:5173)

### 3. Run the server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The API runs on **http://localhost:5000**

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login, receive JWT | No |
| GET | /api/auth/me | Get current user | Yes |
| PUT | /api/auth/me | Update profile | Yes |
| PUT | /api/auth/password | Change password | Yes |

### Groups
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/groups | List all groups (search, filter) | Yes |
| POST | /api/groups | Create group | Yes |
| GET | /api/groups/my | My groups | Yes |
| GET | /api/groups/:id | Group detail | Yes |
| PUT | /api/groups/:id | Update group | Leader |
| DELETE | /api/groups/:id | Delete group | Leader/Admin |
| POST | /api/groups/:id/join | Join group | Yes |
| DELETE | /api/groups/:id/leave | Leave group | Yes |
| DELETE | /api/groups/:id/members/:userId | Remove member | Leader |

### Sessions
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/groups/:id/sessions | List sessions | Yes |
| POST | /api/groups/:id/sessions | Create session | Leader |
| DELETE | /api/groups/:id/sessions/:sessionId | Delete session | Leader |
| GET | /api/sessions/my | My upcoming sessions | Yes |

### Posts
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/groups/:id/posts | List posts | Yes |
| POST | /api/groups/:id/posts | Create post | Member |
| DELETE | /api/groups/:id/posts/:postId | Delete post | Owner/Admin |

### Admin
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/admin/stats | Platform statistics | Admin |
| GET | /api/admin/users | All users | Admin |
| DELETE | /api/admin/users/:id | Delete user | Admin |

## Project Structure
```
src/
├── config/
│   └── db.js              # MongoDB connection
├── models/
│   ├── User.js
│   ├── Group.js
│   ├── Session.js
│   └── Post.js
├── middleware/
│   └── auth.js            # JWT protect + adminOnly
├── controllers/
│   ├── authController.js
│   ├── groupController.js
│   ├── sessionController.js
│   ├── postController.js
│   └── adminController.js
├── routes/
│   ├── auth.js
│   ├── groups.js
│   ├── sessions.js
│   └── admin.js
└── server.js
```
