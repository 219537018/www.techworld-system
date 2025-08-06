import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Create a context
export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const backendUrl = 'http://localhost:4000'; // Your backend URL

  // Load user profile data after login
  const loadUserProfileData = useCallback(async () => {
    try {
      console.log("Token used for profile request:", localStorage.getItem("token"));

      const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setUserData(data.user); // ✅ FIXED: Use the correct key
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    }
  }, [token, loadUserProfileData]);





  const value = {
    backendUrl,
    token,
    setToken,
    userData,
    setUserData,
    loadUserProfileData,
    
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;
