import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './db';

dotenv.config();

const app = express();

// ==========================================
// Middleware
// ==========================================

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Logging Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`
    );
  });
  
  next();
});

// ==========================================
// Routes
// ==========================================

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'courses',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.get('/api/courses', (req: Request, res: Response) => {
  res.json({
    message: 'Courses Service - GET /api/courses',
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/courses', (req: Request, res: Response) => {
  res.json({
    message: 'Courses Service - POST /api/courses',
    data: req.body,
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// Error Handling
// ==========================================

app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    method: req.method,
  });
});

// ==========================================
// Server Start
// ==========================================

const PORT = parseInt(process.env.SERVICE_PORT || '3001', 10);

async function start() {
  try {
    // Initialize Database
    await initializeDatabase();

    // Start Server
    const server = app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🎓 Leader Academy Courses Service                       ║
║                                                            ║
║   Server running on: http://localhost:${PORT}              ║
║   Environment: ${process.env.NODE_ENV || 'development'}                          ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
      `);
    });

    // Graceful Shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

start();

export default app;
