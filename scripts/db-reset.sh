#!/bin/bash
set -e

# Database Reset Script for Widget Feed App
# =========================================
# Stops containers, removes volumes, and recreates fresh database with migrations

echo "🗄️  Widget Feed Database Reset"
echo "=============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    print_error "docker-compose is not installed or not in PATH"
    exit 1
fi

# Confirm reset action
read -p "This will delete ALL data in the development database. Continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Database reset cancelled"
    exit 0
fi

print_status "Stopping all containers..."
docker-compose down

print_status "Removing database volumes..."
docker-compose down -v

print_status "Removing orphaned containers..."
docker-compose down --remove-orphans

print_status "Starting PostgreSQL container..."
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

print_status "Running Flyway migrations..."
docker-compose --profile migration up --build flyway

print_status "Checking migration status..."
migration_exit_code=$?
if [ $migration_exit_code -eq 0 ]; then
    print_status "Database reset completed successfully!"
else
    print_error "Migration failed with exit code $migration_exit_code"
    exit 1
fi

# Verify data
print_status "Verifying sample data..."
widget_count=$(docker-compose exec -T postgres-dev psql -U widget_user -d widget_feed_dev -t -c "SELECT COUNT(*) FROM widget_descriptors;" | xargs)
legacy_count=$(docker-compose exec -T postgres-dev psql -U widget_user -d widget_feed_dev -t -c "SELECT COUNT(*) FROM widgets;" | xargs)

print_status "Database verification:"
echo "  - Widget Descriptors: $widget_count"
echo "  - Legacy Widgets: $legacy_count"

print_status "Database reset complete! 🎉"
echo ""
echo "Next steps:"
echo "  - Start backend: cd backend && npm run dev"
echo "  - Start frontend: cd frontend && npm start"
echo "  - View database: ./scripts/db-console.sh"
