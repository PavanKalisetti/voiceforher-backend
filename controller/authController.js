const asyncHandler = require('express-async-handler'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/userScheme'); 


const RegisterController = asyncHandler(async (req, res) => {
    const { username, email, password, userType, authorityType, phoneNumber, education } = req.body;
    if (!username || !email || !password || !userType || (userType === "girlUser" && !phoneNumber && !education)) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }
  
    
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
  
    
    const newUser = new User({
      username,
      email,
      password,
      userType,
      phoneNumber: phoneNumber || undefined, 
      education: userType === "girlUser" ? education : undefined, 
      authorityType: userType === "authority" ? authorityType : undefined, 
      isApproved: userType === "girlUser" ? true : false, 
    });
  
    
    await newUser.save();
  
    
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
  


const LoginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  
  if (!email || !password) {
    return res.status(400).json({ message: "Please provide both email and password" });
  }

  
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  
  const token = jwt.sign(
    { userId: user._id, userType: user.userType, username: user.username, email: user.email, authorityType: user.authorityType},
    process.env.JWT_SECRET, 
    { expiresIn: "30d" }
  );
  

  
  res.status(200).json({
  message: "Login successful",
  token,
  userType: user.userType, 
});

});

module.exports = { RegisterController, LoginController };
