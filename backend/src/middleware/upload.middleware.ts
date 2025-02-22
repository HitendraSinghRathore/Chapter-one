import { Request, Response, NextFunction } from 'express';
import multer, { StorageEngine } from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import config from '../config';

const gridFsStorage = new GridFsStorage({
  url: config.mongo.uri,
  file: (req, file) => {
    return {
      bucketName: 'uploads',
      filename: `${Date.now()}-${file.originalname}`,
    };
  },
});

const storage = gridFsStorage as unknown as StorageEngine;

const upload = multer({ storage });

export const uploadImageMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const uploadSingle = upload.single('image');
  uploadSingle(req, res, (err) => {
    if (err) {
      console.error('Image upload error:', err);
      return res.status(400).json({ message: 'Image upload failed', error: err.message || err });
    }
    next();
  });
};