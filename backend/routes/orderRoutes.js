import express from 'express';
import { checkout } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', checkout);

export default router;
