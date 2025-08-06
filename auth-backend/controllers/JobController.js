import jobModel from "../models/jobModel.js";
import applicationModel from "../models/applicationModel.js";

// API to get applications for a specific job
const applicationsForJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const applications = await applicationModel.find({ job: jobId }).populate("job").populate("user");
        res.json({ success: true, applications });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get all job applications (Admin use)
const getAllApplicationsForAdmin = async (req, res) => {
    try {
      const applications = await applicationModel.find().populate("jobId").populate("user"); // optional
      res.json({ success: true, applications });
    } catch (error) {
      console.error("❌ Error fetching all applications:", error);
      res.status(500).json({ success: false, message: "Failed to fetch applications" });
    }
  };
  
// API to cancel application
const cancelApplication = async (req, res) => {
    try {
        const { jobId, applicationId } = req.body;
        const application = await applicationModel.findById(applicationId);

        if (application && application.jobId === jobId) {
            await applicationModel.findByIdAndUpdate(applicationId, { cancelled: true });
            return res.json({ success: true, message: "Application Cancelled" });
        }

        res.json({ success: false, message: "Application not found or unauthorized" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to mark application as completed (e.g. candidate hired)
const completeApplication = async (req, res) => {
    try {
        const { jobId, applicationId } = req.body;
        const application = await applicationModel.findById(applicationId);

        if (application && application.jobId === jobId) {
            await applicationModel.findByIdAndUpdate(applicationId, { isCompleted: true });
            return res.json({ success: true, message: "Application Completed" });
        }

        res.json({ success: false, message: "Application not found or unauthorized" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to list all jobs (for frontend users)
const jobLists = async (req, res) => {
    try {
        console.log("GET /api/job/job-lists hit"); // Add this
        const jobs = await jobModel.find();
        res.json({ success: true, jobs });
      } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch jobs" });
    }
};

// API to apply for a job
const applyForJob = async (req, res) => {
    try {
      console.log("✅ req.body:", req.body);
      console.log("📎 req.file:", req.file);
  
      // Destructure jobId here (very important!)
      const { fullName, email, phone, coverLetter, jobId } = req.body;
  
      const resume = req.file?.filename;
  
      // Validate all fields including jobId
      if (!fullName || !email || !phone || !coverLetter || !resume || !jobId) {
        return res.status(400).json({ success: false, message: "All fields are required" });
      }
  
      // Use req.userId from auth middleware (authJob)
      const newApplication = new applicationModel({
        fullName,
        email,
        phone,
        coverLetter,
        resume,
        user: req.userId,  // <-- must come from authJob middleware
        job: jobId,
        appliedAt: new Date(),
      });
  
      await newApplication.save();
      res.status(201).json({ success: true, message: "Application submitted successfully" });
    } catch (error) {
      console.error("🔥 Error submitting application:", error.stack || error.message);
      res.status(500).json({ success: false, message: "Failed to submit application" });
    }
  };
  

// API to get applications by the logged-in user
// const getMyApplications = async (req, res) => {
//     try {
//         console.log("🔍 Fetching applications for userId:", userId);
//         console.log("📄 Applications found:", applications);

//       if (!req.userId) {
//         return res.status(401).json({ success: false, message: "Not authenticated" });
//       }
  
//       const userId = req.userId;
  
//       const applications = await applicationModel
//         .find({ user: userId })
//         .populate("job");
  
//       res.status(200).json({ success: true, applications });
//     } catch (error) {
//       console.error("❌ Error in getMyApplications:", error.message);
//       res.status(500).json({ success: false, message: "Error fetching applications" });
//     }
//   };
  
  

// API to change job availability (active/inactive)
const toggleJobAvailability = async (req, res) => {
    try {
        const { jobId } = req.body;
        const job = await jobModel.findById(jobId);

        await jobModel.findByIdAndUpdate(jobId, { available: !job.available });
        res.json({ success: true, message: "Job availability updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get a specific job's profile/info
const jobProfile = async (req, res) => {
    try {
        const { jobId } = req.body;
        const jobData = await jobModel.findById(jobId);
        res.json({ success: true, jobData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to update job profile
const updateJobProfile = async (req, res) => {
    try {
      const jobId = req.params.id;
      const { title, description, experience, techStack, qualification } = req.body;
  
      if (!title || !description || !experience || !techStack || !qualification) {
        return res.status(400).json({ success: false, message: "All fields are required" });
      }
  
      const updatedJob = await jobModel.findByIdAndUpdate(
        jobId,
        {
          title,
          description,
          experience,
          techStack,
          qualification
        },
        { new: true, runValidators: true }
      );
  
      if (!updatedJob) {
        return res.status(404).json({ success: false, message: "Job not found" });
      }
  
      res.json({ success: true, message: "Job profile updated", job: updatedJob });
    } catch (error) {
      console.error("Error updating job profile:", error);
      res.status(500).json({ success: false, message: "Failed to update job profile" });
    }
  };
  
  const deleteJob = async (req, res) => {
    try {
      const job = await jobModel.findByIdAndDelete(req.params.id);
      if (!job) {
        return res.status(404).json({ success: false, message: "Job not found" });
      }
      res.json({ success: true, message: "Job deleted" });
    } catch (error) {
      console.error("Error deleting job:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  

// API to get dashboard data for HR/admin panel
const jobDashboard = async (req, res) => {
    try {
        const { jobId } = req.body;

        const applications = await applicationModel.find({ jobId });

        let totalEarnings = 0;
        applications.forEach((app) => {
            if (app.isCompleted || app.payment) {
                totalEarnings += app.amount || 0;
            }
        });

        const uniqueApplicants = new Set(applications.map((app) => app.userId));

        const dashboardData = {
            earnings: totalEarnings,
            totalApplications: applications.length,
            totalApplicants: uniqueApplicants.size,
            latestApplications: applications.reverse(),
        };

        res.json({ success: true, dashboardData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export {
    applicationsForJob,
    getAllApplicationsForAdmin,
    cancelApplication,
    completeApplication,
    jobLists,
    applyForJob,
    toggleJobAvailability,
    jobProfile,
    updateJobProfile,
    deleteJob,
    jobDashboard,
};
