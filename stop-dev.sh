#!/bin/bash

# Widget Feed App - Stop Development Services Script
# This script stops all running development services

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🛑 Widget Feed App - Stop Development Services${NC}"
echo "=============================================="

# Ports to clean up
BACKEND_PORT=3001
FRONTEND_PORT=3000

# Function to kill processes on specific ports
kill_port_processes() {
    local port=$1
    local service_name=$2
    
    echo -e "${YELLOW}🔍 Stopping $service_name processes on port $port...${NC}"
    
    # Find and kill processes using the port
    local pids=$(lsof -ti:$port 2>/dev/null || true)
    
    if [ ! -z "$pids" ]; then
        echo -e "${YELLOW}⚠️  Found $service_name processes: $pids${NC}"
        echo "$pids" | xargs kill -9 2>/dev/null || true
        sleep 1
        echo -e "${GREEN}✅ Stopped $service_name on port $port${NC}"
    else
        echo -e "${GREEN}✅ No $service_name processes found on port $port${NC}"
    fi
}

# Stop servers
kill_port_processes $BACKEND_PORT "backend"
kill_port_processes $FRONTEND_PORT "frontend"

# Clean up log files
echo -e "${YELLOW}🧹 Cleaning up log files...${NC}"
rm -f backend.log frontend.log
echo -e "${GREEN}✅ Log files cleaned${NC}"

echo ""
echo -e "${GREEN}🎉 All development services stopped successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "• Start services: ./start-dev.sh"
echo "• Test backend:   curl http://localhost:3001/health"
echo "• Test frontend:  open http://localhost:3000"
