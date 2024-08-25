import express from 'express';
const router = express.Router();
import { registerUser, login, authenticateToken } from '../controller/authController.js';
import {products} from '../controller/productController.js';



router.post('/login', login);
router.post('/register', registerUser);
router.post('/product', authenticateToken, products);

export default router;
