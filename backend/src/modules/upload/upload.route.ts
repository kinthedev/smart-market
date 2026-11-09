import { Router } from 'express';
import { upload } from '../../middlewares/upload';
import { uploadImage } from './upload.controller';
import { authenticate } from '../../middlewares/authenticate';

const router = Router();

// Endpoint: POST /api/v1/upload
router.post('/', authenticate, upload.single('image'), uploadImage);

export default router;
