#!/bin/bash
set -e

# Database Initialization Script for Widget Feed App
# ==================================================
# This script runs when PostgreSQL container starts for the first time

echo "Starting Widget Feed database initialization..."

# Create additional schemas if needed
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Enable UUID extension for UUID generation
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
    -- Enable JSONB GIN indexing extension
    CREATE EXTENSION IF NOT EXISTS "btree_gin";
    
    -- Create application user with limited privileges (if different from POSTGRES_USER)
    -- For now, we'll use the main user, but this could be separated in production
    
    -- Grant necessary permissions
    GRANT ALL PRIVILEGES ON DATABASE ${POSTGRES_DB} TO ${POSTGRES_USER};
    
    -- Log initialization completion
    SELECT 'Widget Feed database initialization completed' AS status;
EOSQL

echo "Widget Feed database initialization completed successfully!"
