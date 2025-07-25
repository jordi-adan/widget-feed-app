-- Widget Feed Database Schema Creation
-- ====================================
-- Creates the core tables for the Widget Feed application
-- Following DDD principles with proper normalization

-- Enable PostgreSQL extensions
-- ============================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Table: widget_descriptors (PRD-compliant widgets)
-- =================================================
CREATE TABLE widget_descriptors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    widget_type VARCHAR(50) NOT NULL,
    content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('static', 'dynamic')),
    
    -- Static content stored as JSONB for flexibility
    static_content JSONB,
    
    -- Dynamic content configuration
    data_url VARCHAR(500),
    loading_state VARCHAR(20) CHECK (loading_state IN ('skeleton', 'hidden')),
    error_state VARCHAR(20) CHECK (error_state IN ('hidden', 'message', 'retry')),
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT widget_descriptors_static_content_check 
        CHECK (
            (content_type = 'static' AND static_content IS NOT NULL AND data_url IS NULL) OR
            (content_type = 'dynamic' AND static_content IS NULL AND data_url IS NOT NULL)
        ),
    
    CONSTRAINT widget_descriptors_dynamic_state_check
        CHECK (
            (content_type = 'static') OR 
            (content_type = 'dynamic' AND loading_state IS NOT NULL AND error_state IS NOT NULL)
        )
);

-- Table: widgets (Legacy compatibility)
-- ====================================
CREATE TABLE widgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments for documentation
-- ==========================
COMMENT ON TABLE widget_descriptors IS 'PRD-compliant widget descriptors with static/dynamic content support';
COMMENT ON TABLE widgets IS 'Legacy widget table for backward compatibility';

COMMENT ON COLUMN widget_descriptors.widget_type IS 'Type of widget: text_block, expandable_list, horizontal_cards, image_list, highlight_banner, quick_actions';
COMMENT ON COLUMN widget_descriptors.content_type IS 'Content type: static (embedded) or dynamic (fetched from URL)';
COMMENT ON COLUMN widget_descriptors.static_content IS 'JSONB content for static widgets';
COMMENT ON COLUMN widget_descriptors.data_url IS 'URL for fetching dynamic content';
COMMENT ON COLUMN widget_descriptors.loading_state IS 'Loading state: skeleton or hidden';
COMMENT ON COLUMN widget_descriptors.error_state IS 'Error handling: hidden, message, or retry';

-- Log successful table creation
DO $$
BEGIN
    RAISE NOTICE 'Widget Feed schema created successfully';
    RAISE NOTICE 'Tables created: widget_descriptors, widgets';
END $$;
