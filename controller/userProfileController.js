const asyncHandler = require('express-async-handler');
const User = require('../model/userScheme');

const getUserProfile = asyncHandler(async (req, res) => {
  try {
    
    const user = await User.findById(req.user._id).select('-password -resetPasswordToken -resetPasswordExpire'); 

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
    
    if (req.user.userType !== 'authority') {
      return res.status(403).json({ message: 'Access denied. Only authorities can access this route.' });
    }

    
    const authority = await User.findById(req.user._id);

    if (!authority) {
      return res.status(404).json({ message: 'Authority not found' });
    }

    
    if (!authority.isApproved) {
      
      return res.status(403).json({ message: 'Access denied. Authority is not allowed.' });
    }

    
    const users = await User.find().select('-password -resetPasswordToken -resetPasswordExpire'); fields

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
    
    const user = await User.findByIdAndUpdate(
      userId,
      { isApproved: true},  
      { new: true }         
    );
    

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
  const { emergencyContacts } = req.body;
  const userId = req.user._id;
  
    try {
    
    if (!Array.isArray(emergencyContacts) || emergencyContacts.length === 0) {
      return res.status(400).json({
        success: false,
        message: "atleast one Emergency Contact needed",
      });
    }

    
    for (const contact of emergencyContacts) {
      if (
        !contact.name ||
        !contact.phone ||
        !contact.relation ||
        !/^\d{10}$/.test(contact.phone)
      ) {
        return res.status(400).json({
          success: false,
          message: "Each contact must have a valid name, 10-digit phone, and relation.",
        });
      }
    }

    
    const user = await User.findByIdAndUpdate(
      userId,
      { emergencyContacts },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Emergency contacts updated successfully.",
      data: user.emergencyContacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while updating emergency contacts.",
    });
  }
});

const getEmergencyContacts = asyncHandler(async (req, res) => {
  try {
    
    const user = await User.findById(req.user._id).select('emergencyContacts'); 

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
})





module.exports = {
  getUserProfile,
  getAllUserProfile,
  approveUser,
  updateEmergencyContacts,
  getEmergencyContacts,

}
