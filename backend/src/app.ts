import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';


const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/healthz', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', message: 'Service is healthy' });
  });


export default app;