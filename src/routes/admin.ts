import { Router } from 'express';
import { authenticate, authorizeAdmin } from '../middlewares/auth';
import * as adminController from '../controllers/adminController';

const router = Router();

router.use(authenticate, authorizeAdmin);

// Analytics
router.get('/analytics', adminController.getAnalytics);

// User management
router.get('/users', adminController.getUsers);
router.put('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);

// Blog management
router.get('/blogs', authenticate, authorizeAdmin, adminController.getAllBlogs);

// Comment moderation
router.get('/comments/pending', authenticate, authorizeAdmin, adminController.getPendingComments);
router.put('/comments/:id/approve', authenticate, authorizeAdmin, (req,res,next)=>{req.body.approved=true; next();}, adminController.moderateComment);
router.delete('/comments/:id', authenticate, authorizeAdmin, adminController.moderateComment);
router.delete('/blogs/:id', adminController.deleteBlog);

export default router;
