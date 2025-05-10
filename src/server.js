import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

// ROUTES
import authRoutes from './api/auth/auth.routes.js';
import sessionRoutes from './api/session/session.routes.js';
import songRoutes from './api/song/song.routes.js';

// SERVICES
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

//  DEBUG
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.url}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/song', songRoutes);


app.get('/test-direct', (req, res) => {
  res.send('Direct route works!');
});
console.log('[DEBUG] /test-direct route registered');

app.get('/', (req, res) => {
  res.send('Jamoveo server is running');
});


async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info('MongoDB connected');

    const PORT = process.env.PORT;
    server.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });

    socketHandler(io);
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

startServer();
