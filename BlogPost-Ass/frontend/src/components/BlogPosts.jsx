import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./BlogPosts.css";

// BlogCard component with Read More functionality
const BlogCard = ({ post, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  // You can adjust this threshold based on your content length
  const shouldShowToggle = post.content.length > 200;

  return (
    <div className="blog-card">
      <h3 className="blog-heading">{post.title}</h3>
      <p className={`blog-content ${expanded ? "expanded" : "collapsed"}`}>
        {post.content}
      </p>
      {shouldShowToggle && (
        <span className="read-more" onClick={toggleExpanded}>
          {expanded ? "Read Less" : "Read More"}
        </span>
      )}
      <div className="button-group">
        <button className="edit-btn" onClick={() => onEdit(post)}>
          Edit
        </button>
        <button className="delete-btn" onClick={() => onDelete(post._id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

const BlogPosts = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.userId || decoded._id || decoded.id);
      } catch (err) {
        console.error("Invalid token:", err);
        setUserId(null);
      }
    } else {
      setUserId(null);
    }
  }, [token]);

  useEffect(() => {
    if (userId) {
      fetchPosts();
    }
  }, [userId]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`/api/posts/${userId}`);
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts", error);
      setError("Failed to fetch posts.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("You must be logged in to create or update posts.");
      return;
    }

    try {
      if (editingId) {
        const response = await axios.put(
          `/api/posts/${editingId}`,
          { title, content },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPosts((prev) =>
          prev.map((post) =>
            post._id === editingId ? response.data.post : post
          )
        );
        setEditingId(null);
      } else {
        const response = await axios.post(
          "/api/posts",
          { title, content, userId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPosts([...posts, response.data.post]);
      }
      setTitle("");
      setContent("");
      setError("");
    } catch (error) {
      console.error("Error saving post", error);
      setError("Failed to save post. Please try again.");
    }
  };

  const handleEdit = (post) => {
    setEditingId(post._id);
    setTitle(post.title);
    setContent(post.content);
  };

  const handleDelete = async (id) => {
    if (!token) {
      setError("You must be logged in to delete posts.");
      return;
    }

    try {
      await axios.delete(`/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((post) => post._id !== id));
    } catch (error) {
      console.error("Error deleting post", error);
      setError("Failed to delete post.");
    }
  };

  return (
    <div className="blog-container">
      <h2 className="blog-title">📝 Manage Your Blog Posts</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="blog-form">
        <input
          type="text"
          placeholder="Enter Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Enter Blog Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit" className="submit-btn">
          {editingId ? "Update Post" : "Create Post"}
        </button>
      </form>
      <div className="blog-grid">
        {posts.map((post) => (
          <BlogCard
            key={post._id}
            post={post}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default BlogPosts;
