#!/bin/bash
set -e

# Database Console Script for Widget Feed App
# ===========================================
# Opens interactive PostgreSQL console for development database

echo "🗄️  Widget Feed Database Console"
echo "==============================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
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
    print_error "PostgreSQL container is not running"
    echo "Start it with: docker-compose up -d postgres-dev"
    exit 1
fi

print_status "Connecting to Widget Feed development database..."
print_warning "You are now connected to the live development database"
echo ""
echo "Useful commands:"
echo "  \\dt                     - List all tables"
echo "  \\d widget_descriptors   - Describe widget_descriptors table"
echo "  \\d widgets             - Describe widgets table"
echo "  \\q                     - Quit"
echo ""
echo "Sample queries:"
echo "  SELECT COUNT(*) FROM widget_descriptors;"
echo "  SELECT widget_type, content_type, COUNT(*) FROM widget_descriptors GROUP BY widget_type, content_type;"
echo "  SELECT * FROM widgets ORDER BY created_at DESC LIMIT 5;"
echo ""

# Open PostgreSQL console
docker-compose exec postgres-dev psql -U widget_user -d widget_feed_dev
