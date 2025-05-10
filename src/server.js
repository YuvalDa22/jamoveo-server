// FULL server.js DEBUG VERSION TO DIAGNOSE ROUTE ISSUES

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import listEndpoints from 'express-list-endpoints';

// ROUTES
import authRoutes from './api/auth/auth.routes.js';
import sessionRoutes from './api/session/session.routes.js';
import songRoutes from './api/song/song.routes.js';

// OTHER SERVICES
import socketHandler from './sockets/socket.controller.js';
import { logger } from './services/logger.service.js';
import { setupAsyncLocalStorage } from './middlewares/als.middleware.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.use(setupAsyncLocalStorage);

// DEBUG MIDDLEWARE
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.url}`);
  next();
});

// MOUNT ROUTES
console.log('[DEBUG] authRoutes type:', typeof authRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/song', songRoutes);

// DEBUG: Log registered endpoints
console.log('[DEBUG] Registered routes:', listEndpoints(app).map(r => r.path));

// TEST ROUTE
app.get('/api/test', (req, res) => {
  res.send('API is working!');
});

// MONGOOSE CONNECT
try {
  await mongoose.connect(process.env.MONGO_URI);
  logger.info('MongoDB connected');
} catch (error) {
  logger.error('MongoDB connection error:', error);
  process.exit(1);
}

// SOCKETS
socketHandler(io);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

// HEALTH CHECK
app.get('/', (req, res) => {
  res.send('Jamoveo server is running');
});
