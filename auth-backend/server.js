import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./config/mongodb.js";
import userRouter from './routes/userRoute.js';
import adminRouter from './routes/adminRoute.js';
import jobRouter from './routes/jobRoute.js';
import analyzerRoute from './routes/analyzerRoute.js';
import fileRouter from './routes/fileRoute.js'; 
import resumeRouter from './routes/resumeRoute.js';
// App config
const app = express();
const port = process.env.PORT || 4000;

// Connect to DB
connectDB();

// Middlewares
app.use(express.json());
app.use(cors());

// Serve PDF files inline
// app.get('/api/file/uploads/:filename', (req, res) => {
//   const filePath = path.join(__dirname, 'uploads', req.params.filename);
//   res.setHeader('Content-Disposition', 'inline'); // Ensure the file is displayed in the browser
//   res.sendFile(filePath);
// });

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
// Serve static files from /uploads
//app.use('/uploads', express.static('uploads'));

// API Endpoints
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter)
app.use("/api/job", jobRouter);
app.use("/api/file", fileRouter); 
app.use("/api/resume", resumeRouter);


app.use("/api", analyzerRoute);


app.get("/", (req, res) => {
  res.send("API Working")
});

app.listen(port, () => console.log(`Server started on PORT: ${port}`));

