import { Router } from 'express';
import { check } from 'express-validator';
import ProfileController from '../controllers/ProfileContoller';
import { authMiddleware } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.get('/', authMiddleware(), asyncHandler(ProfileController.getProfile));

router.put(
  '/',
  authMiddleware(),
  [
    check('name')
      .optional()
      .notEmpty().withMessage('Name cannot be empty')
      .isLength({ min: 3, max: 255 }).withMessage('Name must be between 3 and 255 characters'),
    check('email')
      .optional()
      .isEmail().withMessage('A valid email is required')
      .isLength({ min: 3, max: 255 }).withMessage('Email must be between 3 and 255 characters'),
    check('mobile')
      .optional()
      .notEmpty().withMessage('Mobile cannot be empty')
  ],
  asyncHandler(ProfileController.updateProfile)
);

export default router;