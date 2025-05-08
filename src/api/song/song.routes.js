import express from 'express';
import { getSongs, getSong } from './song.controller.js';

const router = express.Router();

router.get('/', getSongs);       
router.get('/:id', getSong);      

export default router;
