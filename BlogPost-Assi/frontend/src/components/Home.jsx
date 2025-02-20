import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import "./Home.css";

// BlogCard component to handle "Read More" functionality
const BlogCard = ({ post }) => {
  const [expanded, setExpanded] = useState(false);

  // Toggle expanded state
  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div className="public-blog-card">
      <h3 className="blog-title">{post.title}</h3>
      <p className={`blog-content ${expanded ? "expanded" : ""}`}>
        {post.content}
      </p>
      {post.content.length > 200 && ( // show toggle if content is long enough
        <span className="read-more" onClick={toggleExpanded}>
          {expanded ? "Read Less" : "Read More"}
        </span>
      )}
      <p className="author-name">By: {post.username || "Anonymous"}</p>
    </div>
  );
};

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const fetchAllPosts = async () => {
    try {
      const response = await axios.get("/api/posts"); // Fetching all posts
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to load blogs.");
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Welcome to My Blog</h1>
        <p className="home-description">
          Share your thoughts, ideas, and stories with the world. Start creating
          your blog today!
        </p>
        <NavLink to="/blogposts">
          <button className="create-blog-btn">Create Blog</button>
        </NavLink>
      </div>

      <h2 className="public-blogs-heading">📢 Latest Blogs</h2>

      {error && <p className="error-message">{error}</p>}

      <div className="public-blog-list">
        {posts.length > 0 ? (
          posts.map((post) => <BlogCard key={post._id} post={post} />)
        ) : (
          <p className="no-posts">No blogs available.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
