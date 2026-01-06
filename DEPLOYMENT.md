# Fly.io Deployment Guide

This guide will help you deploy both the backend (FastAPI) and frontend (React) applications to Fly.io.

## Quick Start (Automated)

For automated deployment, use the provided script:

```bash
./deploy.sh
```

This script will guide you through the entire deployment process.

## Manual Deployment

Follow the steps below for manual deployment.

## Prerequisites

1. Install [Fly CLI](https://fly.io/docs/getting-started/installing-flyctl/)
2. Sign up for a [Fly.io account](https://fly.io/app/sign-up)
3. Login: `fly auth login`

## Step 1: Deploy PostgreSQL Database

First, create a PostgreSQL database on Fly.io:

```bash
fly postgres create --name property-portal-db --region iad --vm-size shared-cpu-1x --volume-size 3
```

Note the connection details (you'll need them for the backend).

## Step 2: Deploy Backend

### 2.1 Navigate to backend directory

```bash
cd backend
```

### 2.2 Initialize Fly.io app (if not already done)

```bash
fly launch --no-deploy
```

When prompted:
- Use existing app name: `property-portal-backend` (or choose your own)
- Select region: `iad` (or your preferred region)
- Don't deploy yet

### 2.3 Attach PostgreSQL database

```bash
fly postgres attach --app property-portal-backend property-portal-db
```

This will automatically set the `DATABASE_URL` environment variable.

### 2.4 Set environment variables

```bash
# Generate a secure secret key
SECRET_KEY=$(openssl rand -hex 32)

# Set environment variables
fly secrets set \
  SECRET_KEY="$SECRET_KEY" \
  FRONTEND_URL="https://property-portal-frontend.fly.dev" \
  --app property-portal-backend
```

**Important:** Replace `property-portal-frontend.fly.dev` with your actual frontend URL after deploying it.

### 2.5 Deploy backend

```bash
fly deploy --app property-portal-backend
```

### 2.6 Verify backend deployment

```bash
fly status --app property-portal-backend
fly logs --app property-portal-backend
```

Your backend should be available at: `https://property-portal-backend.fly.dev`

## Step 3: Deploy Frontend

### 3.1 Navigate to frontend directory

```bash
cd ../frontend
```

### 3.2 Create environment file

Create a `.env.production` file:

```bash
VITE_API_BASE_URL=https://property-portal-backend.fly.dev/api/v1
```

**Important:** Replace `property-portal-backend.fly.dev` with your actual backend URL.

### 3.3 Update vite.config.js for production

The vite.config.js should handle environment variables automatically. Make sure your build uses the production env file.

### 3.4 Initialize Fly.io app

```bash
fly launch --no-deploy
```

When prompted:
- Use existing app name: `property-portal-frontend` (or choose your own)
- Select region: `iad` (or your preferred region)
- Don't deploy yet

### 3.5 Set environment variable for build

```bash
fly secrets set VITE_API_BASE_URL="https://property-portal-backend.fly.dev/api/v1" --app property-portal-frontend
```

### 3.6 Deploy frontend

```bash
fly deploy --app property-portal-frontend
```

### 3.7 Verify frontend deployment

```bash
fly status --app property-portal-frontend
fly logs --app property-portal-frontend
```

Your frontend should be available at: `https://property-portal-frontend.fly.dev`

## Step 4: Update CORS in Backend

After deploying the frontend, update the backend CORS to allow your frontend URL:

```bash
fly secrets set FRONTEND_URL="https://property-portal-frontend.fly.dev" --app property-portal-backend
```

Then redeploy the backend:

```bash
fly deploy --app property-portal-backend
```

## Step 5: Run Database Migrations

After the backend is deployed, run migrations:

```bash
fly ssh console --app property-portal-backend
# Inside the console:
alembic upgrade head
exit
```

Or you can run migrations directly:

```bash
fly ssh console --app property-portal-backend -C "alembic upgrade head"
```

## Step 6: Create Admin User

Create an admin user via the API:

```bash
curl -X POST https://property-portal-backend.fly.dev/api/v1/auth/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "phone": "1234567890",
    "user_type": "admin",
    "password": "YourSecurePassword123!"
  }'
```

## Troubleshooting

### Check logs

```bash
# Backend logs
fly logs --app property-portal-backend

# Frontend logs
fly logs --app property-portal-frontend
```

### Check environment variables

```bash
fly secrets list --app property-portal-backend
fly secrets list --app property-portal-frontend
```

### Database connection issues

```bash
# Check database status
fly postgres status --app property-portal-db

# Connect to database
fly postgres connect --app property-portal-db
```

### Scale your apps

```bash
# Scale backend
fly scale count 1 --app property-portal-backend

# Scale frontend
fly scale count 1 --app property-portal-frontend
```

## Environment Variables Reference

### Backend (`property-portal-backend`)

- `SECRET_KEY` - JWT secret key (required)
- `FRONTEND_URL` - Frontend URL for CORS (e.g., `https://property-portal-frontend.fly.dev`)
- `DATABASE_URL` - Automatically set by Fly.io when attaching PostgreSQL

### Frontend (`property-portal-frontend`)

- `VITE_API_BASE_URL` - Backend API URL (e.g., `https://property-portal-backend.fly.dev/api/v1`)

## Custom Domains (Optional)

### Add custom domain to backend

```bash
fly certs add api.yourdomain.com --app property-portal-backend
```

### Add custom domain to frontend

```bash
fly certs add www.yourdomain.com --app property-portal-frontend
```

Then update your environment variables accordingly.

## Monitoring

- View metrics: `fly dashboard`
- Monitor logs: `fly logs --app <app-name>`
- Check status: `fly status --app <app-name>`

## Cost Optimization

Both apps are configured with:
- `auto_stop_machines = true` - Machines stop when idle
- `auto_start_machines = true` - Machines start on request
- `min_machines_running = 0` - No machines running when idle

This keeps costs low for low-traffic applications.

## Security Notes

1. **Never commit secrets** - Use `fly secrets set` for sensitive data
2. **Use strong SECRET_KEY** - Generate with `openssl rand -hex 32`
3. **Enable HTTPS** - Fly.io enables HTTPS by default
4. **Database security** - PostgreSQL is only accessible from your backend app

## Next Steps

1. Set up monitoring and alerts
2. Configure custom domains
3. Set up CI/CD for automatic deployments
4. Configure backups for PostgreSQL
5. Add error tracking (e.g., Sentry)

