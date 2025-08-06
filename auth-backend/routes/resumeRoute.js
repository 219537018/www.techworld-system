const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth'); // JWT or session-based middleware

router.get('/secure-resume/:filename', adminAuth, (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../uploads', filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Resume not found');
  }

  // Serve as inline content — so browser renders it in iframe
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline'); // ⚠️ NOT attachment
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Stream the PDF
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
});
const resumeRouter = express.Router();
export default resumeRouter;
