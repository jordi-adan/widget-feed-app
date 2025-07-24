import { WidgetDescriptorRepository } from '../domain/repositories/WidgetDescriptorRepository';
import { WidgetDescriptor } from '../domain/entities/WidgetDescriptor';
import { WidgetId } from '../domain/entities/value-objects/WidgetId';
import { WidgetType } from '../domain/entities/value-objects/WidgetType';
import { ContentType } from '../domain/entities/value-objects/ContentType';
import { LoadingState } from '../domain/entities/value-objects/LoadingState';
import { ErrorState } from '../domain/entities/value-objects/ErrorState';
import { Result } from './common/Result';
import { v4 as uuidv4 } from 'uuid';

interface CreateWidgetDescriptorRequest {
  widgetType: string;
  contentType: string;
  staticContent?: Record<string, any>;
  dataUrl?: string;
  loadingState?: string;
  errorState?: string;
}

export class CreateWidgetDescriptorUseCase {
  constructor(private readonly repository: WidgetDescriptorRepository) {}

  public async execute(request: CreateWidgetDescriptorRequest): Promise<Result<WidgetDescriptor>> {
    try {
      // Validate widget type
      let widgetType: WidgetType;
      try {
        widgetType = WidgetType.create(request.widgetType);
      } catch (error) {
        return Result.fail(`Invalid widget type: ${(error as Error).message}`);
      }

      // Validate content type
      let contentType: ContentType;
      try {
        contentType = ContentType.create(request.contentType);
      } catch (error) {
        return Result.fail(`Invalid content type: ${(error as Error).message}`);
      }

      // Generate new ID
      const id = WidgetId.create(uuidv4());

      // Create appropriate descriptor based on content type
      let descriptor: WidgetDescriptor;

      if (contentType.isStatic()) {
        // Validate static requirements
        if (!request.staticContent) {
          return Result.fail('Static content is required for static widgets');
        }

        descriptor = WidgetDescriptor.createStatic({
          id,
          widgetType,
          contentType,
          staticContent: request.staticContent
        });
      } else {
        // Validate dynamic requirements
        if (!request.dataUrl) {
          return Result.fail('Data URL is required for dynamic widgets');
        }

        if (!request.loadingState) {
          return Result.fail('Loading state is required for dynamic widgets');
        }

        if (!request.errorState) {
          return Result.fail('Error state is required for dynamic widgets');
        }

        let loadingState: LoadingState;
        let errorState: ErrorState;

        try {
          loadingState = LoadingState.create(request.loadingState);
        } catch (error) {
          return Result.fail(`Invalid loading state: ${(error as Error).message}`);
        }

        try {
          errorState = ErrorState.create(request.errorState);
        } catch (error) {
          return Result.fail(`Invalid error state: ${(error as Error).message}`);
        }

        descriptor = WidgetDescriptor.createDynamic({
          id,
          widgetType,
          contentType,
          dataUrl: request.dataUrl,
          loadingState,
          errorState
        });
      }

      // Save to repository
      const savedDescriptor = await this.repository.save(descriptor);
      return Result.ok(savedDescriptor);

    } catch (error) {
      return Result.fail(`Failed to save widget descriptor: ${(error as Error).message}`);
    }
  }
}
