import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Listen for changes in localStorage
  useEffect(() => {
    const checkAuth = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  // Show toast if already signed in
  useEffect(() => {
    if (localStorage.getItem("token")) {
      toast.info("You are already signed in!", {
        position: "bottom-left", // 👈 Set toast to appear at the bottom left
        autoClose: 2000,
      });
    }
  }, []);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    setToken(null); // Update state
    toast.success("You have successfully logged out!", {
      position: "bottom-left", // 👈 Set toast to appear at the bottom left
      autoClose: 2000,
    });

    setTimeout(() => navigate("/"), 100); // Redirect after 1.5s
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <NavLink
          to="/"
          style={{
            textDecoration: "none",
            color: "#fff",
            fontSize: "24px",
            fontWeight: "bold",
            padding: "10px",
          }}
        >
          <span
            className="navbar-logo"
            style={{
              backgroundColor: "#007bff",
              padding: "5px 10px",
              borderRadius: "5px",
            }}
          >
            Blogs
          </span>
        </NavLink>
      </div>
      <div className="navbar-right">
        {localStorage.getItem("token") ? (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <NavLink to="/login">
            <button className="sign-in-btn">Sign In</button>
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
