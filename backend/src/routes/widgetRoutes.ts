   import { Router } from 'express';
import { WidgetController } from '../controllers/widgetController';

export function createWidgetRoutes(widgetController: WidgetController): Router {
  const router = Router();
  
  // Delegate to controller
  router.use('/', widgetController.getRouter());
  
  return router;
}