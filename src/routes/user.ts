import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import * as userController from '../controllers/userController';

const router = Router();

router.get('/me', authenticate, userController.getMe);
router.put('/me', authenticate, userController.updateMe);

export default router;
