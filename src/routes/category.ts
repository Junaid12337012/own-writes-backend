import { Router } from 'express';
import * as categoryController from '../controllers/categoryController';
import { authenticate, authorizeAdmin } from '../middlewares/auth';

const router = Router();

router.get('/', categoryController.getCategories);
router.post('/', authenticate, authorizeAdmin, categoryController.createCategory);
router.put('/:id', authenticate, authorizeAdmin, categoryController.updateCategory);
router.delete('/:id', authenticate, authorizeAdmin, categoryController.deleteCategory);

export default router;
