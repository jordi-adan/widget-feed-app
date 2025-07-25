import { PostgreSQLWidgetDescriptorRepository } from '../PostgreSQLWidgetDescriptorRepository';
import { DatabaseConnection } from '../../database/DatabaseConnection';
import { WidgetDescriptor } from '../../../domain/entities/WidgetDescriptor';
import { WidgetId } from '../../../domain/entities/value-objects/WidgetId';
import { WidgetType } from '../../../domain/entities/value-objects/WidgetType';
import { ContentType } from '../../../domain/entities/value-objects/ContentType';
import { LoadingState } from '../../../domain/entities/value-objects/LoadingState';
import { ErrorState } from '../../../domain/entities/value-objects/ErrorState';

describe('PostgreSQLWidgetDescriptorRepository', () => {
    let repository: PostgreSQLWidgetDescriptorRepository;
    let mockConnection: jest.Mocked<DatabaseConnection>;

    beforeEach(() => {
        mockConnection = {
            query: jest.fn(),
            getClient: jest.fn(),
            close: jest.fn(),
            getStats: jest.fn(),
        } as any;

        repository = new PostgreSQLWidgetDescriptorRepository(mockConnection);
    });

    describe('create', () => {
        it('should insert a static widget descriptor', async () => {
            const staticContent = { title: 'Test Title', content: 'Test content' };
            const widgetDescriptor = WidgetDescriptor.createStatic({
                id: WidgetId.generate(),
                widgetType: WidgetType.create('text'),
                contentType: ContentType.create('static'),
                staticContent
            });

            mockConnection.query.mockResolvedValue({ rows: [], rowCount: 1 } as any);

            await repository.create(widgetDescriptor);

            expect(mockConnection.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO widget_descriptors'),
                expect.arrayContaining([
                    widgetDescriptor.getId().getValue(),
                    'text',
                    'static',
                    JSON.stringify(staticContent),
                    null,
                    null,
                    null,
                    expect.any(Date),
                    expect.any(Date)
                ])
            );
        });

        it('should insert a dynamic widget descriptor', async () => {
            const widgetDescriptor = WidgetDescriptor.createDynamic({
                id: WidgetId.generate(),
                widgetType: WidgetType.create('expandable_list'),
                contentType: ContentType.create('dynamic'),
                dataUrl: 'https://api.example.com/data',
                loadingState: LoadingState.create('skeleton'),
                errorState: ErrorState.create('retry')
            });

            mockConnection.query.mockResolvedValue({ rows: [], rowCount: 1 } as any);

            await repository.create(widgetDescriptor);

            expect(mockConnection.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO widget_descriptors'),
                expect.arrayContaining([
                    widgetDescriptor.getId().getValue(),
                    'expandable_list',
                    'dynamic',
                    null,
                    'https://api.example.com/data',
                    'skeleton',
                    'retry',
                    expect.any(Date),
                    expect.any(Date)
                ])
            );
        });

        it('should handle database insertion errors', async () => {
            const widgetDescriptor = WidgetDescriptor.createStatic({
                id: WidgetId.generate(),
                widgetType: WidgetType.create('text'),
                contentType: ContentType.create('static'),
                staticContent: { title: 'Test' }
            });

            const dbError = new Error('Database insertion failed');
            mockConnection.query.mockRejectedValue(dbError);

            await expect(repository.create(widgetDescriptor)).rejects.toThrow('Database insertion failed');
        });
    });

    describe('findAll', () => {
        it('should return all widget descriptors', async () => {
            const mockRows = [
                {
                    id: '123e4567-e89b-42d3-a456-426614174000',
                    widget_type: 'text',
                    content_type: 'static',
                    static_content: JSON.stringify({ title: 'Static Widget', content: 'Test content' }),
                    data_url: null,
                    loading_state: null,
                    error_state: null,
                    created_at: new Date(),
                    updated_at: new Date()
                },
                {
                    id: '987e6543-e21b-43d2-8765-532413279000',
                    widget_type: 'expandable_list',
                    content_type: 'dynamic',
                    static_content: null,
                    data_url: 'https://api.example.com/data',
                    loading_state: 'skeleton',
                    error_state: 'retry',
                    created_at: new Date(),
                    updated_at: new Date()
                }
            ];

            mockConnection.query.mockResolvedValue({ rows: mockRows, rowCount: 2 } as any);

            const result = await repository.findAll();

            expect(result).toHaveLength(2);
            expect(result[0].getWidgetType().getValue()).toBe('text');
            expect(result[0].getContentType().getValue()).toBe('static');
            expect(result[1].getWidgetType().getValue()).toBe('expandable_list');
            expect(result[1].getContentType().getValue()).toBe('dynamic');
            
            expect(mockConnection.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT * FROM widget_descriptors ORDER BY created_at DESC')
            );
        });

        it('should return empty array when no descriptors found', async () => {
            mockConnection.query.mockResolvedValue({ rows: [], rowCount: 0 } as any);

            const result = await repository.findAll();

            expect(result).toEqual([]);
        });

        it('should handle database query errors', async () => {
            const dbError = new Error('Database query failed');
            mockConnection.query.mockRejectedValue(dbError);

            await expect(repository.findAll()).rejects.toThrow('Database query failed');
        });
    });

    describe('findById', () => {
        it('should return widget descriptor when found', async () => {
            const id = '123e4567-e89b-42d3-a456-426614174000';
            const mockRow = {
                id,
                widget_type: 'text',
                content_type: 'static',
                static_content: JSON.stringify({ title: 'Test', content: 'Content' }),
                data_url: null,
                loading_state: null,
                error_state: null,
                created_at: new Date(),
                updated_at: new Date()
            };

            mockConnection.query.mockResolvedValue({ rows: [mockRow], rowCount: 1 } as any);

            const result = await repository.findById(id);

            expect(result).toBeDefined();
            expect(result!.getId().getValue()).toBe(id);
            expect(result!.getWidgetType().getValue()).toBe('text');
            
            expect(mockConnection.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT * FROM widget_descriptors WHERE id = $1'),
                [id]
            );
        });

        it('should return undefined when widget descriptor not found', async () => {
            const id = '123e4567-e89b-42d3-a456-426614174000';
            mockConnection.query.mockResolvedValue({ rows: [], rowCount: 0 } as any);

            const result = await repository.findById(id);

            expect(result).toBeUndefined();
        });

        it('should handle database query errors', async () => {
            const id = '123e4567-e89b-42d3-a456-426614174000';
            const dbError = new Error('Database query failed');
            mockConnection.query.mockRejectedValue(dbError);

            await expect(repository.findById(id)).rejects.toThrow('Database query failed');
        });
    });

    describe('update', () => {
        it('should update a widget descriptor', async () => {
            const id = WidgetId.create('123e4567-e89b-42d3-a456-426614174000');
            const widgetDescriptor = WidgetDescriptor.createStatic({
                id,
                widgetType: WidgetType.create('text'),
                contentType: ContentType.create('static'),
                staticContent: { title: 'Updated Title', content: 'Updated content' }
            });

            mockConnection.query.mockResolvedValue({ rows: [], rowCount: 1 } as any);

            await repository.update(widgetDescriptor);

            expect(mockConnection.query).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE widget_descriptors SET'),
                expect.arrayContaining([
                    'text',
                    'static',
                    JSON.stringify({ title: 'Updated Title', content: 'Updated content' }),
                    null,
                    null,
                    null,
                    expect.any(Date),
                    '123e4567-e89b-42d3-a456-426614174000'
                ])
            );
        });

        it('should handle database update errors', async () => {
            const id = WidgetId.create('123e4567-e89b-42d3-a456-426614174000');
            const widgetDescriptor = WidgetDescriptor.createStatic({
                id,
                widgetType: WidgetType.create('text'),
                contentType: ContentType.create('static'),
                staticContent: { title: 'Test' }
            });

            const dbError = new Error('Database update failed');
            mockConnection.query.mockRejectedValue(dbError);

            await expect(repository.update(widgetDescriptor)).rejects.toThrow('Database update failed');
        });
    });

    describe('delete', () => {
        it('should delete a widget descriptor by id', async () => {
            const id = '123e4567-e89b-42d3-a456-426614174000';
            mockConnection.query.mockResolvedValue({ rows: [], rowCount: 1 } as any);

            await repository.delete(id);

            expect(mockConnection.query).toHaveBeenCalledWith(
                expect.stringContaining('DELETE FROM widget_descriptors WHERE id = $1'),
                [id]
            );
        });

        it('should handle database deletion errors', async () => {
            const id = '123e4567-e89b-42d3-a456-426614174000';
            const dbError = new Error('Database deletion failed');
            mockConnection.query.mockRejectedValue(dbError);

            await expect(repository.delete(id)).rejects.toThrow('Database deletion failed');
        });
    });
});
