# LuxeHaven - MERN E-Commerce Platform

LuxeHaven is an intermediate-level full-stack e-commerce project built with React, Redux Toolkit, RTK Query, Node.js, Express, MongoDB, JWT authentication, PayPal checkout, Multer uploads, and TailwindCSS.

## Features

- User registration, login, logout, and JWT-secured profile sessions.
- Dynamic product catalogue with search, category filtering, price filtering, rating filtering, and sorting.
- Shopping cart with add, remove, and quantity update support.
- PayPal checkout flow with order creation and paid-order updates.
- Role-based admin dashboard for revenue, sales, order, product, and customer management.
- ApexCharts analytics for monthly revenue trends.
- Product, category, order, and customer CRUD-ready API structure.
- Multer image upload route for admin product assets.
- Mongoose schemas for users, categories, products, reviews, and orders.

## Tech Stack

- Frontend: React, Redux Toolkit, RTK Query, React Router, TailwindCSS, ApexCharts, PayPal React SDK.
- Backend: Node.js, Express.js, MongoDB, Mongoose, JWT, Cookie Parser, CORS, Multer.
- Tooling: Vite, Nodemon, Concurrently.

## Project Structure

```text
client/       React storefront and admin UI
server/       Express API, routes, controllers, models, seed script
uploads/      Uploaded product images
```

## Getting Started

Install all dependencies:

```bash
npm run install:all
```

Create the backend environment file:

```bash
cp server/.env.example server/.env
```

Update `server/.env` with your MongoDB URI, JWT secret, and PayPal client ID.

Seed demo data:

```bash
npm run seed
```

Run the full app:

```bash
npm run dev
```

The frontend runs on `http://localhost:5173` and the API runs on `http://localhost:5000`.

## Demo Accounts

```text
Admin:    Configure ADMIN_EMAIL and ADMIN_PASSWORD in server/.env
Customer: customer@luxehaven.dev / password123
```

## API Overview

- `POST /api/auth/register` - create account.
- `POST /api/auth/login` - login and set JWT cookie.
- `GET /api/products` - catalogue with filters and sorting.
- `POST /api/orders` - create an authenticated customer order.
- `PUT /api/orders/:id/pay` - mark order paid from PayPal capture details.
- `GET /api/admin/stats` - admin revenue and sales analytics.
- `POST /api/upload` - admin image upload.

## Useful Scripts

```bash
npm run dev          # run client and server together
npm run build        # build React app
npm run seed         # reset and seed MongoDB data
npm start            # start Express server
```
