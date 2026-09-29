import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import postRoutes from './routes/postRoutes.js';
import { requestLogger } from './middleware/logger.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// 1. CORE MIDDLEWARES
// ==========================================
// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Parse incoming JSON payloads
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Custom Request Logger
app.use(requestLogger);

// Serve static frontend testing dashboard from /public
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// 2. API ROUTES
// ==========================================
// System Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Primary REST Endpoints (Both /posts and /api/posts for versatility)
app.use('/posts', postRoutes);
app.use('/api/posts', postRoutes);

// ==========================================
// 3. ERROR HANDLING MIDDLEWARES
// ==========================================
// 404 Route Not Found
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

// ==========================================
// 4. SERVER INITIALIZATION
// ==========================================
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Blog REST API Server Running Successfully!`);
  console.log(`📡 URL:        http://localhost:${PORT}`);
  console.log(`📚 Endpoints:  http://localhost:${PORT}/posts`);
  console.log(`⚡ Dashboard:  http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});

export default app;
