import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import apiRoutes from './routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Main API Router
app.use('/api', apiRoutes);

// Centralized error handling
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
