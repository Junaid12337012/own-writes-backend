import { Router } from 'express';
import * as blogController from '../controllers/blogController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/', blogController.getBlogs);
router.get('/:id', blogController.getBlogById);
router.post('/', authenticate, blogController.createBlog);
router.put('/:id', authenticate, blogController.updateBlog);
router.post('/:id/reactions', authenticate, blogController.toggleReaction);
router.delete('/:id', authenticate, blogController.deleteBlog);

export default router;
