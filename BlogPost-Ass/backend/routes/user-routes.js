const express = require("express");
const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const userModel = require("../models/user-schema");
const postModel = require("../models/post-schema");
const user = require("../models/user-schema");

const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = Jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to request
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
};

// 📌 REGISTER User (POST /api/register)
router.post(
  "/register",
  [
    body("email").trim().isEmail(),
    body("password").trim().isLength({ min: 6 }),
    body("username").trim().isLength({ min: 4 }),
  ],
  async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Invalid data", errors: errors.array() });
    }

    const { username, password, email } = req.body;

    try {
      // Check for existing user
      const existingUser = await userModel.findOne({
        $or: [{ username }, { email }],
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Username or Email already exists" });
      }

      // Hash password and create user

      const newUser = await userModel.create({
        username,
        email,
        password,
      });

      res
        .status(201)
        .json({ message: "User registered successfully", user: newUser });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

// 📌 LOGIN User (POST /api/login)
router.post(
  "/login",
  [
    body("username").trim().isLength({ min: 4 }),
    body("password").trim().isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Invalid data", errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      const user = await userModel.findOne({ username });

      if (!user) {
        return res.status(400).json({ message: "Username is incorrect" });
      }

      const isPasswordValid = await userModel.findOne({ password });

      if (!isPasswordValid) {
        return res.status(400).json({ message: "Password is incorrect" });
      }
      // Generate JWT token
      const token = Jwt.sign(
        { userId: user._id, email: user.email, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.json({ message: "Login successful", token });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

// 📌 CREATE Post (POST /api/posts) - Requires authentication
router.post("/posts", verifyToken, async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  try {
    const newPost = await postModel.create({
      userId: req.user.userId, // Use logged-in user's ID
      title,
      content,
    });
    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// 📌 GET All Posts (GET /api/posts)
router.get("/posts", async (req, res) => {
  try {
    const posts = await postModel.find();
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/posts/:userId", async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from request params

    const posts = await postModel.find({ userId }); // Fetch only posts of this user
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server Error" });
  }
});
// 📌 UPDATE Post (PUT /api/posts/:id) - Requires authentication
router.put("/posts/:id", verifyToken, async (req, res) => {
  const { title, content } = req.body;

  try {
    const post = await postModel.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.userId.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this post" });
    }

    // Update fields
    post.title = title || post.title;
    post.content = content || post.content;
    const updatedPost = await post.save();

    res.json({ message: "Post updated successfully", post: updatedPost });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// 📌 DELETE Post (DELETE /api/posts/:id) - Requires authentication
router.delete("/posts/:id", verifyToken, async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.userId.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this post" });
    }

    await postModel.deleteOne({ _id: req.params.id });

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
