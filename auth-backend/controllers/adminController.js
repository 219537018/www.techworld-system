import jwt from "jsonwebtoken";
import validator from 'validator';
import JobModel from "../models/jobModel.js";
import applicationModel from "../models/applicationModel.js";
// API for admin login
const loginAdmin = async (req, res) => {
    try {

        const { email, password } = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

const addJob = async (req, res) => {
    try {
      const { title, experience, salary, description, techStack, qualification, location } = req.body;
 
  
      if (!title || !experience || !salary || !description || !techStack || !qualification || !location ) {
        return res.json({ success: false, message: "Missing Details" });
      }
  
      if (isNaN(salary) || Number(salary) <= 0) {
        return res.json({ success: false, message: "Salary must be a positive number" });
      }
  
      if (description.length < 20) {
        return res.json({ success: false, message: "Description should be at least 20 characters long" });
      }
  
      let parsedLocation;
      try {
        parsedLocation = JSON.parse(location);
        if (!parsedLocation.line1 || !parsedLocation.line2) {
          return res.json({ success: false, message: "Incomplete location details" });
        }
      } catch (err) {
        return res.json({ success: false, message: "Invalid location format" });
      }
  
      // ✅ SAVE TO DATABASE
      const newJob = new JobModel({
        title,
        experience,
        salary,
        description,
        techStack,
        qualification,
        location: parsedLocation,
        
      });
  
      await newJob.save(); // ⬅️ This saves the job to MongoDB
  
      console.log("Saved job:", newJob);
  
      res.status(201).json({ success: true, message: "Job added successfully" });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Failed to add job" });
    }
  }

  const getAllJobs = async (req, res) => {
    try {
      const jobs = await JobModel.find();
      res.json({ success: true, jobs });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch jobs" });
    }
  }
  
  // API to get all job applications list
  const getAllApplications = async (req, res) => {
    try {
      console.log("🔍 Admin fetching all applications...");
  
      // Debug block to check if job data is populated
      const debugData = await applicationModel.find().populate("job");
      debugData.forEach(app => {
        console.log("✅ Job data for application:", app.fullName, "➡", app.job);
      });
  
      // Actual logic
      const applications = await applicationModel
        .find()
        .sort({ appliedAt: -1 })
        .populate("job", "title description qualification"); // Populate only the title field
  
      res.json({ success: true, applications });
    } catch (error) {
      console.error("❌ Error fetching applications:", error);
      res.status(500).json({ success: false, message: "Failed to fetch applications" });
    }
  };
  

export {
    loginAdmin,
    addJob,
    getAllJobs,
    getAllApplications
  
}
