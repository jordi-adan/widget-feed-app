import { WidgetDescriptor } from '../../domain/entities/WidgetDescriptor';
import { IWidgetDescriptorRepository } from '../../domain/repositories/IWidgetDescriptorRepository';
import { DatabaseConnection } from '../database/DatabaseConnection';
import { WidgetId } from '../../domain/entities/value-objects/WidgetId';
import { WidgetType } from '../../domain/entities/value-objects/WidgetType';
import { ContentType } from '../../domain/entities/value-objects/ContentType';
import { LoadingState } from '../../domain/entities/value-objects/LoadingState';
import { ErrorState } from '../../domain/entities/value-objects/ErrorState';

interface WidgetDescriptorRow {
    id: string;
    widget_type: string;
    content_type: string;
    static_content: string | null;
    data_url: string | null;
    loading_state: string | null;
    error_state: string | null;
    created_at: Date;
    updated_at: Date;
}

export class PostgreSQLWidgetDescriptorRepository implements IWidgetDescriptorRepository {
    constructor(private connection: DatabaseConnection) {}

    async create(widgetDescriptor: WidgetDescriptor): Promise<void> {
        const query = `
            INSERT INTO widget_descriptors (
                id, widget_type, content_type, static_content, 
                data_url, loading_state, error_state, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `;

        const values = [
            widgetDescriptor.getId().getValue(),
            widgetDescriptor.getWidgetType().getValue(),
            widgetDescriptor.getContentType().getValue(),
            widgetDescriptor.getStaticContent() ? JSON.stringify(widgetDescriptor.getStaticContent()) : null,
            widgetDescriptor.getDataUrl() || null,
            widgetDescriptor.getLoadingState()?.getValue() || null,
            widgetDescriptor.getErrorState()?.getValue() || null,
            new Date(),
            new Date()
        ];

        await this.connection.query(query, values);
    }

    async findAll(): Promise<WidgetDescriptor[]> {
        const query = 'SELECT * FROM widget_descriptors ORDER BY created_at DESC';
        const result = await this.connection.query(query);
        
        return result.rows.map(row => this.mapRowToWidgetDescriptor(row as WidgetDescriptorRow));
    }

    async findById(id: string): Promise<WidgetDescriptor | undefined> {
        const query = 'SELECT * FROM widget_descriptors WHERE id = $1';
        const result = await this.connection.query(query, [id]);

        if (result.rows.length === 0) {
            return undefined;
        }

        return this.mapRowToWidgetDescriptor(result.rows[0] as WidgetDescriptorRow);
    }

    async update(widgetDescriptor: WidgetDescriptor): Promise<void> {
        const query = `
            UPDATE widget_descriptors SET 
                widget_type = $1, content_type = $2, static_content = $3,
                data_url = $4, loading_state = $5, error_state = $6, updated_at = $7
            WHERE id = $8
        `;

        const values = [
            widgetDescriptor.getWidgetType().getValue(),
            widgetDescriptor.getContentType().getValue(),
            widgetDescriptor.getStaticContent() ? JSON.stringify(widgetDescriptor.getStaticContent()) : null,
            widgetDescriptor.getDataUrl() || null,
            widgetDescriptor.getLoadingState()?.getValue() || null,
            widgetDescriptor.getErrorState()?.getValue() || null,
            new Date(),
            widgetDescriptor.getId().getValue()
        ];

        await this.connection.query(query, values);
    }

    async delete(id: string): Promise<void> {
        const query = 'DELETE FROM widget_descriptors WHERE id = $1';
        await this.connection.query(query, [id]);
    }

    private mapRowToWidgetDescriptor(row: WidgetDescriptorRow): WidgetDescriptor {
        const widgetType = WidgetType.create(row.widget_type);
        const contentType = ContentType.create(row.content_type);

        if (contentType.isStatic()) {
            const staticContent = row.static_content ? JSON.parse(row.static_content) : {};
            return WidgetDescriptor.createStatic({
                id: WidgetId.create(row.id),
                widgetType,
                contentType,
                staticContent
            });
        } else {
            const loadingState = row.loading_state ? LoadingState.create(row.loading_state) : LoadingState.create('skeleton');
            const errorState = row.error_state ? ErrorState.create(row.error_state) : ErrorState.create('hidden');

            return WidgetDescriptor.createDynamic({
                id: WidgetId.create(row.id),
                widgetType,
                contentType,
                dataUrl: row.data_url || '',
                loadingState,
                errorState
            });
        }
    }
}
