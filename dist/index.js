"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
dotenv_1.default.config();
const app = (0, express_1.default)();
// ==========================================
// Middleware
// ==========================================
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
// Logging Middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
    });
    next();
});
// ==========================================
// Routes
// ==========================================
// Health Check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'courses',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});
// API Routes
app.get('/api/courses', (req, res) => {
    res.json({
        message: 'Courses Service - GET /api/courses',
        timestamp: new Date().toISOString(),
    });
});
app.post('/api/courses', (req, res) => {
    res.json({
        message: 'Courses Service - POST /api/courses',
        data: req.body,
        timestamp: new Date().toISOString(),
    });
});
// ==========================================
// Error Handling
// ==========================================
app.use((req, res) => {
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
        await (0, db_1.initializeDatabase)();
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
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}
start();
exports.default = app;
//# sourceMappingURL=index.js.map