import {  Router } from 'express';
import { uploadImageMiddleware } from '../middleware/upload.middleware';
import { check, param,query } from 'express-validator';
import { authMiddleware } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/asyncHandler';
import AuthorController from '../controllers/AuthorController';


const router = Router();

router.post('/', authMiddleware(['admin']), uploadImageMiddleware, [
    check('name').notEmpty().withMessage('Author name is required').isLength({ min: 3, max: 255 }).withMessage('Author name must be between 3 and 255 characters'),
    check('about').notEmpty().withMessage('Author about is required').isLength({ min: 10 }).withMessage('Author about must be more than 10 characters'),
], asyncHandler(AuthorController.createAuthor));

router.put('/:id', authMiddleware(['admin']),uploadImageMiddleware, [
    param('id').isInt().withMessage('Invalid author id'),
    check('name').notEmpty().withMessage('Author name is required').isLength({ min: 3, max: 255 }).withMessage('Author name must be between 3 and 255 characters'),
    check('about').notEmpty().withMessage('Author about is required').isLength({ min: 10 }).withMessage('Author about must be more than 10 characters'),
], asyncHandler(AuthorController.updateAuthor));

router.get('/:id', [check('id').isInt().withMessage('Invalid author id')], asyncHandler(AuthorController.getAuthor));

router.get('/', [
    query('page').optional().isInt({ min: 0 }).withMessage('Page must be an integer greater than or equal to 0'),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be an integer greater than or equal to 1')
], asyncHandler(AuthorController.getAuthors));

export default router;