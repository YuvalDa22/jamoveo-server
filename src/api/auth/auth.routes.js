import express from 'express';
import { signup, login, logout } from './auth.controller.js';

//console.log('[DEBUG] auth.routes.js loaded');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

//console.log('[DEBUG] Router has routes:', router.stack.map(r => r.route?.path));

export default router;
