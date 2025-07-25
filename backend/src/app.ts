import express from 'express';
import cors from 'cors';
import { WidgetController } from './controllers/widgetController';
import { WidgetDescriptorController } from './controllers/WidgetDescriptorController';
import { CreateWidgetUseCase } from './application/CreateWidgetUseCase';
import { GetAllWidgetsUseCase } from './application/GetAllWidgetsUseCase';
import { GetSortedWidgetsUseCase } from './application/GetSortedWidgetsUseCase';
import { UpdateWidgetContentUseCase } from './application/UpdateWidgetContentUseCase';
import { DeleteWidgetUseCase } from './application/DeleteWidgetUseCase';
import { CreateWidgetDescriptorUseCase } from './application/CreateWidgetDescriptorUseCase';
import { GetAllWidgetDescriptorsUseCase } from './application/GetAllWidgetDescriptorsUseCase';
import { InMemoryWidgetRepository } from './infrastructure/repositories/InMemoryWidgetRepository';
import { InMemoryWidgetDescriptorRepository } from './infrastructure/repositories/InMemoryWidgetDescriptorRepository';
import { DummyDataService } from './infrastructure/services/DummyDataService';

// Dependency Injection Container (following Hexagonal Architecture)
class ApplicationContainer {
  private static instance: ApplicationContainer;
  private widgetRepository: InMemoryWidgetRepository;
  private widgetDescriptorRepository: InMemoryWidgetDescriptorRepository;
  private dummyDataService: DummyDataService;
  private createWidgetUseCase: CreateWidgetUseCase;
  private getAllWidgetsUseCase: GetAllWidgetsUseCase;
  private getSortedWidgetsUseCase: GetSortedWidgetsUseCase;
  private updateWidgetContentUseCase: UpdateWidgetContentUseCase;
  private deleteWidgetUseCase: DeleteWidgetUseCase;
  private createWidgetDescriptorUseCase: CreateWidgetDescriptorUseCase;
  private getAllWidgetDescriptorsUseCase: GetAllWidgetDescriptorsUseCase;
  private widgetController: WidgetController;
  private widgetDescriptorController: WidgetDescriptorController;

  private constructor() {
    // Infrastructure layer
    this.widgetRepository = new InMemoryWidgetRepository();
    this.widgetDescriptorRepository = new InMemoryWidgetDescriptorRepository();
    this.dummyDataService = new DummyDataService(this.widgetRepository, this.widgetDescriptorRepository);
    
    // Application layer - Widget use cases
    this.createWidgetUseCase = new CreateWidgetUseCase(this.widgetRepository);
    this.getAllWidgetsUseCase = new GetAllWidgetsUseCase(this.widgetRepository);
    this.getSortedWidgetsUseCase = new GetSortedWidgetsUseCase(this.widgetRepository);
    this.updateWidgetContentUseCase = new UpdateWidgetContentUseCase(this.widgetRepository);
    this.deleteWidgetUseCase = new DeleteWidgetUseCase(this.widgetRepository);
    
    // Application layer - WidgetDescriptor use cases (PRD-compliant)
    this.createWidgetDescriptorUseCase = new CreateWidgetDescriptorUseCase(this.widgetDescriptorRepository);
    this.getAllWidgetDescriptorsUseCase = new GetAllWidgetDescriptorsUseCase(this.widgetDescriptorRepository);
    
    // Interface adapters layer
    this.widgetController = new WidgetController(
      this.createWidgetUseCase,
      this.getAllWidgetsUseCase,
      this.getSortedWidgetsUseCase,
      this.updateWidgetContentUseCase,
      this.deleteWidgetUseCase
    );
    
    this.widgetDescriptorController = new WidgetDescriptorController(
      this.createWidgetDescriptorUseCase,
      this.getAllWidgetDescriptorsUseCase
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

  public getWidgetDescriptorController(): WidgetDescriptorController {
    return this.widgetDescriptorController;
  }

  public getDummyDataService(): DummyDataService {
    return this.dummyDataService;
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

// PRD-compliant routes - Widget Descriptors (main API for frontend)
app.use('/widgets', container.getWidgetDescriptorController().getRouter());

// Legacy routes - Internal Widget management 
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

// Parse command line arguments
const args = process.argv.slice(2);
const shouldLoadDummyData = args.includes('--dummy-data') || args.includes('-d');

// Start server
const startServer = async () => {
  try {
    // Load dummy data if flag is provided
    if (shouldLoadDummyData) {
      console.log('🎭 Dummy data flag detected, loading sample data...');
      const container = ApplicationContainer.getInstance();
      await container.getDummyDataService().loadDummyData();
    }

    app.listen(PORT, () => {
      console.log(`🚀 Widget Feed API Server is running on http://localhost:${PORT}`);
      console.log(`📊 Health check available at http://localhost:${PORT}/health`);
      console.log(`🎯 PRD Widget API at http://localhost:${PORT}/widgets`);
      console.log(`🔗 Legacy Widget API at http://localhost:${PORT}/api/widgets`);
      
      if (shouldLoadDummyData) {
        console.log(`🎭 Server started with dummy data loaded`);
      } else {
        console.log(`💡 Tip: Use --dummy-data or -d flag to load sample data`);
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;