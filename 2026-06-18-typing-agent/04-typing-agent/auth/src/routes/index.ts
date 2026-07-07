import { Router } from 'express';
import authRoutes from './auth.routes';
import repoRoutes from './repo.routes';
import userRoutes from './user.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'auth' });
});

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/repos', repoRoutes);

export default router;
