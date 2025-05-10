import express from 'express';
import { signup, login, logout } from './auth.controller.js';

// debug
console.log('[DEBUG] auth.routes.js loaded');


const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

export default router;
