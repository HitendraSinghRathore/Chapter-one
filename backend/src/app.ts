import './types/shim';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import authRoutes from './router/auth.routes';
import genreRoutes from './router/genre.routes';
import authorRoutes from './router/author.routes';
import addressRoutes from './router/address.routes';
import imageRoutes from './router/image.routes';
import bookRoutes from './router/book.routes';
import collectionRoutes from './router/collection.routes';
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth',authRoutes);
app.use('/api/genres',genreRoutes);
app.use('/api/authors',authorRoutes);
app.use('/api/addresses',addressRoutes);
app.use('/api/images',imageRoutes);
app.use('/api/books',bookRoutes);
app.use('/api/collections',collectionRoutes);

app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
});


app.get('/healthz', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', message: 'Service is healthy' });
  });

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  });


export default app;