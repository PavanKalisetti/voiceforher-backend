const asyncHandler = require('express-async-handler'); // Ensure it's imported
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/userScheme'); // Make sure the path is correct

// Register Controller
const RegisterController = asyncHandler(async (req, res) => {
    const { username, email, password, userType, authorityType, phoneNumber, education } = req.body;
  
    // Validation
    if (!username || !email || !password || !userType || (userType === "girlUser" && !phoneNumber && !education)) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }
  
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
  
    // Create user object with all fields
    const newUser = new User({
      username,
      email,
      password,
      userType,
      phoneNumber: phoneNumber || undefined, // Optional field for all users
      education: userType === "girlUser" ? education : undefined, // Only set if userType is girlUser
      authorityType: userType === "authority" ? authorityType : undefined, // Only set for authorities
      isApproved: userType === "girlUser" ? false : true, // Default approval for girlUser as false
    });
  
    // Save the user
    await newUser.save();
  
    // Send success response
    res.status(201).json({
      message: "User registered successfully",
      success: true,
      user: {
        username: newUser.username,
        email: newUser.email,
        userType: newUser.userType,
        phoneNumber: newUser.phoneNumber,
        education: newUser.education,
        authorityType: newUser.authorityType,
        isApproved: newUser.isApproved,
      },
    });
  });
  

// Login Controller
const LoginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ message: "Please provide both email and password" });
  }

  // Check if user exists
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Compare password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id, userType: user.userType, username: user.username, email: user.email, authorityType: user.authorityType},
    process.env.JWT_SECRET, // Ensure this is set in .env file
    { expiresIn: "1d" }
  );
  

  // Send response with token
  res.status(200).json({
    message: "Login successful",
    token,
  });
});

module.exports = { RegisterController, LoginController };
