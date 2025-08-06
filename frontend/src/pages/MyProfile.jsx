import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const MyProfile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const { token, backendUrl, userData, loadUserProfileData } = useContext(AppContext);
  const [localUserData, setLocalUserData] = useState(null);

  useEffect(() => {
    if (userData) {
      setLocalUserData({ ...userData }); // shallow copy is sufficient here
    }
  }, [userData]);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
        formData.append('userId', localUserData._id); // ✅ Add this line
        formData.append('name', localUserData.name);
        formData.append('phone', localUserData.phone);
        formData.append('address', JSON.stringify(localUserData.address));
        formData.append('gender', localUserData.gender);
        formData.append('dob', localUserData.dob);

      if (image) formData.append('image', image);

      const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, formData, {
        headers: { token },
      });

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData(); // update global user data
        setIsEdit(false);
        setImage(null);
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || error.message || 'Update failed');
    }
  };

  if (!localUserData) return null;

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow rounded text-sm flex flex-col gap-4">
      <div className="flex items-center justify-center">
        {isEdit ? (
          <label htmlFor="image" className="cursor-pointer relative">
            <img
              src={image ? URL.createObjectURL(image) : localUserData.image}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full border-2 border-gray-300"
            />
            {!image && (
              <img
                src={assets.upload_icon}
                alt="Upload"
                className="w-8 absolute bottom-2 right-2"
              />
            )}
            <input
              id="image"
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
        ) : (
          <img
            src={userData.image}
            alt="Profile"
            className="w-32 h-32 object-cover rounded-full border-2 border-gray-300"
          />
        )}
      </div>

      <div className="text-center">
        {isEdit ? (
          <input
            className="text-2xl font-semibold text-center border-b w-full"
            value={localUserData.name}
            onChange={(e) => setLocalUserData({ ...localUserData, name: e.target.value })}
          />
        ) : (
          <p className="text-2xl font-semibold">{userData.name}</p>
        )}
      </div>

      <div>
        <h2 className="text-gray-600 underline">Contact Information</h2>
        <div className="mt-2 space-y-2 text-gray-700">
          <div>
            <p className="font-medium">Email:</p>
            <p className="text-blue-600">{userData.email}</p>
          </div>

          <div>
            <p className="font-medium">Phone:</p>
            {isEdit ? (
              <input
                className="w-full border rounded px-2 py-1"
                value={localUserData.phone}
                onChange={(e) => setLocalUserData({ ...localUserData, phone: e.target.value })}
              />
            ) : (
              <p className="text-blue-600">{userData.phone}</p>
            )}
          </div>

          <div>
            <p className="font-medium">Address:</p>
            {isEdit ? (
              <>
                <input
                  className="w-full border rounded px-2 py-1 mb-1"
                  value={localUserData.address.line1}
                  onChange={(e) =>
                    setLocalUserData({
                      ...localUserData,
                      address: { ...localUserData.address, line1: e.target.value },
                    })
                  }
                />
                <input
                  className="w-full border rounded px-2 py-1"
                  value={localUserData.address.line2}
                  onChange={(e) =>
                    setLocalUserData({
                      ...localUserData,
                      address: { ...localUserData.address, line2: e.target.value },
                    })
                  }
                />
              </>
            ) : (
              <p>
                {userData.address.line1} <br /> {userData.address.line2}
              </p>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-gray-600 underline">Basic Information</h2>
        <div className="mt-2 space-y-2 text-gray-700">
          <div>
            <p className="font-medium">Gender:</p>
            {isEdit ? (
              <select
                className="border rounded px-2 py-1"
                value={localUserData.gender}
                onChange={(e) => setLocalUserData({ ...localUserData, gender: e.target.value })}
              >
                <option value="Not Selected">Not Selected</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <p>{userData.gender}</p>
            )}
          </div>

          <div>
            <p className="font-medium">Birthday:</p>
            {isEdit ? (
              <input
                type="date"
                className="border rounded px-2 py-1"
                value={localUserData.dob}
                onChange={(e) => setLocalUserData({ ...localUserData, dob: e.target.value })}
              />
            ) : (
              <p>{userData.dob}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        {isEdit ? (
          <button
            onClick={updateUserProfileData}
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className="border border-blue-600 text-blue-600 px-6 py-2 rounded-full hover:bg-blue-600 hover:text-white"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
