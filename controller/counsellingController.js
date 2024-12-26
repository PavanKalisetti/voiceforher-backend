const CounsellingRequest = require("../model/counsellingModel");

const createCounsellingRequest = async (req, res) => {
  try {
    // Extract necessary details from the request body
    const { reason } = req.body;
    const userId = req.user._id;  // Assuming that user is authenticated and available via req.user

    // Validate the inputs
    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Please provide the required field 'reason'.",
      });
    }

    // Create a new counselling request
    const newRequest = new CounsellingRequest({
      reason,
      user: userId,  // Link the request to the user
    });

    await newRequest.save();

    return res.status(201).json({
      success: true,
      message: "Counselling request created successfully.",
      data: newRequest,
    });
  } catch (error) {
    console.error("Error while creating counselling request:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while processing the counselling request.",
    });
  }
};

// Get all counselling requests for the authenticated user
const getCounsellingRequests = async (req, res) => {
  try {
    const userId = req.user._id;  // User ID from authentication middleware

    // Fetch all counselling requests for the authenticated user
    const requests = await CounsellingRequest.find({ user: userId });

    if (requests.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No counselling requests found for this user.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Counselling requests fetched successfully.",
      data: requests,
    });
  } catch (error) {
    console.error("Error while fetching counselling requests:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching counselling requests.",
    });
  }
};

module.exports = { createCounsellingRequest, getCounsellingRequests };
