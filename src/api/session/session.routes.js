import express from 'express';
import { createSession, joinSession } from './session.controller.js';

const router = express.Router();

router.post('/', createSession);
router.put('/:id', joinSession);

export default router;
