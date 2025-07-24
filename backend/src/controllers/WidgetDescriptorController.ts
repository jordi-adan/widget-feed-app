import { Request, Response, Router } from 'express';
import { CreateWidgetDescriptorUseCase } from '../application/CreateWidgetDescriptorUseCase';
import { GetAllWidgetDescriptorsUseCase } from '../application/GetAllWidgetDescriptorsUseCase';

export class WidgetDescriptorController {
  private router: Router;

  constructor(
    private readonly createWidgetDescriptorUseCase: CreateWidgetDescriptorUseCase,
    private readonly getAllWidgetDescriptorsUseCase: GetAllWidgetDescriptorsUseCase
  ) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post('/', this.createWidgetDescriptor.bind(this));
    this.router.get('/', this.getAllWidgetDescriptors.bind(this));
  }

  public getRouter(): Router {
    return this.router;
  }

  private async createWidgetDescriptor(req: Request, res: Response): Promise<void> {
    try {
      const { widgetType, contentType, staticContent, dataUrl, loadingState, errorState } = req.body;

      // Basic validation
      if (!widgetType || !contentType) {
        res.status(400).json({
          error: 'widgetType and contentType are required'
        });
        return;
      }

      // Content type specific validation
      if (contentType === 'dynamic' && !dataUrl) {
        res.status(400).json({
          error: 'dataUrl is required for dynamic widgets'
        });
        return;
      }

      if (contentType === 'static' && !staticContent) {
        res.status(400).json({
          error: 'staticContent is required for static widgets'
        });
        return;
      }

      const result = await this.createWidgetDescriptorUseCase.execute({
        widgetType,
        contentType,
        staticContent,
        dataUrl,
        loadingState,
        errorState
      });

      if (result.isSuccess()) {
        const descriptor = result.getValue();
        
        // Format response according to PRD specification
        const response = {
          id: descriptor.getId().getValue(),
          type: descriptor.getContentType().getValue(),
          widgetType: descriptor.getWidgetType().getValue(),
          config: descriptor.isStatic() 
            ? { staticContent: descriptor.getStaticContent() }
            : {
                dataUrl: descriptor.getDataUrl(),
                loadingState: descriptor.getLoadingState()?.getValue(),
                errorState: descriptor.getErrorState()?.getValue()
              }
        };

        res.status(201).json(response);
      } else {
        res.status(400).json({
          error: result.getError()
        });
      }
    } catch (error) {
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  private async getAllWidgetDescriptors(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.getAllWidgetDescriptorsUseCase.execute();

      if (result.isSuccess()) {
        const descriptors = result.getValue();
        
        // Format response according to PRD specification
        const widgets = descriptors.map(descriptor => ({
          id: descriptor.getId().getValue(),
          type: descriptor.getContentType().getValue(),
          widgetType: descriptor.getWidgetType().getValue(),
          config: descriptor.isStatic() 
            ? { staticContent: descriptor.getStaticContent() }
            : {
                dataUrl: descriptor.getDataUrl(),
                loadingState: descriptor.getLoadingState()?.getValue(),
                errorState: descriptor.getErrorState()?.getValue()
              }
        }));

        res.status(200).json({ widgets });
      } else {
        res.status(500).json({
          error: result.getError()
        });
      }
    } catch (error) {
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
}
