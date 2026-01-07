# Property Listing Portal

This project consists of a Python FastAPI backend and a React (Vite) frontend.

## Prerequisites

-   Python 3.12+
-   Node.js & npm
-   PostgreSQL (running locally on port 5432)

## Cloning the Repository

To clone the `dev` branch of the repository:

```bash
git clone -b dev https://github.com/arunkanchole5500-beep/property-listing-portal.git
cd property-listing-portal
```

## Getting Started

### 1. Database Setup

Ensure your PostgreSQL database is running. The default configuration expects a database named `property_portal` and user `postgres`.

```bash
psql -h localhost -U postgres -c "CREATE DATABASE property_portal;"
```

### 2. Backend Setup

Navigate to the backend directory and set up the Python environment.

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations (ensure PGPASSWORD is set if needed)
export PGPASSWORD=postgres
alembic upgrade head

# Start the server
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

The backend API will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

### 3. Frontend Setup

Navigate to the frontend directory and start the development server.

```bash
cd frontend

# Install dependencies (use --legacy-peer-deps to resolve conflicts)
npm install --legacy-peer-deps

# Start the development server
npm run dev
```

The frontend application will be available at [http://localhost:5173](http://localhost:5173).
