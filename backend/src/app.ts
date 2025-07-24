import express from 'express';
import cors from 'cors';
import { WidgetController } from './controllers/widgetController';
import { CreateWidgetUseCase } from './application/CreateWidgetUseCase';
import { GetAllWidgetsUseCase } from './application/GetAllWidgetsUseCase';
import { UpdateWidgetContentUseCase } from './application/UpdateWidgetContentUseCase';
import { DeleteWidgetUseCase } from './application/DeleteWidgetUseCase';
import { InMemoryWidgetRepository } from './infrastructure/repositories/InMemoryWidgetRepository';

// Dependency Injection Container (following Hexagonal Architecture)
class ApplicationContainer {
  private static instance: ApplicationContainer;
  private widgetRepository: InMemoryWidgetRepository;
  private createWidgetUseCase: CreateWidgetUseCase;
  private getAllWidgetsUseCase: GetAllWidgetsUseCase;
  private updateWidgetContentUseCase: UpdateWidgetContentUseCase;
  private deleteWidgetUseCase: DeleteWidgetUseCase;
  private widgetController: WidgetController;

  private constructor() {
    // Infrastructure layer
    this.widgetRepository = new InMemoryWidgetRepository();
    
    // Application layer
    this.createWidgetUseCase = new CreateWidgetUseCase(this.widgetRepository);
    this.getAllWidgetsUseCase = new GetAllWidgetsUseCase(this.widgetRepository);
    this.updateWidgetContentUseCase = new UpdateWidgetContentUseCase(this.widgetRepository);
    this.deleteWidgetUseCase = new DeleteWidgetUseCase(this.widgetRepository);
    
    // Interface adapters layer
    this.widgetController = new WidgetController(
      this.createWidgetUseCase,
      this.getAllWidgetsUseCase,
      this.updateWidgetContentUseCase,
      this.deleteWidgetUseCase
    );
  }

  public static getInstance(): ApplicationContainer {
    if (!ApplicationContainer.instance) {
      ApplicationContainer.instance = new ApplicationContainer();
    }
    return ApplicationContainer.instance;
  }

  public getWidgetController(): WidgetController {
    return this.widgetController;
  }
}

// Express Application Setup
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
const container = ApplicationContainer.getInstance();
app.use('/api/widgets', container.getWidgetController().getRouter());

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Widget Feed API Server is running on http://localhost:${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
  console.log(`🔗 API endpoints available at http://localhost:${PORT}/api/widgets`);
});

export default app;