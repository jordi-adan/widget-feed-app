import request from 'supertest';
import express from 'express';
import { WidgetController } from '../widgetController';
import { CreateWidgetUseCase } from '../../application/CreateWidgetUseCase';
import { GetAllWidgetsUseCase } from '../../application/GetAllWidgetsUseCase';
import { InMemoryWidgetRepository } from '../../infrastructure/repositories/InMemoryWidgetRepository';

describe('WidgetController', () => {
  let app: express.Application;
  let repository: InMemoryWidgetRepository;
  let createWidgetUseCase: CreateWidgetUseCase;
  let getAllWidgetsUseCase: GetAllWidgetsUseCase;
  let widgetController: WidgetController;

  beforeEach(() => {
    repository = new InMemoryWidgetRepository();
    createWidgetUseCase = new CreateWidgetUseCase(repository);
    getAllWidgetsUseCase = new GetAllWidgetsUseCase(repository);
    widgetController = new WidgetController(createWidgetUseCase, getAllWidgetsUseCase);

    app = express();
    app.use(express.json());
    app.use('/api/widgets', widgetController.getRouter());
  });

  describe('POST /api/widgets', () => {
    it('should create a new widget successfully', async () => {
      // Arrange
      const widgetData = {
        type: 'text',
        content: 'Hello World'
      };

      // Act
      const response = await request(app)
        .post('/api/widgets')
        .send(widgetData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.widget.type).toBe('text');
      expect(response.body.widget.content).toBe('Hello World');
      expect(response.body.widget.id).toBeDefined();
      expect(response.body.widget.timestamp).toBeDefined();
    });

    it('should return 400 for invalid widget type', async () => {
      // Arrange
      const widgetData = {
        type: 'invalid_type',
        content: 'Hello World'
      };

      // Act
      const response = await request(app)
        .post('/api/widgets')
        .send(widgetData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid widget type');
    });

    it('should return 400 for missing required fields', async () => {
      // Arrange
      const widgetData = {
        type: 'text'
        // missing content
      };

      // Act
      const response = await request(app)
        .post('/api/widgets')
        .send(widgetData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('required');
    });
  });

  describe('GET /api/widgets', () => {
    it('should return all widgets', async () => {
      // Arrange
      await request(app)
        .post('/api/widgets')
        .send({ type: 'text', content: 'First widget' });
      await request(app)
        .post('/api/widgets')
        .send({ type: 'image', content: 'Second widget' });

      // Act
      const response = await request(app)
        .get('/api/widgets');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.widgets).toHaveLength(2);
    });

    it('should return empty array when no widgets exist', async () => {
      // Act
      const response = await request(app)
        .get('/api/widgets');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.widgets).toHaveLength(0);
    });
  });
});
