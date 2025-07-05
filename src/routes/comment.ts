import { Router } from 'express';
import * as commentController from '../controllers/commentController';
import { authenticate, authorizeAdmin } from '../middlewares/auth';

const router = Router();

router.get('/blog/:blogId', commentController.getCommentsForBlog);
router.post('/', authenticate, commentController.createComment);
router.put('/:id/moderate', authenticate, authorizeAdmin, commentController.moderateComment);
router.delete('/:id', authenticate, authorizeAdmin, commentController.deleteComment);

export default router;
