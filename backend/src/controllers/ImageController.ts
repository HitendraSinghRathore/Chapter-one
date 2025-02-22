import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { gfs } from '../database/gridfs';

export default class ImageController {
  static async getImage(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!gfs) {
        res.status(500).json({ message: 'GridFS not initialized' });
        return;
      }
      const _id = new ObjectId(id);

      const file = await gfs.files.findOne({ _id });

      if (!file) {
        res.status(404).json({ message: 'File not found' });
        return;
      }
      if (!file.contentType.startsWith('image/')) {
        res.status(400).json({ message: 'Not an image file' });
        return;
      }

      const readstream = gfs.createReadStream({ _id: _id.toString() });
      res.set('Content-Type', file.contentType);
      readstream.pipe(res);
    } catch (error) {
      console.error('Error while fetching image:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
