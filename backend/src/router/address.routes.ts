import { Router } from 'express';
import { check, param } from 'express-validator';
import { asyncHandler } from '../middleware/asyncHandler';
import AddressController from '../controllers/AddressController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware());

router.post(
  '/',
  [
    check('contactName')
      .notEmpty().withMessage('Contact name is required')
      .isLength({ min: 3, max: 255 }).withMessage('Contact name must be between 3 and 255 characters'),
    check('address')
      .notEmpty().withMessage('Address is required'),
    check('latitude')
      .notEmpty().withMessage('Latitude is required')
      .isDecimal().withMessage('Latitude must be a decimal'),
    check('longitude')
      .notEmpty().withMessage('Longitude is required')
      .isDecimal().withMessage('Longitude must be a decimal'),
    check('houseNo')
      .notEmpty().withMessage('House number is required')
      .isLength({ min: 1, max: 100 }).withMessage('House number must be between 1 and 100 characters'),
    check('area')
      .notEmpty().withMessage('Area is required')   
  ],
  asyncHandler(AddressController.createAddress)
);

router.put(
  '/:id',
  [
    param('id').isInt().withMessage('Invalid address id'),
    check('contactName')
      .optional()
      .notEmpty().withMessage('Contact name cannot be empty')
      .isLength({ min: 3, max: 255 }).withMessage('Contact name must be between 3 and 255 characters'),
    check('address')
      .optional()
      .notEmpty().withMessage('Address cannot be empty'),
    check('latitude')
      .optional()
      .notEmpty().withMessage('Latitude cannot be empty')
      .isDecimal().withMessage('Latitude must be a decimal'),
    check('longitude')
      .optional()
      .notEmpty().withMessage('Longitude cannot be empty')
      .isDecimal().withMessage('Longitude must be a decimal'),
    check('houseNo')
      .optional()
      .notEmpty().withMessage('House number cannot be empty')
      .isLength({ min: 1, max: 100 }).withMessage('House number must be between 1 and 100 characters'),
    check('area')
      .optional()
      .notEmpty().withMessage('Area cannot be empty')
  ],
  asyncHandler(AddressController.updateAddress)
);

router.delete(
  '/:id',
  [param('id').isInt().withMessage('Invalid address id')],
  asyncHandler(AddressController.deleteAddress)
);
router.post(
  '/:id/primary',
  [param('id').isInt().withMessage('Invalid address id')],
  asyncHandler(AddressController.setPrimaryAddress)
);

router.get(
  '/',
  asyncHandler(AddressController.getAddresses)
);

router.get(
  '/:id',
  [param('id').isInt().withMessage('Invalid address id')],
  asyncHandler(AddressController.getAddressById)
);

export default router;
