import { Router } from 'express';
import ImageController from '../controllers/ImageController';
import { asyncHandler } from '../middleware/asyncHandler';
import cors from 'cors';

const router = Router();

router.get('/:id',cors(), asyncHandler(ImageController.getImage));

export default router;