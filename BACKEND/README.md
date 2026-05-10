# TravelLoop Backend

Production-ready REST API built with **Node.js**, **Express**, **MongoDB**, and **JWT** authentication.

## Tech Stack

| Technology | Purpose |
|---|---|
| Express.js | Web framework |
| MongoDB + Mongoose | Database + ODM |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| Helmet | Security headers |
| CORS | Cross-origin requests |
| Morgan | HTTP request logging |

## Project Structure

```
BACKEND/
├── src/
│   ├── config/          # Database, JWT, environment configuration
│   ├── controllers/     # Request handlers (auth, user)
│   ├── middleware/       # Auth, error handling, validation, rate limiting
│   ├── models/          # Mongoose schemas (User, Post)
│   ├── routes/          # Express route definitions
│   ├── services/        # Business logic (email, etc.)
│   ├── utils/           # AppError, catchAsync, helpers
│   ├── validators/      # Input validation functions
│   └── app.js           # Express app setup
├── server.js            # Entry point
├── .env                 # Environment variables (not committed)
├── .env.example         # Example env template
└── package.json
```

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Copy and configure environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# 3. Start development server
npm run dev

# 4. Start production server
npm start
```

## API Endpoints

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new account |
| POST | `/api/auth/login` | ❌ | Login |
| POST | `/api/auth/logout` | ✅ | Logout (clears cookie) |
| PATCH | `/api/auth/update-password` | ✅ | Change password |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users/me` | ✅ | Get my profile |
| PATCH | `/api/users/me` | ✅ | Update my profile |
| DELETE | `/api/users/me` | ✅ | Deactivate my account |
| GET | `/api/users` | 🔑 Admin | List all users (paginated) |
| GET | `/api/users/:id` | 🔑 Admin | Get user by ID |
| PATCH | `/api/users/:id` | 🔑 Admin | Update user by ID |
| DELETE | `/api/users/:id` | 🔑 Admin | Delete user by ID |

## Authentication

The API uses **JWT Bearer tokens**. Include the token in requests:

```
Authorization: Bearer <your_token>
```

Tokens are also set as **httpOnly cookies** automatically on login/register.

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/mydatabase` |
| `JWT_SECRET` | JWT signing secret | *(required)* |
| `JWT_EXPIRES_IN` | Token expiry duration | `7d` |
| `JWT_COOKIE_EXPIRES_IN` | Cookie expiry in days | `7` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:5173` |

## Security Features

- 🔒 Helmet security headers
- 🚦 Rate limiting (global + auth-specific)
- 🔐 bcrypt password hashing (12 salt rounds)
- 🍪 HttpOnly secure cookies
- 🛡️ Input validation & sanitization
- 🚫 Password field excluded from queries by default
- ✅ Role-based access control (RBAC)
