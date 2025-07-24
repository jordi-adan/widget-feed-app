   import { Request, Response, Router } from 'express';
import { CreateWidgetUseCase } from '../application/CreateWidgetUseCase';
import { GetAllWidgetsUseCase } from '../application/GetAllWidgetsUseCase';
import { UpdateWidgetContentUseCase } from '../application/UpdateWidgetContentUseCase';
import { WidgetErrorCode } from '../domain/errors/WidgetErrors';

export class WidgetController {
  private router: Router;

  constructor(
    private readonly createWidgetUseCase: CreateWidgetUseCase,
    private readonly getAllWidgetsUseCase: GetAllWidgetsUseCase,
    private readonly updateWidgetContentUseCase: UpdateWidgetContentUseCase
  ) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post('/', this.createWidget.bind(this));
    this.router.get('/', this.getAllWidgets.bind(this));
    this.router.put('/:id', this.updateWidgetContent.bind(this));
  }

  public getRouter(): Router {
    return this.router;
  }

  private async createWidget(req: Request, res: Response): Promise<void> {
    try {
      const { type, content } = req.body;

      // Validation
      if (!type || !content) {
        res.status(400).json({
          success: false,
          error: 'Type and content are required'
        });
        return;
      }

      const result = await this.createWidgetUseCase.execute({ type, content });

      if (result.success) {
        res.status(201).json({
          success: true,
          widget: result.widget!.toPrimitive()
        });
      } else {
        res.status(400).json({
          success: false,
          error: result.error
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  private async getAllWidgets(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.getAllWidgetsUseCase.execute();

      if (result.success) {
        res.status(200).json({
          success: true,
          widgets: result.widgets!.map(widget => widget.toPrimitive())
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  private async updateWidgetContent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { content } = req.body;

      // Validation
      if (!content) {
        res.status(400).json({
          success: false,
          error: 'Content is required'
        });
        return;
      }

      const result = await this.updateWidgetContentUseCase.execute({ id, content });

      if (result.success) {
        res.status(200).json({
          success: true,
          widget: result.widget ? result.widget.toPrimitive() : null
        });
      } else {
        const statusCode = result.errorCode === WidgetErrorCode.WIDGET_NOT_FOUND ? 404 : 400;
        res.status(statusCode).json({
          success: false,
          error: result.error
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}