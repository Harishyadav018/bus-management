# College Bus Backend

This backend is built with Node.js, Express, and MySQL.

## Setup

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Copy `.env.example` to `.env` and update database settings:
   ```bash
   copy .env.example .env
   ```

3. Make sure MySQL is running, then start the backend:
   ```bash
   npm start
   ```

4. The backend will run on `http://localhost:3000` by default.

## Database

The server automatically creates the database and tables if they do not exist.

## Default admin user

The default admin is created from the `.env` settings:
- `ADMIN_EMAIL=harishmuthyala11@gmail.com`
- `ADMIN_PASSWORD=admin11`
