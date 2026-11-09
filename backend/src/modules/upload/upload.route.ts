import { Router } from 'express';
import { upload } from '../../middlewares/upload.js';
import { uploadImage } from './upload.controller.js';
import { authenticate } from '../../middlewares/authenticate.js';

const router = Router();

// Endpoint: POST /api/v1/upload
router.post('/', authenticate, upload.single('image'), uploadImage);

export default router;
