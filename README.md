# Testly

Testly is a full-stack test tracking application that allows users to create, update, archive, and review academic tests.

This project was developed as part of CTD and is currently a work in progress. Features and improvements are still being actively added.

---

## Overview

Testly provides a simple dashboard for managing tests with:

- Secure authentication (JWT-based)
- Full CRUD functionality
- Archive support
- Backend validation and rule enforcement
- Toast notifications and confirmation modals
- Responsive UI with modern component styling

---

## Tech Stack

### Frontend

- React (Vite)
- React Router
- Tailwind CSS
- shadcn/ui
- react-toastify

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication
- express-validator

---

## Running Locally

### 1. Install Dependencies

Backend:

```
cd server
npm install
```

Frontend:

```
cd client
npm install
```

---

### 2. Configure Environment Variables

Create a `.env` file in the `root` directory:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
JWT_LIFETIME=your_value
PORT=your_port
VITE_API_URL=your_url
```

---

### 3. Start Development Servers

Start the backend (from the `server` directory):

```
npm run dev
```

Start the frontend (from the `client` directory):

```
npm run dev
```
