import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { ApiResponse } from '../types';

/**
 * Rate limiting middleware
 */
export const createRateLimiter = (windowMs: number = 15 * 60 * 1000, max: number = 100) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

/**
 * Global error handling middleware
 */
export const errorHandler = (
  error: any,
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): void => {
  console.error('Global error handler:', error);

  // Default error
  let status = 500;
  let message = 'Internal server error';

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    status = 400;
    const errors = Object.values(error.errors).map((err: any) => err.message);
    message = `Validation error: ${errors.join(', ')}`;
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    status = 409;
    const field = Object.keys(error.keyPattern)[0];
    message = `${field} already exists`;
  }

  // JWT error
  if (error.name === 'JsonWebTokenError') {
    status = 401;
    message = 'Invalid token';
  }

  // JWT expired error
  if (error.name === 'TokenExpiredError') {
    status = 401;
    message = 'Token expired';
  }

  res.status(status).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
};

/**
 * 404 handler middleware
 */
export const notFoundHandler = (req: Request, res: Response<ApiResponse>): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
};

/**
 * Request logger middleware
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, originalUrl } = req;
    const { statusCode } = res;
    
    console.log(`${method} ${originalUrl} ${statusCode} - ${duration}ms`);
  });
  
  next();
};
