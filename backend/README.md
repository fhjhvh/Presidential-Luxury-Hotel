# Hotel Management System - Backend

Complete REST API backend built with Node.js, Express, PostgreSQL, and Prisma.

## Features

- ✅ JWT Authentication & Authorization
- ✅ Role-Based Access Control (RBAC)
- ✅ Guest Discount System (20% first visit, 10% returning)
- ✅ Room Management & Filtering
- ✅ Booking System with Automatic Discounts
- ✅ Real-time Chat System (Ready for AI integration)
- ✅ Reception Dashboard Support
- ✅ Staff Management (Reception, Nursing, Maintenance, Accounting)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Create `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/hotel_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
```

### 3. Setup Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Create database schema
npm run prisma:push

# Seed initial data
node prisma/seed.js
```

### 4. Start Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user (authenticated)
- `GET /api/auth/profile` - Get user profile (authenticated)

### Rooms
- `GET /api/rooms` - Get all rooms (with filters)
- `GET /api/rooms/:id` - Get room by ID
- `POST /api/rooms/filter` - Filter rooms by preferences
- `POST /api/rooms` - Create room (Admin/Reception)
- `PUT /api/rooms/:id` - Update room (Admin/Reception/Maintenance)
- `DELETE /api/rooms/:id` - Delete room (Admin only)

### Bookings
- `POST /api/bookings` - Create booking (authenticated)
- `GET /api/bookings/my-bookings` - Get user bookings (authenticated)
- `GET /api/bookings/:id` - Get booking by ID (authenticated)
- `GET /api/bookings` - Get all bookings (Staff/Admin)
- `PATCH /api/bookings/:id/status` - Update booking status (Reception/Admin)

### Chat
- `POST /api/chat` - Create chat session (authenticated)
- `GET /api/chat/my-sessions` - Get user chat sessions (authenticated)
- `GET /api/chat/:id` - Get chat session with messages (authenticated)
- `POST /api/chat/:sessionId/messages` - Add message to chat (authenticated)
- `PATCH /api/chat/:id/data` - Update session guest data (authenticated)
- `PATCH /api/chat/:id/close` - Close chat session (authenticated)
- `GET /api/chat/active/all` - Get all active sessions (Reception/Admin)
- `PATCH /api/chat/:id/assign` - Assign staff to session (Reception/Admin)

## User Roles

### Guests
- **GUEST_NEW**: First-time guest (20% discount)
- **GUEST_RETURNING**: Returning guest (10% discount)

### Staff
- **STAFF_RECEPTION**: Reception desk operations
- **STAFF_NURSING**: Medical/nursing services
- **STAFF_MAINTENANCE**: Room maintenance
- **STAFF_ACCOUNTING**: Financial operations

### Admin
- **ADMIN**: Full system access

## Test Credentials

After seeding:

- Admin: `admin@hotel.com` / `password123`
- Reception: `reception@hotel.com` / `password123`
- Guest: `guest@example.com` / `password123`

## Database Schema

### Main Tables
- **User**: User accounts with roles
- **GuestProfile**: Guest-specific data (discounts, preferences)
- **StaffProfile**: Staff-specific data (department, salary)
- **Room**: Hotel rooms with features and pricing
- **Booking**: Reservations with automatic discount application
- **ChatSession**: Chat conversations between guests and staff
- **ChatMessage**: Individual messages in chat sessions

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.js              # Seed data
├── src/
│   ├── config/
│   │   └── database.js      # Prisma client
│   ├── controllers/         # Request handlers
│   ├── middlewares/         # Auth & error handling
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── utils/               # Helper functions
│   └── server.js            # Entry point
├── .env.example
├── package.json
└── README.md
```

## Key Features Explained

### Discount System
- Automatically applies 20% discount for first-time guests
- Automatically applies 10% discount for returning guests
- Updates guest status after first booking
- Tracks total stays and spending

### Chat System
- Stores all conversations in database
- Links guests with reception staff
- Ready for AI integration
- Tracks guest preferences from conversations

### Room Filtering
- Smart filtering based on guest preferences
- Scoring algorithm for best matches
- Supports multiple criteria (budget, type, features)
- Floor and section filtering

### Role-Based Access
- Middleware-based authorization
- Fine-grained permissions per endpoint
- Separate staff roles with specific access levels
