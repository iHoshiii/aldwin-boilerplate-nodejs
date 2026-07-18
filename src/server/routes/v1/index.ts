import { errors } from 'celebrate';
import type { NextFunction, Request, Response } from 'express';
import { Router } from 'express';
import contactRoutes from './contact.route.js';
import projectRoutes from './project.route.js';
import taskRoutes from './task.route.js';

const router = Router();

router.use('/contact', contactRoutes);
router.use('/task', taskRoutes);
router.use('/project', projectRoutes);

/**
 * GET /health
 * Health check endpoint.
 */
router.get('/health', (req: Request, res: Response) => {
  res.send('Ok');
});

// Handle Celebrate/Joi validation errors
router.use(errors());

// General error handling middleware
router.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  const error = err as { status?: number; statusCode?: number; message?: string; stack?: string };
  const status = error.status || error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
  });
});

export default router;
