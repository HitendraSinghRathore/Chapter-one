import { Router } from 'express';
import { check, param, query } from 'express-validator';
import { asyncHandler } from '../middleware/asyncHandler';
import CollectionController from '../controllers/CollectionController';
import { authMiddleware } from '../middleware/auth.middleware';
import { uploadImageMiddleware } from '../middleware/upload.middleware';

const router = Router();

router.post(
  '/',
  uploadImageMiddleware,
  [
    check('name')
      .notEmpty().withMessage('Collection name is required')
      .isLength({ min: 3, max: 255 }).withMessage('Collection name must be between 3 and 255 characters'),
      check('books').optional().isArray().withMessage('Books must be an array'),
      
  ],
  authMiddleware(['admin']),
  asyncHandler(CollectionController.createCollection)
);

router.put(
  '/:id',
  uploadImageMiddleware,
  [
    param('id').isInt().withMessage('Invalid collection id'),
    check('name')
      .optional()
      .notEmpty().withMessage('Collection name cannot be empty')
      .isLength({ min: 3, max: 255 }).withMessage('Collection name must be between 3 and 255 characters'),
    check('description')
      .optional()
      .notEmpty().withMessage('Description cannot be empty')
      .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
      check('books').optional().isArray().withMessage('Books must be an array'),
  ],
  authMiddleware(['admin']),
  asyncHandler(CollectionController.updateCollection)
);

router.delete(
  '/:id',
  [param('id').isInt().withMessage('Invalid collection id')],
  authMiddleware(['admin']),
  asyncHandler(CollectionController.deleteCollection)
);

router.get(
  '/',
  [
    query('page').optional().isInt({ min: 0 }).withMessage('Page must be >= 0'),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be > 0'),
  ],
  asyncHandler(CollectionController.getCollections)
);

router.get(
  '/:id',
  [
    param('id').isInt().withMessage('Invalid collection id'),
    query('page').optional().isInt({ min: 0 }).withMessage('Page must be >= 0'),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be > 0'),
  ],
  asyncHandler(CollectionController.getCollectionById)
);

export default router;
