import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  const isLoggedIn = Boolean(token && userData);

  const getInitial = (name) => {
    return name?.charAt(0)?.toUpperCase() || "U";
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg bg-light fixed-top shadow-sm">
      <div className="container-fluid d-flex justify-content-between align-items-center px-3">
        <Link
          to={isLoggedIn ? "/dashboard" : "/login"}
          className="navbar-brand fw-bold text-primary"
        >
          TECHWORLD
        </Link>

        {/* Right-side area */}
        <div className="d-flex align-items-center gap-3">
          {isLoggedIn && (
            <div className="position-relative" ref={dropdownRef}>
              <div
                className="d-flex align-items-center gap-2 cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {userData?.image ? (
                  <img
                    src={userData.image}
                    alt="User"
                    className="rounded-circle"
                    style={{
                      width: "32px",
                      height: "32px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center"
                    style={{
                      width: "32px",
                      height: "32px",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {getInitial(userData?.name || userData?.email)}
                  </div>
                )}
                <img
                  src={assets.dropdown_icon}
                  alt="Dropdown Icon"
                  style={{ width: "10px" }}
                />
              </div>

              {dropdownOpen && (
                <div className="position-absolute end-0 mt-2 p-2 bg-white border rounded shadow-sm z-50" style={{ width: "170px" }}>
                  <div className="d-flex flex-column text-sm text-dark gap-2">
                    <p onClick={() => navigate("/my-profile")} className="mb-1 cursor-pointer hover-text-primary">
                      My Profile
                    </p>
                    <p onClick={() => navigate("/my-job-applications")} className="mb-1 cursor-pointer hover-text-primary">
                      My Applications
                    </p>
                    <p onClick={logout} className="mb-0 cursor-pointer hover-text-danger">
                      Logout
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
