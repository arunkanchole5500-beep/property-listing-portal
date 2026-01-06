#!/bin/bash

# Fly.io Deployment Script for Property Listing Portal
# This script helps deploy both backend and frontend to Fly.io

set -e

echo "🚀 Property Listing Portal - Fly.io Deployment"
echo "================================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if fly CLI is installed
if ! command -v fly &> /dev/null; then
    echo -e "${RED}❌ Fly CLI is not installed. Please install it first:${NC}"
    echo "   https://fly.io/docs/getting-started/installing-flyctl/"
    exit 1
fi

echo -e "${GREEN}✅ Fly CLI found${NC}"

# Check if logged in
if ! fly auth whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Fly.io. Please login:${NC}"
    fly auth login
fi

echo -e "${GREEN}✅ Logged in to Fly.io${NC}"

# Step 1: Create PostgreSQL database
echo ""
echo "📦 Step 1: Creating PostgreSQL database..."
read -p "Database name (default: property-portal-db): " DB_NAME
DB_NAME=${DB_NAME:-property-portal-db}

if fly postgres list | grep -q "$DB_NAME"; then
    echo -e "${YELLOW}⚠️  Database $DB_NAME already exists${NC}"
else
    fly postgres create --name "$DB_NAME" --region iad --vm-size shared-cpu-1x --volume-size 3
    echo -e "${GREEN}✅ Database created${NC}"
fi

# Step 2: Deploy Backend
echo ""
echo "🔧 Step 2: Deploying Backend..."
read -p "Backend app name (default: property-portal-backend): " BACKEND_APP
BACKEND_APP=${BACKEND_APP:-property-portal-backend}

cd backend

# Initialize Fly app if needed
if [ ! -f "fly.toml" ] || ! fly apps list | grep -q "$BACKEND_APP"; then
    echo "Initializing Fly app..."
    fly launch --no-deploy --name "$BACKEND_APP" --region iad
fi

# Attach database
echo "Attaching database..."
fly postgres attach --app "$BACKEND_APP" "$DB_NAME" || echo "Database already attached"

# Generate secret key
SECRET_KEY=$(openssl rand -hex 32)
echo "Setting secrets..."

# Get frontend URL
read -p "Frontend URL (e.g., https://property-portal-frontend.fly.dev): " FRONTEND_URL

fly secrets set \
    SECRET_KEY="$SECRET_KEY" \
    FRONTEND_URL="$FRONTEND_URL" \
    --app "$BACKEND_APP"

echo "Deploying backend..."
fly deploy --app "$BACKEND_APP"

BACKEND_URL="https://$BACKEND_APP.fly.dev"
echo -e "${GREEN}✅ Backend deployed at: $BACKEND_URL${NC}"

# Step 3: Deploy Frontend
echo ""
echo "🎨 Step 3: Deploying Frontend..."
read -p "Frontend app name (default: property-portal-frontend): " FRONTEND_APP
FRONTEND_APP=${FRONTEND_APP:-property-portal-frontend}

cd ../frontend

# Initialize Fly app if needed
if [ ! -f "fly.toml" ] || ! fly apps list | grep -q "$FRONTEND_APP"; then
    echo "Initializing Fly app..."
    fly launch --no-deploy --name "$FRONTEND_APP" --region iad
fi

# Set API URL
API_URL="$BACKEND_URL/api/v1"
echo "Setting API URL: $API_URL"
fly secrets set VITE_API_BASE_URL="$API_URL" --app "$FRONTEND_APP"

echo "Deploying frontend..."
fly deploy --app "$FRONTEND_APP"

FRONTEND_URL="https://$FRONTEND_APP.fly.dev"
echo -e "${GREEN}✅ Frontend deployed at: $FRONTEND_URL${NC}"

# Step 4: Update backend CORS
echo ""
echo "🔐 Step 4: Updating backend CORS..."
cd ../backend
fly secrets set FRONTEND_URL="$FRONTEND_URL" --app "$BACKEND_APP"
fly deploy --app "$BACKEND_APP"

# Step 5: Run migrations
echo ""
echo "🗄️  Step 5: Running database migrations..."
fly ssh console --app "$BACKEND_APP" -C "cd /app && alembic upgrade head"

echo ""
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo ""
echo "Backend URL:  $BACKEND_URL"
echo "Frontend URL: $FRONTEND_URL"
echo ""
echo "Next steps:"
echo "1. Create an admin user:"
echo "   curl -X POST $BACKEND_URL/api/v1/auth/users \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"email\":\"admin@example.com\",\"phone\":\"1234567890\",\"user_type\":\"admin\",\"password\":\"YourPassword123!\"}'"
echo ""
echo "2. Visit your frontend: $FRONTEND_URL"
echo "3. Login at: $FRONTEND_URL/login"

