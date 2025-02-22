import { Router } from 'express';
import ImageController from '../controllers/ImageController';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.get('/:id', asyncHandler(ImageController.getImage));

export default router;