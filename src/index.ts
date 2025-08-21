// Load environment variables FIRST
import dotenv from 'dotenv';
dotenv.config();

// Debug: Check if Nium credentials are loaded
console.log('🔍 Environment variables loaded:');
console.log('  - NIUM_API_KEY:', process.env.NIUM_API_KEY ? `${process.env.NIUM_API_KEY.substring(0, 10)}...` : 'NOT SET');
console.log('  - NIUM_CLIENT_HASH_ID:', process.env.NIUM_CLIENT_HASH_ID ? `${process.env.NIUM_CLIENT_HASH_ID.substring(0, 10)}...` : 'NOT SET');

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Import utilities and middleware
import { connectDatabase } from './utils/database';
import { 
  createRateLimiter, 
  errorHandler, 
  notFoundHandler, 
  requestLogger 
} from './middleware';

// Import routes
import { authRoutes } from './routes/auth';
import { walletRoutes } from './routes/wallet';

class App {
  public app: Application;
  public port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3001');
    
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet());
    
    // CORS configuration
    const corsOptions = {
      origin: process.env.ALLOWED_ORIGINS?.split(',') || [
        'http://localhost:3000',
        'http://localhost:19006' // Expo development server
      ],
      credentials: true,
      optionsSuccessStatus: 200
    };
    this.app.use(cors(corsOptions));

    // Rate limiting
    const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'); // 15 minutes
    const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');
    this.app.use(createRateLimiter(windowMs, maxRequests));

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Logging middleware
    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
      this.app.use(requestLogger);
    } else {
      this.app.use(morgan('combined'));
    }
  }

  private initializeRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'Server is healthy',
        data: {
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV,
          version: process.env.npm_package_version || '1.0.0'
        }
      });
    });

    // API routes
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/wallet', walletRoutes);

    // Root endpoint
    this.app.get('/', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'RemittanceApp API Server',
        data: {
          version: '1.0.0',
          endpoints: [
            'GET /health',
            'POST /api/auth/register',
            'POST /api/auth/login',
            'GET /api/auth/profile',
            'PUT /api/auth/profile',
            'GET /api/wallet/wallets',
            'GET /api/wallet/transactions',
            'GET /api/wallet/exchange-rates',
            'GET /api/wallet/beneficiaries',
            'POST /api/wallet/send-money'
          ]
        }
      });
    });
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);
    
    // Global error handler
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      // Connect to database
      await connectDatabase();

      // Start server
      this.app.listen(this.port, () => {
        console.log(`🚀 Server running at http://localhost:${this.port}`);
        console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🔐 CORS enabled for: ${process.env.ALLOWED_ORIGINS || 'localhost'}`);
      });
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }
}

// Start the application
const app = new App();
app.start();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

export default app;
