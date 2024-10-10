import express from 'express';
import { connectToDatabase } from './config/database';
import authRoutes from './routes/authRoutes';
import cors from 'cors';

const app = express();

connectToDatabase();

app.use(cors());
app.use(express.json());


// Routes
app.use('/auth', authRoutes);

export default app;