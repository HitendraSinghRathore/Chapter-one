import { Router } from 'express';
import { check } from 'express-validator';
import { asyncHandler } from '../middleware/asyncHandler';
import OrderController from '../controllers/OrderController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post(
  '/checkout',
  [
    check('addressId').isInt().withMessage('Address id must be an integer'),
    check('cartId').isInt().withMessage('Cart id must be an integer'),
    check('paymentMode').notEmpty().withMessage('Payment mode is required'),
  ],
  authMiddleware(),
  asyncHandler(OrderController.checkout)
);

router.get('/', authMiddleware(), asyncHandler(OrderController.getMyOrders));

router.get('/admin', authMiddleware(['admin']), asyncHandler(OrderController.getAllOrders));

export default router;
