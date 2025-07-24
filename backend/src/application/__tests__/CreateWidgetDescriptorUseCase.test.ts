import { CreateWidgetDescriptorUseCase } from '../CreateWidgetDescriptorUseCase';
import { WidgetDescriptorRepository } from '../../domain/repositories/WidgetDescriptorRepository';
import { WidgetDescriptor } from '../../domain/entities/WidgetDescriptor';
import { WidgetId } from '../../domain/entities/value-objects/WidgetId';
import { WidgetType } from '../../domain/entities/value-objects/WidgetType';
import { ContentType } from '../../domain/entities/value-objects/ContentType';
import { LoadingState } from '../../domain/entities/value-objects/LoadingState';
import { ErrorState } from '../../domain/entities/value-objects/ErrorState';

describe('CreateWidgetDescriptorUseCase', () => {
  let useCase: CreateWidgetDescriptorUseCase;
  let mockRepository: jest.Mocked<WidgetDescriptorRepository>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn()
    } as jest.Mocked<WidgetDescriptorRepository>;

    useCase = new CreateWidgetDescriptorUseCase(mockRepository);
  });

  describe('when creating a static widget descriptor', () => {
    it('should create and save a static widget descriptor successfully', async () => {
      // Arrange
      const request = {
        widgetType: 'text_block',
        contentType: 'static',
        staticContent: { text: 'Hello World', style: 'primary' }
      };

      const expectedDescriptor = WidgetDescriptor.createStatic({
        id: expect.any(WidgetId),
        widgetType: WidgetType.create('text_block'),
        contentType: ContentType.create('static'),
        staticContent: { text: 'Hello World', style: 'primary' }
      });

      mockRepository.save.mockResolvedValue(expectedDescriptor);

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.isSuccess()).toBe(true);
      expect(result.getValue()).toEqual(expectedDescriptor);
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          getWidgetType: expect.any(Function),
          getContentType: expect.any(Function),
          getStaticContent: expect.any(Function),
          isStatic: expect.any(Function)
        })
      );

      const savedDescriptor = mockRepository.save.mock.calls[0][0] as WidgetDescriptor;
      expect(savedDescriptor.getWidgetType().getValue()).toBe('text_block');
      expect(savedDescriptor.getContentType().getValue()).toBe('static');
      expect(savedDescriptor.getStaticContent()).toEqual({ text: 'Hello World', style: 'primary' });
      expect(savedDescriptor.isStatic()).toBe(true);
    });

    it('should fail when creating static widget with missing static content', async () => {
      // Arrange
      const request = {
        widgetType: 'text_block',
        contentType: 'static'
        // Missing staticContent
      };

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('Static content is required for static widgets');
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('when creating a dynamic widget descriptor', () => {
    it('should create and save a dynamic widget descriptor successfully', async () => {
      // Arrange
      const request = {
        widgetType: 'horizontal_cards',
        contentType: 'dynamic',
        dataUrl: 'https://api.example.com/cards',
        loadingState: 'skeleton',
        errorState: 'retry'
      };

      const expectedDescriptor = WidgetDescriptor.createDynamic({
        id: expect.any(WidgetId),
        widgetType: WidgetType.create('horizontal_cards'),
        contentType: ContentType.create('dynamic'),
        dataUrl: 'https://api.example.com/cards',
        loadingState: LoadingState.create('skeleton'),
        errorState: ErrorState.create('retry')
      });

      mockRepository.save.mockResolvedValue(expectedDescriptor);

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.isSuccess()).toBe(true);
      expect(result.getValue()).toEqual(expectedDescriptor);
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          getWidgetType: expect.any(Function),
          getContentType: expect.any(Function),
          getDataUrl: expect.any(Function),
          isDynamic: expect.any(Function)
        })
      );

      const savedDescriptor = mockRepository.save.mock.calls[0][0] as WidgetDescriptor;
      expect(savedDescriptor.getWidgetType().getValue()).toBe('horizontal_cards');
      expect(savedDescriptor.getContentType().getValue()).toBe('dynamic');
      expect(savedDescriptor.getDataUrl()).toBe('https://api.example.com/cards');
      expect(savedDescriptor.isDynamic()).toBe(true);
    });

    it('should fail when creating dynamic widget with missing data URL', async () => {
      // Arrange
      const request = {
        widgetType: 'horizontal_cards',
        contentType: 'dynamic',
        loadingState: 'skeleton',
        errorState: 'retry'
        // Missing dataUrl
      };

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('Data URL is required for dynamic widgets');
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should fail when creating dynamic widget with missing loading state', async () => {
      // Arrange
      const request = {
        widgetType: 'horizontal_cards',
        contentType: 'dynamic',
        dataUrl: 'https://api.example.com/cards',
        errorState: 'retry'
        // Missing loadingState
      };

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('Loading state is required for dynamic widgets');
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should fail when creating dynamic widget with missing error state', async () => {
      // Arrange
      const request = {
        widgetType: 'horizontal_cards',
        contentType: 'dynamic',
        dataUrl: 'https://api.example.com/cards',
        loadingState: 'skeleton'
        // Missing errorState
      };

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('Error state is required for dynamic widgets');
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('when validation fails', () => {
    it('should fail with invalid widget type', async () => {
      // Arrange
      const request = {
        widgetType: 'invalid_type',
        contentType: 'static',
        staticContent: { text: 'Hello' }
      };

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toContain('Invalid widget type');
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should fail with invalid content type', async () => {
      // Arrange
      const request = {
        widgetType: 'text_block',
        contentType: 'invalid_content_type',
        staticContent: { text: 'Hello' }
      };

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toContain('Invalid content type');
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('when repository fails', () => {
    it('should handle repository save failure', async () => {
      // Arrange
      const request = {
        widgetType: 'text_block',
        contentType: 'static',
        staticContent: { text: 'Hello World' }
      };

      mockRepository.save.mockRejectedValue(new Error('Database connection failed'));

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('Failed to save widget descriptor: Database connection failed');
    });
  });
});
