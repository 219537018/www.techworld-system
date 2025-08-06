import express from 'express';
import multer from 'multer';
import path from 'path';
import { loginAdmin, addJob, getAllJobs, getAllApplications  } from '../controllers/adminController.js';
import authAdmin from '../middleware/authAdmin.js'; // Ensure this middleware is implemented if needed
import { getAllApplicationsForAdmin } from "../controllers/JobController.js"; // adjust path if needed

const adminRouter = express.Router();

// Setup multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Routes
adminRouter.post("/login", loginAdmin);
adminRouter.post("/add-job", upload.single('image'), addJob);
adminRouter.get("/get-jobs", getAllJobs);
adminRouter.get("/get-applications", getAllApplications);
adminRouter.get("/get-applications-for-admin", authAdmin, getAllApplicationsForAdmin);
export default adminRouter;
