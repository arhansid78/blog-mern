import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./UserProfile.css";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  // Get logged-in user's id from token
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.userId || decoded._id || decoded.id;
        fetchUserProfile(userId);
        fetchUserBlogs(userId);
      } catch (err) {
        console.error("Invalid token:", err);
        setError("Invalid token. Please log in again.");
      }
    } else {
      setError("You are not logged in.");
    }
  }, [token]);

  // Fetch user profile info
  const fetchUserProfile = async (userId) => {
    try {
      const response = await axios.get(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile.");
    }
  };

  // Fetch user blogs
  const fetchUserBlogs = async (userId) => {
    try {
      const response = await axios.get(`/api/posts/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(response.data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Failed to load blogs.");
    }
  };

  const handleDeleteBlog = async (blogId) => {
    try {
      await axios.delete(`/api/posts/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(blogs.filter((blog) => blog._id !== blogId));
    } catch (err) {
      console.error("Error deleting blog:", err);
      setError("Failed to delete blog.");
    }
  };

  // Placeholder for edit - you might redirect to an edit page or open a modal.
  const handleEditBlog = (blog) => {
    // Redirect to edit blog page, or toggle an inline form.
    console.log("Edit blog:", blog);
  };

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!profile) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="user-profile-container">
      <div className="profile-info">
        {profile.avatar && (
          <img
            src={profile.avatar}
            alt={`${profile.name}'s avatar`}
            className="profile-avatar"
          />
        )}
        <h2 className="profile-name">{profile.name}</h2>
        <p className="profile-email">{profile.email}</p>
      </div>

      <div className="profile-blogs">
        <h3>Your Blogs</h3>
        {blogs.length > 0 ? (
          <div className="blogs-grid">
            {blogs.map((blog) => (
              <div key={blog._id} className="blog-card">
                <h4 className="blog-title">{blog.title}</h4>
                {blog.imageUrl && (
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="blog-image"
                  />
                )}
                <p className="blog-content">{blog.content}</p>
                <div className="button-group">
                  <button
                    className="edit-btn"
                    onClick={() => handleEditBlog(blog)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteBlog(blog._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>You have not written any blogs yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
