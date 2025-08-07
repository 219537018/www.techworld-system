import express from 'express';
import path from 'path';
import fs from 'fs';
import authAdmin from '../middleware/authAdmin.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const resumeRouter = express.Router();

// Reconstruct __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

resumeRouter.get('/secure-resume/:filename', authAdmin, (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../uploads', filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Resume not found');
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
});

export default resumeRouter;
