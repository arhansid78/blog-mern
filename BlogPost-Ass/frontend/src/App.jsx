import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./components/Home";
import Register from "./components/Register";
import BlogPosts from "./components/BlogPosts";
import ProtectedRoute from "./components/protected/Protectedroute";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <div>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Register />} />

          {/* Protected Route for BlogPosts */}

          <Route element={<ProtectedRoute />}>
            <Route path="/blogposts" element={<BlogPosts />} />
            {/* <Route path="/userblogs" element={<UserBlogs />} /> */}
          </Route>

          {/* Redirect any unknown routes to the home page */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </>
  );
}

export default App;
