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

const approveUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  try {
    // Find user by userId and update isApproved to true
    const user = await User.findByIdAndUpdate(
      userId,
      { isApproved: true},  // Update the isApproved field to true
      { new: true }         // Return the updated document
    );
    // console.log(user)

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({message: 'User approved successfully', data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to approve user' });
  }
});

const updateEmergencyContacts = asyncHandler(async (req, res) => {
  const { userId } = req.params; // Correct parameter name
  const { emergencyContacts } = req.body;

  console.log("Debug: Received userId from params:", userId);
  console.log("Debug: Received emergencyContacts from body:", emergencyContacts);

  // Validate emergencyContacts
  if (!Array.isArray(emergencyContacts) || emergencyContacts.length === 0) {
    console.log("Debug: Invalid emergencyContacts format.");
    return res.status(400).json({
      success: false,
      message: "Emergency contacts must be a non-empty array.",
    });
  }

  // Ensure each contact has name, phone, and relation
  for (const contact of emergencyContacts) {
    if (
      !contact.name ||
      !contact.phone ||
      !contact.relation ||
      !/^\d{10}$/.test(contact.phone)
    ) {
      console.log("Debug: Invalid contact details found:", contact);
      return res.status(400).json({
        success: false,
        message: "Each contact must have a valid name, 10-digit phone, and relation.",
      });
    }
  }

  try {
    console.log("Debug: Attempting to find user and update emergencyContacts...");
    const user = await User.findByIdAndUpdate(
      userId, // Use userId extracted from params
      { emergencyContacts },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!user) {
      console.log("Debug: User not found with userId:", userId);
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    console.log("Debug: Emergency contacts updated successfully for user:", user);
    res.status(200).json({
      success: true,
      message: "Emergency contacts updated successfully.",
      data: user.emergencyContacts,
    });
  } catch (error) {
    console.error("Debug: Error during database operation:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating emergency contacts.",
    });
  }
});

const getEmergencyContacts = asyncHandler(async (req, res) => {
  const { userId } = req.params; // Extract userId from request parameters

  console.log("Debug: Received userId from params:", userId);

  try {
    // Find the user by ID and select only the emergencyContacts field
    const user = await User.findById(userId, 'emergencyContacts');

    if (!user) {
      console.log("Debug: User not found with userId:", userId);
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    console.log("Debug: Fetched emergency contacts:", user.emergencyContacts);
    res.status(200).json({
      success: true,
      data: user.emergencyContacts,
    });
  } catch (error) {
    console.error("Debug: Error fetching emergency contacts:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching emergency contacts.",
    });
  }
})





module.exports = {
  getUserProfile,
  getAllUserProfile,
  approveUser,
  updateEmergencyContacts,
  getEmergencyContacts,

}
