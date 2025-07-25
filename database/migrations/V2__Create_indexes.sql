-- Widget Feed Database Indexes
-- =============================
-- Creates indexes for optimal query performance

-- Primary indexes for widget_descriptors
-- ======================================

-- Index for filtering by widget type (common query pattern)
CREATE INDEX idx_widget_descriptors_widget_type 
    ON widget_descriptors(widget_type);

-- Index for filtering by content type
CREATE INDEX idx_widget_descriptors_content_type 
    ON widget_descriptors(content_type);

-- Composite index for widget_type + content_type queries
CREATE INDEX idx_widget_descriptors_type_content 
    ON widget_descriptors(widget_type, content_type);

-- Index for created_at ordering (for latest widgets queries)
CREATE INDEX idx_widget_descriptors_created_at 
    ON widget_descriptors(created_at DESC);

-- GIN index for JSONB static_content queries
CREATE INDEX idx_widget_descriptors_static_content_gin 
    ON widget_descriptors USING gin(static_content);

-- Index for data_url lookup (dynamic widgets)
CREATE INDEX idx_widget_descriptors_data_url 
    ON widget_descriptors(data_url) WHERE content_type = 'dynamic';

-- Primary indexes for widgets (legacy)
-- ====================================

-- Index for filtering by type
CREATE INDEX idx_widgets_type 
    ON widgets(type);

-- Index for created_at ordering
CREATE INDEX idx_widgets_created_at 
    ON widgets(created_at DESC);

-- Composite index for type + created_at (common pattern)
CREATE INDEX idx_widgets_type_created_at 
    ON widgets(type, created_at DESC);

-- Full-text search index for content (if needed for search features)
CREATE INDEX idx_widgets_content_fulltext 
    ON widgets USING gin(to_tsvector('english', content));

-- Partial indexes for optimization
-- ================================

-- Index only static widgets
CREATE INDEX idx_widget_descriptors_static_only 
    ON widget_descriptors(widget_type, created_at DESC) 
    WHERE content_type = 'static';

-- Index only dynamic widgets
CREATE INDEX idx_widget_descriptors_dynamic_only 
    ON widget_descriptors(widget_type, data_url, created_at DESC) 
    WHERE content_type = 'dynamic';

-- Performance monitoring
-- ======================

-- Create a view for index usage monitoring (useful for development)
CREATE OR REPLACE VIEW v_index_usage AS
SELECT 
    schemaname,
    relname as tablename,
    indexrelname as indexname,
    idx_tup_read,
    idx_tup_fetch,
    idx_scan
FROM pg_stat_user_indexes 
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

COMMENT ON VIEW v_index_usage IS 'Monitor index usage for performance optimization';

-- Log successful index creation
DO $$
DECLARE
    index_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO index_count 
    FROM pg_indexes 
    WHERE schemaname = 'public' 
    AND tablename IN ('widget_descriptors', 'widgets');
    
    RAISE NOTICE 'Widget Feed indexes created successfully';
    RAISE NOTICE 'Total indexes created: %', index_count;
END $$;
