-- Sample Widget Descriptors for Development
-- ==========================================
-- This migration adds comprehensive sample data for all widget types
-- to support development and testing scenarios.

-- Text Widgets (Static and Dynamic)
-- =================================
INSERT INTO widget_descriptors (
    id,
    widget_type,
    content_type,
    static_content,
    created_at
) VALUES 
(
    uuid_generate_v4(),
    'text',
    'static',
    '{"title": "Welcome to Widget Feed", "content": "This is a static text widget showing welcome information."}',
    NOW() - INTERVAL '1 day'
),
(
    uuid_generate_v4(),
    'text',
    'static',
    '{"title": "System Status", "content": "All systems operational. Last updated: 2025-01-25"}',
    NOW() - INTERVAL '2 hours'
);

INSERT INTO widget_descriptors (
    id,
    widget_type,
    content_type,
    data_url,
    loading_state,
    error_state,
    created_at
) VALUES 
(
    uuid_generate_v4(),
    'text',
    'dynamic',
    'https://jsonplaceholder.typicode.com/posts/1',
    'skeleton',
    'retry',
    NOW() - INTERVAL '6 hours'
);

-- ExpandableList Widgets (Static and Dynamic)
-- ===========================================
INSERT INTO widget_descriptors (
    id,
    widget_type,
    content_type,
    static_content,
    created_at
) VALUES 
(
    uuid_generate_v4(),
    'expandable_list',
    'static',
    '{"items": [{"title": "Task 1", "description": "Complete project documentation", "status": "pending"}, {"title": "Task 2", "description": "Review code changes", "status": "completed"}]}',
    NOW() - INTERVAL '30 minutes'
);

INSERT INTO widget_descriptors (
    id,
    widget_type,
    content_type,
    data_url,
    loading_state,
    error_state,
    created_at
) VALUES 
(
    uuid_generate_v4(),
    'expandable_list',
    'dynamic',
    'https://jsonplaceholder.typicode.com/posts?_limit=5',
    'skeleton',
    'retry',
    NOW() - INTERVAL '3 hours'
),
(
    uuid_generate_v4(),
    'expandable_list',
    'dynamic',
    'https://jsonplaceholder.typicode.com/users?_limit=3',
    'hidden',
    'message',
    NOW() - INTERVAL '45 minutes'
);

-- Table Widgets (Static and Dynamic)
-- ==================================
INSERT INTO widget_descriptors (
    id,
    widget_type,
    content_type,
    static_content,
    created_at
) VALUES 
(
    uuid_generate_v4(),
    'table',
    'static',
    '{"headers": ["Name", "Status", "Date"], "rows": [["Project A", "Active", "2025-01-20"], ["Project B", "Completed", "2025-01-15"]]}',
    NOW() - INTERVAL '4 hours'
);

INSERT INTO widget_descriptors (
    id,
    widget_type,
    content_type,
    data_url,
    loading_state,
    error_state,
    created_at
) VALUES 
(
    uuid_generate_v4(),
    'table',
    'dynamic',
    'https://jsonplaceholder.typicode.com/albums?_limit=4',
    'skeleton',
    'retry',
    NOW() - INTERVAL '2 hours'
);

-- Chart Widgets (Static and Dynamic)
-- ==================================
INSERT INTO widget_descriptors (
    id,
    widget_type,
    content_type,
    static_content,
    created_at
) VALUES 
(
    uuid_generate_v4(),
    'chart',
    'static',
    '{"type": "bar", "data": {"labels": ["Jan", "Feb", "Mar"], "values": [10, 20, 15]}, "title": "Monthly Sales"}',
    NOW() - INTERVAL '8 hours'
),
(
    uuid_generate_v4(),
    'chart',
    'static',
    '{"type": "line", "data": {"labels": ["Week 1", "Week 2", "Week 3", "Week 4"], "values": [5, 8, 12, 15]}, "title": "Growth Trend"}',
    NOW() - INTERVAL '1 hour'
);

INSERT INTO widget_descriptors (
    id,
    widget_type,
    content_type,
    data_url,
    loading_state,
    error_state,
    created_at
) VALUES 
(
    uuid_generate_v4(),
    'chart',
    'dynamic',
    'https://api.example.com/analytics/sales',
    'skeleton',
    'message',
    NOW() - INTERVAL '12 hours'
);

-- Map Widgets (Static and Dynamic)
-- ================================
INSERT INTO widget_descriptors (
    id,
    widget_type,
    content_type,
    static_content,
    created_at
) VALUES 
(
    uuid_generate_v4(),
    'map',
    'static',
    '{"center": {"lat": 40.7128, "lng": -74.0060}, "zoom": 12, "markers": [{"lat": 40.7128, "lng": -74.0060, "title": "New York City"}]}',
    NOW() - INTERVAL '5 hours'
);

INSERT INTO widget_descriptors (
    id,
    widget_type,
    content_type,
    data_url,
    loading_state,
    error_state,
    created_at
) VALUES 
(
    uuid_generate_v4(),
    'map',
    'dynamic',
    'https://api.example.com/locations/current',
    'hidden',
    'retry',
    NOW() - INTERVAL '30 minutes'
);

-- Feed Widgets (Static and Dynamic)
-- =================================
INSERT INTO widget_descriptors (
    id,
    widget_type,
    content_type,
    static_content,
    created_at
) VALUES 
(
    uuid_generate_v4(),
    'feed',
    'static',
    '{"items": [{"title": "News Item 1", "summary": "Important update about the system", "timestamp": "2025-01-25T10:00:00Z"}, {"title": "News Item 2", "summary": "New features released", "timestamp": "2025-01-24T15:30:00Z"}]}',
    NOW() - INTERVAL '15 minutes'
);

INSERT INTO widget_descriptors (
    id,
    widget_type,
    content_type,
    data_url,
    loading_state,
    error_state,
    created_at
) VALUES 
(
    uuid_generate_v4(),
    'feed',
    'dynamic',
    'https://jsonplaceholder.typicode.com/posts?_limit=6',
    'skeleton',
    'retry',
    NOW() - INTERVAL '1 hour'
),
(
    uuid_generate_v4(),
    'feed',
    'dynamic',
    'https://api.example.com/news/latest',
    'hidden',
    'message',
    NOW() - INTERVAL '20 minutes'
);

-- Summary Information
-- ==================
DO $$
DECLARE
    total_descriptors INTEGER;
    static_count INTEGER;
    dynamic_count INTEGER;
BEGIN
    -- Count total widget descriptors
    SELECT COUNT(*) INTO total_descriptors FROM widget_descriptors;
    
    -- Count by content type
    SELECT COUNT(*) INTO static_count FROM widget_descriptors WHERE content_type = 'static';
    SELECT COUNT(*) INTO dynamic_count FROM widget_descriptors WHERE content_type = 'dynamic';
    
    -- Log summary
    RAISE NOTICE 'Widget descriptors created successfully:';
    RAISE NOTICE '  Total: %', total_descriptors;
    RAISE NOTICE '  Static: %', static_count;
    RAISE NOTICE '  Dynamic: %', dynamic_count;
    RAISE NOTICE 'Widget types covered: text, expandable_list, table, chart, map, feed';
END $$;
