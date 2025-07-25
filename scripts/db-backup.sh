#!/bin/bash
set -e

# Database Backup Script for Widget Feed App
# ==========================================
# Creates a backup of the development database

echo "💾 Widget Feed Database Backup"
echo "=============================="

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

# Create backups directory if it doesn't exist
mkdir -p backups

# Generate backup filename with timestamp
timestamp=$(date +"%Y%m%d_%H%M%S")
backup_file="backups/widget_feed_backup_${timestamp}.sql"

# Check if PostgreSQL is running
if ! docker-compose ps postgres-dev | grep -q "Up"; then
    print_error "PostgreSQL container is not running"
    echo "Start it with: docker-compose up -d postgres-dev"
    exit 1
fi

print_status "Creating backup of widget_feed_dev database..."
docker-compose exec -T postgres-dev pg_dump -U widget_user -d widget_feed_dev --clean --if-exists > "$backup_file"

if [ $? -eq 0 ]; then
    backup_size=$(du -h "$backup_file" | cut -f1)
    print_status "Backup created successfully!"
    echo "  File: $backup_file"
    echo "  Size: $backup_size"
    
    # Show backup contents summary
    print_status "Backup summary:"
    echo "  Tables backed up:"
    grep "CREATE TABLE" "$backup_file" | sed 's/CREATE TABLE /  - /' | sed 's/ (.*$//'
    
    # Keep only last 5 backups
    print_status "Cleaning up old backups (keeping last 5)..."
    ls -t backups/widget_feed_backup_*.sql | tail -n +6 | xargs -r rm
    
    remaining_backups=$(ls -1 backups/widget_feed_backup_*.sql 2>/dev/null | wc -l)
    echo "  Remaining backups: $remaining_backups"
else
    print_error "Backup failed!"
    exit 1
fi
