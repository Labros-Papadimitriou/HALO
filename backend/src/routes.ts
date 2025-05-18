import { Express } from 'express';
import { itemRoutes, lootHistoryRoutes, memberRoutes } from './routes/index.js';
import authRoutes from './auth';

export default function registerRoutes(app: Express) {
  app.use('/auth', authRoutes);
  app.use('/items', itemRoutes);
  app.use('/loot-history', lootHistoryRoutes);
  app.use('/members', memberRoutes);
}
