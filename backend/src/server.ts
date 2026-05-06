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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Main API Router
app.use('/api', apiRoutes);

// Centralized error handling
app.use(errorHandler);

import prisma from './prisma';
import fs from 'fs';

app.listen(port, async () => {
  console.log(`Backend server running on http://localhost:${port}`);
  
  // Diagnostic DB query to inspect the SQLite database state
  try {
    const users = await prisma.user.findMany();
    const accounts = await prisma.account.findMany();
    const transactions = await prisma.transaction.findMany();
    
    fs.writeFileSync(
      path.resolve(__dirname, 'db_status.log'),
      JSON.stringify({
        timestamp: new Date().toISOString(),
        users,
        accounts,
        transactions
      }, null, 2)
    );
    console.log("Diagnostic db_status.log written successfully!");
  } catch (err: any) {
    console.error("Failed to run diagnostics", err);
    try {
      fs.writeFileSync(
        path.resolve(__dirname, 'db_status_error.log'),
        JSON.stringify({ error: err.message, stack: err.stack }, null, 2)
      );
    } catch (e) {}
  }
});
