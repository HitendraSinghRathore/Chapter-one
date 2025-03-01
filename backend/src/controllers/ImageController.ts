import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { db, bucket } from '../database/gridfs'; 

export default class ImageController {
  static async getImage(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!bucket) {
        res.status(500).json({ message: 'GridFS bucket not initialized' });
        return;
      }
      const fileId = new ObjectId(id);

      const fileDoc = await db.collection('uploads.files').findOne({ _id: fileId });
      if (!fileDoc) {
        res.status(404).json({ message: 'File not found' });
        return;
      }
      const contentType = fileDoc.contentType || fileDoc.metadata?.mimetype;
      if (!contentType || !contentType.startsWith('image/')) {
        res.status(400).json({ message: 'Not an image file' });
        return;
      }
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      res.set('Content-Type', contentType);
      const downloadStream = bucket.openDownloadStream(fileId);
      downloadStream.on('error', (err) => {
        console.error('Error streaming file:', err);
        res.status(500).json({ message: 'Error streaming file' });
      });
      downloadStream.pipe(res);

    } catch (error) {
      console.error('Error while fetching image:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
