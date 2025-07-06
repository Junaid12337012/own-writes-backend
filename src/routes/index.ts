import { Router } from 'express';
import authRoutes from './auth';
import blogRoutes from './blog';
import categoryRoutes from './category';
import commentRoutes from './comment';
import adminRoutes from './admin';
import googleAuthRoutes from './googleAuth';
import userRoutes from './user';

const router = Router();

router.use('/auth', authRoutes);
router.use('/auth', googleAuthRoutes);
router.use('/blogs', blogRoutes);
router.use('/categories', categoryRoutes);
router.use('/comments', commentRoutes);
router.use('/admin', adminRoutes);
router.use('/users', userRoutes);

export default router;
