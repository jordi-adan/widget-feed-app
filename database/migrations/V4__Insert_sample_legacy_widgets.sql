-- Sample Legacy Widgets Data
-- ==========================
-- Inserts sample data for backward compatibility with legacy widget system

-- Text Widgets
-- ============
INSERT INTO widgets (
    id,
    type,
    content,
    created_at
) VALUES 
(
    uuid_generate_v4(),
    'text',
    'Welcome to the Widget Feed application! This is a legacy text widget for backward compatibility.',
    NOW() - INTERVAL '8 hours'
),
(
    uuid_generate_v4(),
    'text',
    'PostgreSQL integration is now complete with full migration support and sample data.',
    NOW() - INTERVAL '4 hours'
),
(
    uuid_generate_v4(),
    'text',
    'This legacy widget system coexists with the new PRD-compliant widget descriptors.',
    NOW() - INTERVAL '2 hours'
);

-- Image Widgets
-- =============
INSERT INTO widgets (
    id,
    type,
    content,
    created_at
) VALUES 
(
    uuid_generate_v4(),
    'image',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop',
    NOW() - INTERVAL '7 hours'
),
(
    uuid_generate_v4(),
    'image',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
    NOW() - INTERVAL '5 hours'
);

-- Video Widgets
-- =============
INSERT INTO widgets (
    id,
    type,
    content,
    created_at
) VALUES 
(
    uuid_generate_v4(),
    'video',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    NOW() - INTERVAL '6 hours'
),
(
    uuid_generate_v4(),
    'video',
    'https://vimeo.com/123456789',
    NOW() - INTERVAL '3 hours'
);

-- Link Widgets
-- ============
INSERT INTO widgets (
    id,
    type,
    content,
    created_at
) VALUES 
(
    uuid_generate_v4(),
    'link',
    'https://github.com/jordi-adan/widget-feed-app',
    NOW() - INTERVAL '9 hours'
),
(
    uuid_generate_v4(),
    'link',
    'https://postgresql.org/docs/',
    NOW() - INTERVAL '1 hour'
);

-- Chart Widgets
-- =============
INSERT INTO widgets (
    id,
    type,
    content,
    created_at
) VALUES 
(
    uuid_generate_v4(),
    'chart',
    '{"type":"bar","data":{"labels":["Jan","Feb","Mar","Apr","May"],"datasets":[{"label":"Sales","data":[10,20,30,40,50]}]}}',
    NOW() - INTERVAL '5 hours'
),
(
    uuid_generate_v4(),
    'chart',
    '{"type":"line","data":{"labels":["Week 1","Week 2","Week 3","Week 4"],"datasets":[{"label":"Users","data":[100,150,200,250]}]}}',
    NOW() - INTERVAL '2 hours'
);

-- Mixed Content for Testing
-- =========================
INSERT INTO widgets (
    id,
    type,
    content,
    created_at
) VALUES 
(
    uuid_generate_v4(),
    'text',
    'Test widget for automated testing scenarios and validation.',
    NOW() - INTERVAL '30 minutes'
),
(
    uuid_generate_v4(),
    'image',
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop',
    NOW() - INTERVAL '15 minutes'
),
(
    uuid_generate_v4(),
    'link',
    'https://docs.docker.com/compose/',
    NOW() - INTERVAL '10 minutes'
);

-- Performance Testing Data
-- ========================
-- Insert additional widgets for performance testing
INSERT INTO widgets (type, content, created_at)
SELECT 
    'text',
    'Performance test widget #' || generate_series,
    NOW() - INTERVAL '1 minute' * generate_series
FROM generate_series(1, 20);

INSERT INTO widgets (type, content, created_at)
SELECT 
    'image',
    'https://picsum.photos/400/300?random=' || generate_series,
    NOW() - INTERVAL '30 seconds' * generate_series
FROM generate_series(1, 10);

-- Log successful data insertion
DO $$
DECLARE
    widget_count INTEGER;
    type_counts RECORD;
BEGIN
    SELECT COUNT(*) INTO widget_count FROM widgets;
    
    RAISE NOTICE 'Sample legacy widgets inserted successfully';
    RAISE NOTICE 'Total legacy widgets: %', widget_count;
    
    -- Show breakdown by type
    FOR type_counts IN 
        SELECT type, COUNT(*) as count 
        FROM widgets 
        GROUP BY type 
        ORDER BY type
    LOOP
        RAISE NOTICE 'Type %: % widgets', type_counts.type, type_counts.count;
    END LOOP;
END $$;
