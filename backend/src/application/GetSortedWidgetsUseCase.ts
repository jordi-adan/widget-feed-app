import { WidgetRepository } from '../domain/repositories/WidgetRepository';
import { Widget } from '../models/widget';

export type SortField = 'timestamp' | 'type';
export type SortOrder = 'asc' | 'desc';

export interface GetSortedWidgetsRequest {
  sortBy?: string;
  sortOrder?: string;
}

export interface GetSortedWidgetsResponse {
  success: boolean;
  widgets?: Widget[];
  error?: string;
}

export class GetSortedWidgetsUseCase {
  private readonly VALID_SORT_FIELDS: SortField[] = ['timestamp', 'type'];
  private readonly VALID_SORT_ORDERS: SortOrder[] = ['asc', 'desc'];

  constructor(private readonly widgetRepository: WidgetRepository) {}

  async execute(request: GetSortedWidgetsRequest): Promise<GetSortedWidgetsResponse> {
    try {
      // Validate request parameters
      const validationError = this.validateRequest(request);
      if (validationError) {
        return {
          success: false,
          error: validationError
        };
      }

      // Set defaults (we know they're valid after validation)
      const sortBy = (request.sortBy as SortField) || 'timestamp';
      const sortOrder = (request.sortOrder as SortOrder) || 'desc';

      // Get all widgets from repository
      const widgets = await this.widgetRepository.findAll();

      // Sort the widgets
      const sortedWidgets = this.sortWidgets(widgets, sortBy, sortOrder);

      return {
        success: true,
        widgets: sortedWidgets
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private validateRequest(request: GetSortedWidgetsRequest): string | null {
    if (request.sortBy && !this.VALID_SORT_FIELDS.includes(request.sortBy as SortField)) {
      return `Invalid sort field: ${request.sortBy}. Valid fields are: ${this.VALID_SORT_FIELDS.join(', ')}`;
    }

    if (request.sortOrder && !this.VALID_SORT_ORDERS.includes(request.sortOrder as SortOrder)) {
      return `Invalid sort order: ${request.sortOrder}. Valid orders are: ${this.VALID_SORT_ORDERS.join(', ')}`;
    }

    return null;
  }

  private sortWidgets(widgets: Widget[], sortBy: SortField, sortOrder: SortOrder): Widget[] {
    return widgets.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'timestamp':
          comparison = a.getTimestamp().getTime() - b.getTimestamp().getTime();
          break;
        case 'type':
          comparison = a.getType().getValue().localeCompare(b.getType().getValue());
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }
}
