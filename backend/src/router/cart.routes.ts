import { Router } from 'express';
import { check, param } from 'express-validator';
import { asyncHandler } from '../middleware/asyncHandler';
import CartController from '../controllers/CartController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware());
router.get('/', asyncHandler(CartController.getCart));

router.post(
  '/add',
  [
    check('bookId').isInt().withMessage('Book id must be an integer'),
    check('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  ],
  asyncHandler(CartController.addToCart)
);

router.delete(
  '/item/:id',
  [param('id').isInt().withMessage('Invalid cart item id')],
  asyncHandler(CartController.removeCartItem)
);

export default router;
