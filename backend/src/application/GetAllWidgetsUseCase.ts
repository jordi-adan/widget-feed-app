import { WidgetRepository } from '../domain/repositories/WidgetRepository';
import { Widget } from '../models/widget';

export interface GetAllWidgetsResponse {
  success: boolean;
  widgets?: Widget[];
  error?: string;
}

export class GetAllWidgetsUseCase {
  constructor(private readonly widgetRepository: WidgetRepository) {}

  async execute(): Promise<GetAllWidgetsResponse> {
    try {
      const widgets = await this.widgetRepository.findAll();

      return {
        success: true,
        widgets
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}
