#!/bin/bash
set -e

# Database Migration Script for Widget Feed App
# =============================================
# Runs Flyway migrations on development database

echo "🚀 Widget Feed Database Migration"
echo "================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if PostgreSQL is running
if ! docker-compose ps postgres-dev | grep -q "Up"; then
    print_warning "PostgreSQL container is not running. Starting it..."
    docker-compose up -d postgres-dev
    
    print_status "Waiting for PostgreSQL to be ready..."
    timeout=30
    counter=0
    while ! docker-compose exec postgres-dev pg_isready -U widget_user -d widget_feed_dev &> /dev/null; do
        if [ $counter -eq $timeout ]; then
            print_error "PostgreSQL did not start within $timeout seconds"
            exit 1
        fi
        sleep 1
        counter=$((counter + 1))
        echo -n "."
    done
    echo
fi

print_status "Running Flyway migrations..."
docker-compose --profile migration up --build flyway

migration_exit_code=$?
if [ $migration_exit_code -eq 0 ]; then
    print_status "Migrations completed successfully!"
    
    # Show migration info
    print_status "Migration information:"
    docker-compose exec -T postgres-dev psql -U widget_user -d widget_feed_dev -c "
        SELECT version, description, installed_on, execution_time 
        FROM flyway_schema_history 
        ORDER BY installed_rank DESC 
        LIMIT 5;
    "
else
    print_error "Migration failed with exit code $migration_exit_code"
    exit 1
fi
