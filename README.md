# Mini CRM Opportunity Tracker - Backend API

This backend API provides secure authentication, backend-enforced ownership authorization, and a clean RESTful API architecture for tracking sales leads, follow-ups, and deal stages.

---

## 🚀 Live Demo & Project Details
- **Live Frontend URL**: https://crm-frontend-sigma-henna.vercel.app/
- **Live Backend URL**: https://crm-backend-jh7e.onrender.com
- **Registered Users on the Platform**:
  - **User 1 (kalyan)**: `svk@gmail.com` / `Password@123`
  - **User 2 (kumar)**: `stk@gmail.com` / `Password@123`

---

## 🎯 Key Features & Implementation Architecture

Here is how the backend implementation is designed and structured:

### 1. Secure Authentication & Password Handling
- **Password Hashing**: Passwords are never stored in plain text. They are hashed using `bcryptjs` (10 salt rounds) during registration inside [authController.js](./src/controllers/authController.js).
- **JWT Generation**: On successful login, a JWT is generated with the user's ID as the payload and signed using a secure secret key (`JWT_SECRET`).
- **Route Protection**: The `protect` middleware inside [authenticate.js](./src/middleware/authenticate.js) validates the `Authorization: Bearer <token>` header, extracts the user ID, and injects the user context (`req.user`) into protected routes.

### 2. Strict Ownership-Based Authorization (Backend Enforced)
- **Automatic Owner Assignment**: When creating an opportunity, the owner is set dynamically on the backend from the validated JWT payload (`req.user.id`). The API **does not accept** `user_id` or `owner` in the request body to prevent manipulation.
- **Backend Ownership Validation**: Before any update (`PUT`) or delete (`DELETE`) operation, the backend queries the database and verifies that `opportunity.owner.toString() === req.user.id`.
  - If a user attempts to edit or delete an opportunity owned by someone else, the API immediately rejects the request with a **`403 Forbidden`** HTTP status code.

### 3. Request Validation & Error Handling
- **Request Validation**: Incoming payloads for registration, login, creation, and modification are validated using dedicated middlewares:
  - [authMiddleware.js](./src/middleware/authMiddleware.js) (validates emails, password lengths, etc.)
  - [opportunityMiddleware.js](./src/middleware/opportunityMiddleware.js) (validates customer name, estimated values, stages, priorities, etc.)
- **Centralized Error Handling**: Express middleware inside [errorMiddleware.js](./src/middleware/errorMiddleware.js) intercepts syntax errors, invalid ObjectIds, database validation errors, and `404 Not Found` routes to return consistent JSON error objects.

---

## 🛠️ Tech Stack & Dependencies

- **Runtime**: Node.js (ES Modules, `"type": "module"`)
- **Framework**: Express.js
- **Database ORM**: Mongoose (connecting to MongoDB Atlas)
- **Dependencies**: `bcryptjs`, `cors`, `dotenv`, `jsonwebtoken`, `mongoose`
- **Dev Dependencies**: `nodemon` (hot reloading)

---

## 🔑 Environment Variables
Create a `.env` file in the `crmBackend/` directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/crm
JWT_SECRET=your_secure_jwt_secret_key
```

---

## 🚀 Local Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Configure Environment**:
   Create a `.env` file and configure `MONGO_URI` and `JWT_SECRET`.
3. **Run in Development Mode**:
   ```bash
   npm run dev
   ```
4. **Run in Production Mode**:
   ```bash
   npm start
   ```

---

## 🔌 API Documentation

### 🔐 Authentication Endpoints

#### `POST /api/auth/register`
- **Description**: Registers a new user.
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123"
  }
  ```
- **Responses**:
  - `201 Created` with JWT `token` and `user` profile data.
  - `400 Bad Request` if email is invalid/taken or validation fails.

#### `POST /api/auth/login`
- **Description**: Authenticates a user and returns a token.
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "password123"
  }
  ```
- **Responses**:
  - `200 OK` with JWT `token` and `user` profile data.
  - `401 Unauthorized` for invalid email/password.

#### `GET /api/auth/me` (Protected)
- **Description**: Returns the authenticated user's profile.
- **Headers**: `Authorization: Bearer <JWT_Token>`
- **Response**: `200 OK` with user details.

---

### 💼 Opportunity Endpoints (All Protected)
All of the following endpoints require the header: `Authorization: Bearer <JWT_Token>`

#### `GET /api/opportunities`
- **Description**: View the shared sales pipeline containing all opportunities in the organization.
- **Access Rule**: Open to all logged-in users.

#### `GET /api/opportunities/:id`
- **Description**: Retrieve details of a specific opportunity.
- **Access Rule**: Open to all logged-in users.

#### `POST /api/opportunities`
- **Description**: Create a new sales opportunity.
- **Access Rule**: Open to all logged-in users.
- **Note**: The owner is automatically set to the active user's ID via the JWT token.
- **Request Body**:
  ```json
  {
    "customerName": "Acme Corp",
    "contactName": "John Smith",
    "contactEmail": "john@acme.com",
    "contactPhone": "+123456789",
    "requirement": "Upgrade to Enterprise Tier",
    "estimatedValue": 12000,
    "stage": "New", // Enum: New, Contacted, Qualified, Proposal Sent, Won, Lost
    "priority": "Medium", // Enum: Low, Medium, High
    "nextFollowUpDate": "2026-07-01",
    "notes": "Discussing contract terms."
  }
  ```

#### `PUT /api/opportunities/:id`
- **Description**: Edit an opportunity.
- **Access Rule**: **Only the creator/owner** of this opportunity.
- **Note**: Backend returns `403 Forbidden` if another user attempts to update this deal.

#### `DELETE /api/opportunities/:id`
- **Description**: Remove an opportunity.
- **Access Rule**: **Only the creator/owner** of this opportunity.
- **Note**: Backend returns `403 Forbidden` if another user attempts to delete this deal.

---

## ☁️ Deployment Details
- **Deployment Platform**: Render (Web Service)
- **Root Directory**: `crmBackend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
