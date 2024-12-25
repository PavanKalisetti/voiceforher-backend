const asyncHandler = require('express-async-handler');
const User = require('../model/userScheme');

const getUserProfile = asyncHandler(async (req, res) => {
  try {
    // Fetch the user profile from the database
    const user = await User.findById(req.user._id).select('-password -resetPasswordToken -resetPasswordExpire'); // Exclude sensitive fields

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
);

const getAllUserProfile = asyncHandler(async (req, res) => {
  try {
    // Check if the requesting user is an authority
    if (req.user.userType !== 'authority') {
      return res.status(403).json({ message: 'Access denied. Only authorities can access this route.' });
    }

    // Fetch the authority's details from the database
    const authority = await User.findById(req.user._id);

    if (!authority) {
      return res.status(404).json({ message: 'Authority not found' });
    }

    // Check if the authority is allowed
    if (!authority.isApproved) {
      // console.log(authority.username);
      return res.status(403).json({ message: 'Access denied. Authority is not allowed.' });
    }

    // Retrieve all users from the database
    const users = await User.find().select('-password -resetPasswordToken -resetPasswordExpire'); // Exclude sensitive fields

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
);

module.exports = {
  getUserProfile,
  getAllUserProfile,

}
