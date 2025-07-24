import request from 'supertest';
import express from 'express';
import { WidgetController } from '../widgetController';
import { CreateWidgetUseCase } from '../../application/CreateWidgetUseCase';
import { GetAllWidgetsUseCase } from '../../application/GetAllWidgetsUseCase';
import { UpdateWidgetContentUseCase } from '../../application/UpdateWidgetContentUseCase';
import { DeleteWidgetUseCase } from '../../application/DeleteWidgetUseCase';
import { InMemoryWidgetRepository } from '../../infrastructure/repositories/InMemoryWidgetRepository';

describe('WidgetController', () => {
  let app: express.Application;
  let repository: InMemoryWidgetRepository;
  let createWidgetUseCase: CreateWidgetUseCase;
  let getAllWidgetsUseCase: GetAllWidgetsUseCase;
  let updateWidgetContentUseCase: UpdateWidgetContentUseCase;
  let deleteWidgetUseCase: DeleteWidgetUseCase;
  let widgetController: WidgetController;

  beforeEach(() => {
    repository = new InMemoryWidgetRepository();
    createWidgetUseCase = new CreateWidgetUseCase(repository);
    getAllWidgetsUseCase = new GetAllWidgetsUseCase(repository);
    updateWidgetContentUseCase = new UpdateWidgetContentUseCase(repository);
    deleteWidgetUseCase = new DeleteWidgetUseCase(repository);
    widgetController = new WidgetController(
      createWidgetUseCase, 
      getAllWidgetsUseCase,
      updateWidgetContentUseCase,
      deleteWidgetUseCase
    );

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

  describe('PUT /api/widgets/:id', () => {
    it('should update widget content successfully', async () => {
      // Arrange - Create a widget first
      const createResponse = await request(app)
        .post('/api/widgets')
        .send({ type: 'text', content: 'Original content' });
      
      const widgetId = createResponse.body.widget.id;
      const updateData = { content: 'Updated content' };

      // Act
      const response = await request(app)
        .put(`/api/widgets/${widgetId}`)
        .send(updateData);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.widget.content).toBe('Updated content');
      expect(response.body.widget.id).toBe(widgetId);
    });

    it('should return 404 when widget does not exist', async () => {
      // Arrange
      const nonExistentId = '550e8400-e29b-41d4-a716-446655440000';
      const updateData = { content: 'Updated content' };

      // Act
      const response = await request(app)
        .put(`/api/widgets/${nonExistentId}`)
        .send(updateData);

      // Assert
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Widget not found');
    });

    it('should return 400 for invalid widget ID', async () => {
      // Arrange
      const invalidId = 'invalid-id';
      const updateData = { content: 'Updated content' };

      // Act
      const response = await request(app)
        .put(`/api/widgets/${invalidId}`)
        .send(updateData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('must be a valid UUID');
    });

    it('should return 400 for missing content', async () => {
      // Arrange
      const createResponse = await request(app)
        .post('/api/widgets')
        .send({ type: 'text', content: 'Original content' });
      
      const widgetId = createResponse.body.widget.id;

      // Act
      const response = await request(app)
        .put(`/api/widgets/${widgetId}`)
        .send({}); // Missing content

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Content is required');
    });

    it('should return 400 for invalid content', async () => {
      // Arrange
      const createResponse = await request(app)
        .post('/api/widgets')
        .send({ type: 'text', content: 'Original content' });
      
      const widgetId = createResponse.body.widget.id;
      const updateData = { content: 'a'.repeat(10001) }; // Too long

      // Act
      const response = await request(app)
        .put(`/api/widgets/${widgetId}`)
        .send(updateData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('cannot exceed 10000 characters');
    });
  });
});
