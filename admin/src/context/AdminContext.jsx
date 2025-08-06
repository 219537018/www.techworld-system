import axios from "axios";
import { createContext, useState, useCallback } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const backendUrl = "http://localhost:4000";

  const [aToken, setAToken] = useState(localStorage.getItem('aToken') || '');

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [dashData, setDashData] = useState(false);

  // Get all published jobs
  const getAllPublishedJobs = async () => {
    try {
      const token = aToken || localStorage.getItem('aToken');
      const res = await axios.get(`${backendUrl}/api/admin/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (res.data.success) {
        setJobs(res.data.jobs); // update context state
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  
  // Change job availability (e.g., active/inactive)
  const changeJobAvailability = async (jobId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/change-job-availability`,
        { jobId },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllPublishedJobs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Get all job applications
  const getAllApplications = useCallback(async () => {
    try {
      console.log("📡 Sending request to get applications..."); 
      const res = await axios.get("http://localhost:4000/api/admin/get-applications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      if (res.data.success) {
        console.log("✅ Applications fetched:", res.data.applications); // Add this
        setApplications(res.data.applications);
      }
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    }
  }, []); // ✅ now it's memoized


  // Cancel application
  const cancelApplication = async (applicationId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/cancel-application`,
        { applicationId },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllApplications();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  // Admin dashboard data
  const getDashData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {
        headers: { aToken }
      });

      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const value = {
    aToken, setAToken,
    jobs,
    getAllPublishedJobs,
    changeJobAvailability,
    applications,
    getAllApplications,
    cancelApplication,
    dashData,
    getDashData,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
