import express from 'express';
import { getRole } from '../controllers/role-controller.js';

const router = express.Router();

router.route('/').get(getRole);

export default router;
