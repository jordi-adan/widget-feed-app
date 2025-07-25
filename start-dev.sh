#!/bin/bash

# Widget Feed App - Development Server Startup Script
# This script starts PostgreSQL, backend, and frontend servers with automatic setup

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Ports
BACKEND_PORT=3001
FRONTEND_PORT=3000
POSTGRES_PORT=5432

echo -e "${BLUE}🚀 Widget Feed App - Development Server Startup${NC}"
echo "=================================================="

# Function to kill processes on specific ports
kill_port_processes() {
    local port=$1
    local service_name=$2
    
    echo -e "${YELLOW}🔍 Checking for existing processes on port $port...${NC}"
    
    # Find and kill processes using the port
    local pids=$(lsof -ti:$port 2>/dev/null || true)
    
    if [ ! -z "$pids" ]; then
        echo -e "${YELLOW}⚠️  Found existing $service_name processes on port $port${NC}"
        echo -e "${YELLOW}🔄 Killing existing processes...${NC}"
        echo "$pids" | xargs kill -9 2>/dev/null || true
        sleep 2
        echo -e "${GREEN}✅ Cleaned up port $port${NC}"
    else
        echo -e "${GREEN}✅ Port $port is available${NC}"
    fi
}

# Function to check if directory exists
check_directory() {
    local dir=$1
    local name=$2
    
    if [ ! -d "$dir" ]; then
        echo -e "${RED}❌ $name directory not found: $dir${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ $name directory found${NC}"
}

# Check if we're in the right directory
if [ ! -f "README.md" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo -e "${RED}❌ Please run this script from the root directory of widget-feed-app${NC}"
    exit 1
fi

# Check directories
check_directory "backend" "Backend"
check_directory "frontend" "Frontend"

# Clean up ports
kill_port_processes $BACKEND_PORT "backend"
kill_port_processes $FRONTEND_PORT "frontend"

echo ""
echo -e "${BLUE}🗄️  Starting PostgreSQL Database...${NC}"
echo "====================================="

# Check if Docker and docker-compose are available
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed or not running${NC}"
    echo "Please install Docker and try again"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ docker-compose is not installed${NC}"
    echo "Please install docker-compose and try again"
    exit 1
fi

# Start PostgreSQL
echo -e "${YELLOW}📦 Starting PostgreSQL container...${NC}"
docker-compose up -d postgres-dev

# Wait for PostgreSQL to be ready
echo -e "${YELLOW}⏳ Waiting for PostgreSQL to be ready...${NC}"
timeout=30
counter=0
while ! docker-compose exec postgres-dev pg_isready -U widget_user -d widget_feed_dev &> /dev/null; do
    if [ $counter -eq $timeout ]; then
        echo -e "${RED}❌ PostgreSQL did not start within $timeout seconds${NC}"
        docker-compose logs postgres-dev
        exit 1
    fi
    sleep 1
    counter=$((counter + 1))
    echo -n "."
done
echo

echo -e "${GREEN}✅ PostgreSQL is ready${NC}"

# Run migrations
echo -e "${YELLOW}🚀 Running database migrations...${NC}"
docker-compose --profile migration up flyway
migration_exit_code=$?

if [ $migration_exit_code -eq 0 ]; then
    echo -e "${GREEN}✅ Database migrations completed${NC}"
else
    echo -e "${RED}❌ Database migrations failed${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🏗️  Starting Application Servers...${NC}"
echo "===================================="

# Start backend server
echo -e "${YELLOW}📡 Starting Backend Server (Port $BACKEND_PORT)...${NC}"
cd backend
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Backend package.json not found${NC}"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
    npm install
fi

# Start backend in background
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend server started (PID: $BACKEND_PID)${NC}"

# Wait a moment for backend to start
sleep 3

# Check if backend is running
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${RED}❌ Backend failed to start. Check backend.log for details${NC}"
    cat ../backend.log
    exit 1
fi

# Start frontend server
echo -e "${YELLOW}🌐 Starting Frontend Server (Port $FRONTEND_PORT)...${NC}"
cd ../frontend
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Frontend package.json not found${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
    npm install
fi

# Start frontend in background
BROWSER=none npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend server started (PID: $FRONTEND_PID)${NC}"

# Wait a moment for frontend to start
sleep 5

# Check if frontend is running
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo -e "${RED}❌ Frontend failed to start. Check frontend.log for details${NC}"
    cat ../frontend.log
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 SUCCESS! All services are running:${NC}"
echo "========================================"
echo -e "${GREEN}🗄️  PostgreSQL: localhost:$POSTGRES_PORT${NC}"
echo -e "${GREEN}📡 Backend:     http://localhost:$BACKEND_PORT${NC}"
echo -e "${GREEN}🌐 Frontend:    http://localhost:$FRONTEND_PORT${NC}"
echo ""
echo -e "${BLUE}📋 Useful Commands:${NC}"
echo "• View backend logs:   tail -f backend.log"
echo "• View frontend logs:  tail -f frontend.log"
echo "• Database console:    ./scripts/db-console.sh"
echo "• Reset database:      ./scripts/db-reset.sh"
echo "• Stop all services:   ./stop-dev.sh"
echo ""
echo -e "${YELLOW}💡 Press Ctrl+C to stop all services${NC}"

# Create a cleanup function
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down services...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    echo -e "${YELLOW}🗄️  Stopping PostgreSQL...${NC}"
    docker-compose stop postgres-dev
    echo -e "${GREEN}✅ All services stopped${NC}"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Keep script running and monitor processes
while true; do
    # Check if both processes are still running
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        echo -e "${RED}❌ Backend process died unexpectedly${NC}"
        kill $FRONTEND_PID 2>/dev/null || true
        exit 1
    fi
    
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        echo -e "${RED}❌ Frontend process died unexpectedly${NC}"
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
    fi
    
    sleep 5
done
