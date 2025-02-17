import './types/shim';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import authRoutes from './router/auth.routes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth',authRoutes);

app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
});


app.get('/healthz', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', message: 'Service is healthy' });
  });

app.use((err: Error, req: Request, res: Response) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  });


export default app;