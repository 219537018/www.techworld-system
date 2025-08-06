// backend/routes/resumeGenerator.js
import express from 'express';
import fetch from 'node-fetch';
const router = express.Router();

router.post('/generate-resume', async (req, res) => {
  const { prompt } = req.body;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    })
  });

  const data = await response.json();
  res.json(data);
});

export default router;
