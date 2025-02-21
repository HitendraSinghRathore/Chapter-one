import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { check, param, query } from 'express-validator';
import GenreController from '../controllers/GenreController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/', [
    query('page').optional().isInt({ min: 0 }).withMessage('Page must be an integer greater than or equal to 0'),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be an integer greater than or equal to 1')
],asyncHandler(GenreController.getGenres));

router.get('/:id', [
    param('id').isInt().withMessage('Invalid genre id')],
    asyncHandler(GenreController.getGenre));

router.post('/', [
    check('name').notEmpty().withMessage('Genre name is required').isLength({ min: 3, max: 255 }).withMessage('Genre name must be between 3 and 255 characters'),
    check('description').notEmpty().withMessage('Genre description is required').isLength({ min: 10 }).withMessage('Genre description must be more than 10 characters')],
    authMiddleware(['admin']), asyncHandler(GenreController.createGenre));

router.put('/:id', [
    param('id').isInt().withMessage('Invalid genre id'),
    check('name').notEmpty().withMessage('Genre name is required').isLength({ min: 3, max: 255 }).withMessage('Genre name must be between 3 and 255 characters'),
    check('description').notEmpty().withMessage('Genre description is required').isLength({ min: 10 }).withMessage('Genre description must be more than 10 characters')
], authMiddleware(['admin']), asyncHandler(GenreController.updateGenre));

router.delete('/:id', [
    param('id').isInt().withMessage('Invalid genre id')
], authMiddleware(['admin']), asyncHandler(GenreController.deleteGenres));

// router.post('/genres/transfer',[
//     check('sourceId').isInt().withMessage('Invalid source genre id'),
//     check('destinationId').isInt().withMessage('Invalid destination genre id')
// ],authMiddleware(['admin']), asyncHandler(GenreController.transferGenre));


export default router;