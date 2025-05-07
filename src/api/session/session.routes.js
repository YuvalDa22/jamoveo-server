import express from 'express';
import { createSession, joinSession } from './session.controller.js';

const router = express.Router();

router.post('/create', createSession);
router.put('/join/:id', joinSession);

export default router;
