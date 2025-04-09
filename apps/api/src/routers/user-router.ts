import express from 'express';
import { lookup, uploadUserImage } from '../controllers/user-controller.js';
import upload from '../middlewares/upload-middleware.js';

const router = express.Router();

router.route('/lookup').post(lookup);
router.route('/uploadPhoto').post(upload.single('image'), uploadUserImage);

export default router;
