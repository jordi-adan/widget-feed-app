import request from 'supertest';
import express from 'express';
import { WidgetDescriptorController } from '../WidgetDescriptorController';
import { CreateWidgetDescriptorUseCase } from '../../application/CreateWidgetDescriptorUseCase';
import { GetAllWidgetDescriptorsUseCase } from '../../application/GetAllWidgetDescriptorsUseCase';
import { InMemoryWidgetDescriptorRepository } from '../../infrastructure/repositories/InMemoryWidgetDescriptorRepository';

describe('WidgetDescriptorController', () => {
  let app: express.Application;
  let repository: InMemoryWidgetDescriptorRepository;
  let createWidgetDescriptorUseCase: CreateWidgetDescriptorUseCase;
  let getAllWidgetDescriptorsUseCase: GetAllWidgetDescriptorsUseCase;
  let widgetDescriptorController: WidgetDescriptorController;

  beforeEach(() => {
    repository = new InMemoryWidgetDescriptorRepository();
    createWidgetDescriptorUseCase = new CreateWidgetDescriptorUseCase(repository);
    getAllWidgetDescriptorsUseCase = new GetAllWidgetDescriptorsUseCase(repository);
    widgetDescriptorController = new WidgetDescriptorController(
      createWidgetDescriptorUseCase,
      getAllWidgetDescriptorsUseCase
    );

    app = express();
    app.use(express.json());
    app.use('/api/widgets', widgetDescriptorController.getRouter());
  });

  describe('GET /api/widgets', () => {
    it('should return all widget descriptors with proper structure', async () => {
      // Arrange - Create some widget descriptors first
      const createResponse1 = await request(app)
        .post('/api/widgets')
        .send({
          widgetType: 'expandable_list',
          contentType: 'dynamic',
          dataUrl: 'https://api.tasks.com/list',
          loadingState: 'skeleton',
          errorState: 'retry'
        });

      const createResponse2 = await request(app)
        .post('/api/widgets')
        .send({
          widgetType: 'text_block',
          contentType: 'static',
          staticContent: { text: 'Welcome to our app!', style: 'primary' }
        });

      expect(createResponse1.status).toBe(201);
      expect(createResponse2.status).toBe(201);

      // Act
      const response = await request(app)
        .get('/api/widgets')
        .expect(200);

      // Assert
      expect(response.body).toHaveProperty('widgets');
      expect(Array.isArray(response.body.widgets)).toBe(true);
      expect(response.body.widgets).toHaveLength(2);

      // Check first widget (expandable_list - dynamic)
      const firstWidget = response.body.widgets[0];
      expect(firstWidget).toHaveProperty('id');
      expect(firstWidget.type).toBe('dynamic');
      expect(firstWidget.widgetType).toBe('expandable_list');
      expect(firstWidget.config).toEqual({
        dataUrl: 'https://api.tasks.com/list',
        loadingState: 'skeleton',
        errorState: 'retry'
      });

      // Check second widget (text_block - static)
      const secondWidget = response.body.widgets[1];
      expect(secondWidget).toHaveProperty('id');
      expect(secondWidget.type).toBe('static');
      expect(secondWidget.widgetType).toBe('text_block');
      expect(secondWidget.config).toEqual({
        staticContent: { text: 'Welcome to our app!', style: 'primary' }
      });
    });

    it('should return empty array when no widget descriptors exist', async () => {
      // Act
      const response = await request(app)
        .get('/api/widgets')
        .expect(200);

      // Assert
      expect(response.body).toEqual({ widgets: [] });
    });

    it('should return all 6 widget types correctly', async () => {
      // Arrange - Create one of each widget type
      const widgetTypes = [
        { type: 'expandable_list', config: { dataUrl: 'https://api.lists.com', loadingState: 'skeleton', errorState: 'hidden' } },
        { type: 'horizontal_cards', config: { dataUrl: 'https://api.cards.com', loadingState: 'skeleton', errorState: 'retry' } },
        { type: 'image_list', config: { staticContent: { images: ['img1.jpg', 'img2.jpg'] } } },
        { type: 'text_block', config: { staticContent: { text: 'Sample text block' } } },
        { type: 'highlight_banner', config: { dataUrl: 'https://api.banners.com', loadingState: 'hidden', errorState: 'message' } },
        { type: 'quick_actions', config: { staticContent: { actions: ['calendar', 'settings', 'profile'] } } }
      ];

      for (const widget of widgetTypes) {
        const payload = {
          widgetType: widget.type,
          contentType: widget.config.dataUrl ? 'dynamic' : 'static',
          ...(widget.config.dataUrl 
            ? { dataUrl: widget.config.dataUrl, loadingState: widget.config.loadingState, errorState: widget.config.errorState }
            : { staticContent: widget.config.staticContent })
        };

        const response = await request(app)
          .post('/api/widgets')
          .send(payload);
        
        expect(response.status).toBe(201);
      }

      // Act
      const response = await request(app)
        .get('/api/widgets')
        .expect(200);

      // Assert
      expect(response.body.widgets).toHaveLength(6);
      const returnedTypes = response.body.widgets.map((w: any) => w.widgetType);
      widgetTypes.forEach(({ type }) => {
        expect(returnedTypes).toContain(type);
      });
    });

    it('should handle repository errors gracefully', async () => {
      // Arrange - Mock repository to throw error
      const errorRepository = {
        findAll: jest.fn().mockRejectedValue(new Error('Database connection failed'))
      } as any;
      const errorUseCase = new GetAllWidgetDescriptorsUseCase(errorRepository);
      const errorController = new WidgetDescriptorController(
        createWidgetDescriptorUseCase,
        errorUseCase
      );

      const errorApp = express();
      errorApp.use(express.json());
      errorApp.use('/api/widgets', errorController.getRouter());

      // Act & Assert
      const response = await request(errorApp)
        .get('/api/widgets')
        .expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Failed to retrieve widget descriptors');
    });
  });

  describe('POST /api/widgets', () => {
    it('should create a dynamic widget descriptor successfully', async () => {
      // Act
      const response = await request(app)
        .post('/api/widgets')
        .send({
          widgetType: 'horizontal_cards',
          contentType: 'dynamic',
          dataUrl: 'https://api.products.com/featured',
          loadingState: 'skeleton',
          errorState: 'retry'
        })
        .expect(201);

      // Assert
      expect(response.body).toHaveProperty('id');
      expect(response.body.type).toBe('dynamic');
      expect(response.body.widgetType).toBe('horizontal_cards');
      expect(response.body.config).toEqual({
        dataUrl: 'https://api.products.com/featured',
        loadingState: 'skeleton',
        errorState: 'retry'
      });
    });

    it('should create a static widget descriptor successfully', async () => {
      // Act
      const response = await request(app)
        .post('/api/widgets')
        .send({
          widgetType: 'text_block',
          contentType: 'static',
          staticContent: { 
            text: 'Welcome to our application!', 
            style: 'primary',
            markdown: true 
          }
        })
        .expect(201);

      // Assert
      expect(response.body).toHaveProperty('id');
      expect(response.body.type).toBe('static');
      expect(response.body.widgetType).toBe('text_block');
      expect(response.body.config).toEqual({
        staticContent: { 
          text: 'Welcome to our application!', 
          style: 'primary',
          markdown: true 
        }
      });
    });

    it('should return 400 for invalid widget type', async () => {
      // Act & Assert
      const response = await request(app)
        .post('/api/widgets')
        .send({
          widgetType: 'invalid_type',
          contentType: 'static',
          staticContent: { text: 'test' }
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid widget type');
    });

    it('should return 400 for missing required fields', async () => {
      // Act & Assert
      const response = await request(app)
        .post('/api/widgets')
        .send({
          widgetType: 'text_block'
          // Missing contentType
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for dynamic widget missing dataUrl', async () => {
      // Act & Assert
      const response = await request(app)
        .post('/api/widgets')
        .send({
          widgetType: 'expandable_list',
          contentType: 'dynamic',
          loadingState: 'skeleton',
          errorState: 'retry'
          // Missing dataUrl
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for static widget missing staticContent', async () => {
      // Act & Assert
      const response = await request(app)
        .post('/api/widgets')
        .send({
          widgetType: 'text_block',
          contentType: 'static'
          // Missing staticContent
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });
});
