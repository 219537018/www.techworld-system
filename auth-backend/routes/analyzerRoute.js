// auth-backend/routes/analyzerRoute.js
import express from 'express';
import { analyzeResume } from '../controllers/analyzerController.js';

const router = express.Router();
router.post("/analyze", analyzeResume);

export default router;
