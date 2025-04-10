import express from 'express';
import { VerifyToken } from '../middlewares/auth-middleware.js';
import upload from '../middlewares/upload-middleware.js';
import { uploadUserImage } from '../controllers/upload-user-photo-controller.js';

const router = express.Router();

router.use(VerifyToken);

router.route('/').post(upload.single('image'), uploadUserImage);

export default router;
