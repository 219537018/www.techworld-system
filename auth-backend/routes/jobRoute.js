// File: auth-backend/routes/jobRoute.js
import express from 'express';
import multer from 'multer';
import {applicationsForJob, cancelApplication, completeApplication, jobLists, applyForJob, toggleJobAvailability, jobProfile, updateJobProfile, deleteJob, jobDashboard
} from '../controllers/JobController.js';

import authJob from '../middleware/authJob.js'; // Replace or implement if needed

const jobRouter = express.Router();

// Setup Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // make sure this folder exists
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  const upload = multer({ storage });

jobRouter.get("/job-lists", jobLists);
jobRouter.post("/apply", authJob, upload.single('resume'), applyForJob);
jobRouter.get("/profile", authJob, jobProfile);
jobRouter.put("/edit-job/:id", updateJobProfile);
jobRouter.delete("/delete-job/:id", deleteJob);
jobRouter.post("/toggle-availability", authJob, toggleJobAvailability);
jobRouter.get("/applications", authJob, applicationsForJob);
jobRouter.post("/cancel-application", authJob, cancelApplication);
jobRouter.post("/complete-application", authJob, completeApplication);
jobRouter.get("/dashboard", authJob, jobDashboard);

export default jobRouter;

