var express = require('express');
var router = express.Router();
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var userModel = require("../models/userModel");
var projectModel = require("../models/projectModel");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/test", (req, res) => {
  res.json({ message: "API is working!" });
});

const secret = process.env.JWT_SECRET || "secret"; // Use environment variable for JWT secret

// SignUp Route
router.post("/signUp", async (req, res) => {
  let { username, name, email, password } = req.body;
  try {
    const emailCon = await userModel.findOne({ email });
    if (emailCon) {
      return res.json({ success: false, message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      username,
      name,
      email,
      password: hashedPassword,
    });

    return res.json({ success: true, message: "User created successfully" });

  } catch (err) {
    return res.json({ success: false, message: "Error creating user", error: err });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  try {
    let user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ email: user.email, userId: user._id }, secret);
      return res.json({ success: true, message: "User logged in successfully", token, userId: user._id });
    } else {
      return res.json({ success: false, message: "Invalid email or password" });
    }

  } catch (err) {
    return res.json({ success: false, message: "An error occurred during login", error: err });
  }
});

// Get User Details
router.post("/getUserDetails", async (req, res) => {
  const { userId } = req.body;
  try {
    let user = await userModel.findOne({ _id: userId });

    if (user) {
      return res.json({ success: true, message: "User details fetched successfully", user });
    } else {
      return res.json({ success: false, message: "User not found!" });
    }
  } catch (err) {
    return res.json({ success: false, message: "Error fetching user details", error: err });
  }
});

// Create Project
router.post("/createProject", async (req, res) => {
  const { userId, title } = req.body;
  try {
    let user = await userModel.findOne({ _id: userId });

    if (user) {
      let project = await projectModel.create({
        title,
        createdBy: userId
      });

      return res.json({ success: true, message: "Project created successfully", projectId: project._id });
    } else {
      return res.json({ success: false, message: "User not found!" });
    }

  } catch (err) {
    return res.json({ success: false, message: "Error creating project", error: err });
  }
});

// Get User Projects
router.post("/getProjects", async (req, res) => {
  const { userId } = req.body;
  try {
    let user = await userModel.findOne({ _id: userId });

    if (user) {
      let projects = await projectModel.find({ createdBy: userId });
      return res.json({ success: true, message: "Projects fetched successfully", projects });
    } else {
      return res.json({ success: false, message: "User not found!" });
    }
  } catch (err) {
    return res.json({ success: false, message: "Error fetching projects", error: err });
  }
});

// Delete Project
router.post("/deleteProject", async (req, res) => {
  const { userId, projId } = req.body;
  try {
    let user = await userModel.findOne({ _id: userId });

    if (user) {
      await projectModel.findOneAndDelete({ _id: projId });
      return res.json({ success: true, message: "Project deleted successfully" });
    } else {
      return res.json({ success: false, message: "User not found!" });
    }
  } catch (err) {
    return res.json({ success: false, message: "Error deleting project", error: err });
  }
});

// Get Project by ID
router.post("/getProject", async (req, res) => {
  const { userId, projId } = req.body;
  try {
    let user = await userModel.findOne({ _id: userId });

    if (user) {
      let project = await projectModel.findOne({ _id: projId });
      return res.json({ success: true, message: "Project fetched successfully", project });
    } else {
      return res.json({ success: false, message: "User not found!" });
    }
  } catch (err) {
    return res.json({ success: false, message: "Error fetching project", error: err });
  }
});

// Update Project
router.post("/updateProject", async (req, res) => {
  const { userId, htmlCode, cssCode, jsCode, projId } = req.body;
  try {
    let user = await userModel.findOne({ _id: userId });

    if (user) {
      let project = await projectModel.findOneAndUpdate(
        { _id: projId },
        { htmlCode, cssCode, jsCode },
        { new: true }
      );

      if (project) {
        return res.json({ success: true, message: "Project updated successfully" });
      } else {
        return res.json({ success: false, message: "Project not found!" });
      }
    } else {
      return res.json({ success: false, message: "User not found!" });
    }
  } catch (err) {
    return res.json({ success: false, message: "Error updating project", error: err });
  }
});

module.exports = router;
