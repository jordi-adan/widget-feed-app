# PostgreSQL Migration Plan - TDD & DDD Approach

## 🎯 Overview
Migrate from in-memory storage to PostgreSQL with Docker, maintaining hexagonal architecture and following TDD methodology across multiple safe PRs.

## 📋 PR Breakdown Strategy

### **PR #3: Docker PostgreSQL Infrastructure**
**Scope**: Docker setup + Flyway migrations + Dummy data
- ✅ Docker Compose for PostgreSQL
- ✅ Flyway migration setup
- ✅ Database schema creation
- ✅ Dummy data for all 6 widget types
- ✅ Dev environment integration
- ⚠️ **No code changes** - pure infrastructure

### **PR #4: PostgreSQL Repository Implementation**
**Scope**: Database repository layer (TDD)
- ✅ TDD: PostgreSQL Widget Repository
- ✅ TDD: PostgreSQL WidgetDescriptor Repository  
- ✅ Database connection management
- ✅ SQL query implementations
- ✅ Full test coverage with test database
- ⚠️ **No application changes** - pure data layer

### **PR #5: Repository Integration & Switchover**
**Scope**: Replace in-memory with PostgreSQL
- ✅ Dependency injection updates
- ✅ Configuration management
- ✅ Environment-based repository selection
- ✅ Integration testing
- ✅ Performance validation
- ⚠️ **Backward compatible** - can switch back

### **PR #6: Migration Cleanup & Optimizations**
**Scope**: Remove old code + optimizations
- ✅ Remove in-memory repositories
- ✅ Database indexes and performance
- ✅ Connection pooling optimization
- ✅ Production readiness checklist

## 🛠️ Technical Architecture

### **Database Schema Design**
```sql
-- Widget Descriptors (PRD-compliant)
CREATE TABLE widget_descriptors (
    id UUID PRIMARY KEY,
    widget_type VARCHAR(50) NOT NULL,
    content_type VARCHAR(20) NOT NULL,
    static_content JSONB,
    data_url VARCHAR(500),
    loading_state VARCHAR(20),
    error_state VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Legacy Widgets (compatibility)
CREATE TABLE widgets (
    id UUID PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### **Hexagonal Architecture Compliance**
```
Application Layer    ← No changes needed
     ↓
Domain Layer        ← No changes needed  
     ↓
Infrastructure      ← Add PostgreSQL implementations
- InMemoryRepo      → Keep for testing
- PostgresRepo      → NEW: Production implementation
```

### **TDD Approach**
1. **Red**: Write failing tests for PostgreSQL repository
2. **Green**: Implement minimal PostgreSQL repository
3. **Refactor**: Optimize and clean up implementation
4. **Repeat**: For each repository method

## 🚀 PR #3 Implementation Details

### **Docker Infrastructure**
- PostgreSQL 15 container
- Flyway for migrations
- Development volume persistence
- Automatic startup with dev scripts

### **Flyway Migrations**
```
migrations/
├── V1__Create_widget_tables.sql
├── V2__Create_indexes.sql
├── V3__Insert_sample_widget_descriptors.sql
└── V4__Insert_sample_legacy_widgets.sql
```

### **Sample Data Strategy**
- **All 6 PRD Widget Types**: 2-3 samples each
- **Legacy Widgets**: Backward compatibility samples
- **Real Content**: Unsplash images, realistic text
- **Diverse Configurations**: Static + Dynamic examples

## 🔄 Development Workflow

### **Starting Development**
```bash
./start-dev.sh  # Now includes PostgreSQL + Flyway
```

### **Database Management**
```bash
./scripts/db-reset.sh     # Reset with fresh data
./scripts/db-migrate.sh   # Run new migrations
./scripts/db-backup.sh    # Backup current state
```

## 🧪 Testing Strategy

### **Test Database**
- Separate test PostgreSQL instance
- Fresh schema for each test suite
- Parallel test execution support

### **Test Coverage Goals**
- **Unit Tests**: Each repository method
- **Integration Tests**: Full database workflows
- **Performance Tests**: Query optimization
- **Migration Tests**: Schema changes validation

## 📊 Success Metrics

### **Performance Targets**
- Widget retrieval: < 50ms (vs 5ms in-memory)
- Widget creation: < 100ms (vs 10ms in-memory)
- Bulk operations: < 500ms for 100 widgets

### **Reliability Targets**
- Zero data loss during migration
- 100% test coverage maintenance
- Backward compatibility preserved

## 🚨 Risk Mitigation

### **Rollback Strategy**
- Environment variable to switch back to in-memory
- Database backup before each migration
- Feature flags for gradual rollout

### **Data Migration Safety**
- Schema-first approach (no data loss)
- Validation scripts for data integrity
- Automated testing of migration path

---

## 🎯 Next Steps

**Ready to start PR #3**: Docker PostgreSQL Infrastructure

Would you like me to proceed with implementing the first PR?
