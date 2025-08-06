import express from 'express';
import path from 'path';
import fs from 'fs';

const fileRouter = express.Router(); // Define fileRouter

fileRouter.get('/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '..', 'uploads', filename);
  
    if (!fs.existsSync(filePath)) {
      return res.status(404).send('File not found');
    }
  
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.sendFile(filePath);
});

export default fileRouter;
