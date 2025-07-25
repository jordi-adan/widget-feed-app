# Database Documentation

## 🗄️ PostgreSQL Setup

This project uses PostgreSQL with Docker for development and testing environments.

### Quick Start

```bash
# Start all services (PostgreSQL + Backend + Frontend)
./start-dev.sh

# Stop all services
./stop-dev.sh

# Reset database with fresh sample data
./scripts/db-reset.sh
```

## 📋 Database Configuration

### Development Database
- **Host**: localhost
- **Port**: 5432
- **Database**: widget_feed_dev
- **Username**: widget_user
- **Password**: widget_pass

### Test Database
- **Host**: localhost
- **Port**: 5433
- **Database**: widget_feed_test
- **Username**: widget_user
- **Password**: widget_pass

## 🚀 Available Scripts

### Database Management
```bash
./scripts/db-reset.sh      # Complete database reset
./scripts/db-migrate.sh    # Run migrations only
./scripts/db-console.sh    # Open PostgreSQL console
./scripts/db-backup.sh     # Create database backup
```

### Docker Commands
```bash
# Start PostgreSQL only
docker-compose up -d postgres-dev

# View PostgreSQL logs
docker-compose logs postgres-dev

# Run migrations
docker-compose --profile migration up flyway

# Start test database
docker-compose --profile testing up -d postgres-test
```

## 📊 Database Schema

### Widget Descriptors (PRD-compliant)
```sql
CREATE TABLE widget_descriptors (
    id UUID PRIMARY KEY,
    widget_type VARCHAR(50) NOT NULL,
    content_type VARCHAR(20) NOT NULL,
    static_content JSONB,
    data_url VARCHAR(500),
    loading_state VARCHAR(20),
    error_state VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Legacy Widgets (Backward compatibility)
```sql
CREATE TABLE widgets (
    id UUID PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🎯 Sample Data

The database comes pre-loaded with sample data for all widget types:

### Widget Descriptors (12 samples)
- **TextBlock**: 2 static widgets
- **ExpandableList**: 1 dynamic + 1 static
- **HorizontalCards**: 1 static + 1 dynamic
- **ImageList**: 1 static + 1 dynamic
- **HighlightBanner**: 2 static widgets
- **QuickActions**: 2 static widgets

### Legacy Widgets (40+ samples)
- Text widgets with various content
- Image widgets with Unsplash photos
- Video widgets with sample URLs
- Link widgets to documentation
- Chart widgets with JSON data
- Performance testing data

## 🔄 Migration System

Migrations are managed by Flyway and run automatically:

1. **V1**: Create core tables and constraints
2. **V2**: Add indexes for performance
3. **V3**: Insert sample widget descriptors
4. **V4**: Insert sample legacy widgets

### Adding New Migrations

1. Create new file: `database/migrations/V5__Description.sql`
2. Run: `./scripts/db-migrate.sh`

## 🧪 Testing with Database

### Test Database Setup
```bash
# Start test database
docker-compose --profile testing up -d postgres-test

# Run migrations on test database
docker-compose --profile testing up flyway-test
```

### Test Environment Variables
```bash
# In your test environment
DATABASE_URL=postgresql://widget_user:widget_pass@localhost:5433/widget_feed_test
```

## 🚨 Troubleshooting

### Common Issues

**PostgreSQL won't start:**
```bash
# Check if port is in use
lsof -ti:5432

# Reset Docker containers
docker-compose down -v
docker-compose up -d postgres-dev
```

**Migration errors:**
```bash
# Check Flyway logs
docker-compose logs flyway

# Reset database completely
./scripts/db-reset.sh
```

**Connection refused:**
```bash
# Wait for PostgreSQL to be ready
docker-compose exec postgres-dev pg_isready -U widget_user -d widget_feed_dev
```

### Performance Monitoring

View index usage:
```sql
SELECT * FROM v_index_usage ORDER BY idx_scan DESC;
```

Check table sizes:
```sql
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(tablename::regclass)) as size
FROM pg_tables 
WHERE schemaname = 'public';
```

## 📦 Backup & Restore

### Create Backup
```bash
./scripts/db-backup.sh
```

### Restore from Backup
```bash
# Stop current database
docker-compose stop postgres-dev

# Start fresh database
docker-compose up -d postgres-dev

# Restore backup
cat backups/widget_feed_backup_YYYYMMDD_HHMMSS.sql | \
docker-compose exec -T postgres-dev psql -U widget_user -d widget_feed_dev
```

## 🔗 Integration

The PostgreSQL database integrates with the widget feed application through:

1. **Environment Variables**: Database connection configuration
2. **Repository Pattern**: Hexagonal architecture compliance
3. **TDD Approach**: Full test coverage for database operations
4. **Migration Strategy**: Safe, incremental schema changes

---

**Next Steps**: Implement PostgreSQL repositories in PR #4
