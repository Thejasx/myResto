# My Resto - Restaurant Discovery & Table Booking Platform

My Resto is a premium, full-stack MERN application inspired by Agoda's travel-booking experience. It allows users to discover restaurants across India, check real-time availability, and book tables instantly.

## 🚀 Features

- **Agoda-inspired UI**: Polished glassmorphism design with a booking-first interaction flow.
- **Smart Search**: Find restaurants by city, date, time, and guest count.
- **Dynamic Filtering**: Filter results by cuisine, price range, rating, and availability.
- **Real-time Booking**: Automated capacity check to prevent overbooking for any time slot.
- **Role-Based Access**: Dedicated dashboards for Customers, Restaurant Owners, and Admins.
- **Admin Control**: Comprehensive panel for approving restaurants and managing platform data.
- **Owner Dashboard**: Full CRUD for restaurant details and menu management.
- **Responsive Design**: Optimized for mobile, tablet, and desktop.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, React Router, Axios, CSS3 (Vanilla).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB with Mongoose.
- **Auth**: JWT-based authentication with role-based middleware.
- **Deployment**: Configured for Vercel (Frontend & Backend).

## 📦 Project Structure

```text
my-resto/
├── client/          # Frontend React (Vite)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page views
│   │   ├── context/     # Auth state management
│   │   ├── services/    # API calls
│   │   └── router/      # Route guards
├── server/          # Backend Node.js
│   ├── models/      # Mongoose schemas
│   ├── controllers/ # Business logic
│   ├── routes/      # API endpoints
│   ├── middleware/  # Auth & Error handlers
│   └── seed/        # Dummy data script
```

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js installed
- MongoDB (Local or Atlas)

### 2. Backend Setup
```bash
cd server
npm install
# Create .env and update MONGO_URI
npm run seed     # Populate database with 12 restaurants & demo users
npm run dev      # Start server on port 5000
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev      # Start frontend on port 5173
```

## 🔑 Demo Credentials

- **Admin**: `admin@gmail.com` / `adminpassword`
- **Customer**: `customer@demo.com` / `password123`
- **Owner**: `owner1@myrestodemo.com` / `password123` (up to owner12)

## 🌐 Deployment
The project includes `vercel.json` configurations for both frontend and backend. Ensure to update `CLIENT_URL` in backend `.env` and `VITE_API_BASE_URL` in frontend `.env` when deploying.
