
import { check } from 'express-validator';
import AuthController from '../controllers/AuthController';
import { authMiddleware } from '../middleware/auth.middleware';
import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.post(
  '/signup',
  [
    check('firstName').notEmpty().withMessage('First name is required'),
    check('lastName').notEmpty().withMessage('Last name is required'),
    check('mobile')
      .notEmpty()
      .withMessage('Mobile is required')
      .isMobilePhone('any')
      .withMessage('Invalid mobile number'),
    check('email').isEmail().withMessage('Valid email is required'),
    check('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters')
      .custom((value) => {
        if (!/(?=.*[a-z])/.test(value)) {
            throw new Error('Password must contain at least one lowercase letter');
          }
          if (!/(?=.*[A-Z])/.test(value)) {
            throw new Error('Password must contain at least one uppercase letter');
          }
          if (!/(?=.*[^A-Za-z0-9])/.test(value)) {
            throw new Error('Password must contain at least one special symbol');
          }
          return true;
      })
     
  ],
  asyncHandler(AuthController.signup)
);

router.post(
  '/login',
  [
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').notEmpty().withMessage('Password is required'),
  ],
  asyncHandler(AuthController.login)
);


router.post('/logout', authMiddleware(['regular', 'admin']), asyncHandler(AuthController.logout));

export default router;