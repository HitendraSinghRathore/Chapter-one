import { Router } from 'express';
import { check, param, query } from 'express-validator';
import { asyncHandler } from '../middleware/asyncHandler';
import BookController from '../controllers/BookController';
import { authMiddleware } from '../middleware/auth.middleware';
import { uploadImageMiddleware } from '../middleware/upload.middleware';

const router = Router();

router.post(
  '/',
  uploadImageMiddleware, 
  [
    check('name')
      .notEmpty().withMessage('Book name is required'),
    check('description')
      .notEmpty().withMessage('Description is required'),
    check('ISBN')
      .notEmpty().withMessage('ISBN is required'),
    check('pageCount')
      .isInt({ min: 1 }).withMessage('Page count must be at least 1'),
    check('sellableQuantity')
      .isInt({ min: 0 }).withMessage('Sellable quantity must be 0 or more'),
    check('price')
      .isDecimal().withMessage('Price must be a decimal value'),
    check('countryOfOrigin')
      .notEmpty().withMessage('Country of origin is required'),
    check('publishedDate')
      .isISO8601().withMessage('Published date must be a valid date'),
    check('edition')
      .notEmpty().withMessage('Edition is required'),
    check('authorId')
      .isInt().withMessage('Author id must be an integer'),
  ],
  authMiddleware(['admin']),
  asyncHandler(BookController.createBook)
);

router.put(
  '/:id',
  uploadImageMiddleware,
  [
    param('id').isInt().withMessage('Invalid book id'),
    check('name').optional().notEmpty().withMessage('Book name cannot be empty'),
    check('description').optional().notEmpty().withMessage('Description cannot be empty'),
    check('ISBN').optional().notEmpty().withMessage('ISBN cannot be empty'),
    check('pageCount').optional().isInt({ min: 1 }).withMessage('Page count must be at least 1'),
    check('sellableQuantity').optional().isInt({ min: 0 }).withMessage('Sellable quantity must be 0 or more'),
    check('price').optional().isDecimal().withMessage('Price must be a decimal value'),
    check('countryOfOrigin').optional().notEmpty().withMessage('Country of origin cannot be empty'),
    check('publishedDate').optional().isISO8601().withMessage('Published date must be a valid date'),
    check('edition').optional().notEmpty().withMessage('Edition cannot be empty'),
    check('authorId').optional().isInt().withMessage('Author id must be an integer'),
  ],
  authMiddleware(['admin']),
  asyncHandler(BookController.updateBook)
);

router.get(
  '/:id',
  [param('id').isInt().withMessage('Invalid book id')],
  asyncHandler(BookController.getBook)
);

router.get(
  '/',
  [
    query('page').optional().isInt({ min: 0 }).withMessage('Page must be >= 0'),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be > 0'),
    query('name').optional().isString().withMessage('Name filter must be a string'),
    query('minPrice').optional().isDecimal().withMessage('minPrice must be a decimal'),
    query('maxPrice').optional().isDecimal().withMessage('maxPrice must be a decimal'),
    query('authorId').optional().isInt().withMessage('Author id must be an integer'),
    query('genreIds').optional().isString().withMessage('Genre ids must be a comma separated string'),
  ],
  asyncHandler(BookController.getBooks)
);

export default router;