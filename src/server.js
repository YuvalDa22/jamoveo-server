import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import listEndpoints from 'express-list-endpoints';



import authRoutes from './api/auth/auth.routes.js';
import sessionRoutes from './api/session/session.routes.js';
import socketHandler from './sockets/socket.controller.js';
import { logger } from './services/logger.service.js';
import { setupAsyncLocalStorage } from './middlewares/als.middleware.js';
import songRoutes from './api/song/song.routes.js';



dotenv.config();
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(express.json());
app.use(setupAsyncLocalStorage);

// debug middleware
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

//test
app.get('/api/test', (req, res) => {
  res.send('Test route works');
});
console.log('[DEBUG] authRoutes type:', typeof authRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/song', songRoutes);

//test
console.log('[ROUTES]', listEndpoints(app));

console.log('[DEBUG] Registered routes:', listEndpoints(app).map(r => r.path));


try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info('MongoDB connected');
} catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
}

socketHandler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

//health check
app.get('/', (req, res) => {
    res.send('Jamoveo server is running');
  });
