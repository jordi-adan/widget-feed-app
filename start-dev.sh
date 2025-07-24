#!/bin/bash

# Widget Feed App - Development Server Startup Script
# This script starts both backend and frontend servers with automatic port cleanup

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
echo -e "${BLUE}🏗️  Starting Development Servers...${NC}"
echo "======================================"

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
echo -e "${GREEN}🎉 SUCCESS! Both servers are running:${NC}"
echo "========================================="
echo -e "${GREEN}📡 Backend:  http://localhost:$BACKEND_PORT${NC}"
echo -e "${GREEN}🌐 Frontend: http://localhost:$FRONTEND_PORT${NC}"
echo ""
echo -e "${BLUE}📋 Useful Commands:${NC}"
echo "• View backend logs:  tail -f backend.log"
echo "• View frontend logs: tail -f frontend.log"
echo "• Stop all servers:   ./stop-dev.sh"
echo ""
echo -e "${YELLOW}💡 Press Ctrl+C to stop all servers${NC}"

# Create a cleanup function
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down servers...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    echo -e "${GREEN}✅ Servers stopped${NC}"
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
