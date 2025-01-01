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

const updateCounsellingRequestStatus = async (req, res) => {
  try {
    const { id } = req.params; // Extract the request ID from URL params
    const { status } = req.body; // Extract the new status from the request body

    // Check if the provided status is valid
    const validStatuses = ["pending", "in-progress", "completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed statuses are: ${validStatuses.join(", ")}.`,
      });
    }

    // Find and update the counselling request
    const updatedRequest = await CounsellingRequest.findOneAndUpdate(
      { _id: id, user: req.user._id }, // Ensure the request belongs to the authenticated user
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedRequest) {
      return res.status(404).json({
        success: false,
        message: "Counselling request not found or not authorized.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Counselling request status updated successfully.",
      data: updatedRequest,
    });
  } catch (error) {
    console.error("Error while updating counselling request status:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating counselling request status.",
    });
  }
};
const updateCounsellingDetails = async (req, res) => {
  try {
    const { id } = req.params; // Counselling request ID
    const { scheduledDateTime, scheduledPlace, authorityReason, status } = req.body;

    // Check if the user is an authority
    if (req.user.userType !== "authority") {
      return res.status(403).json({ message: "Not authorized to access this route" });
    }

    if (status === "rejected" && !authorityReason) {
      return res.status(400).json({
        success: false,
        message: "A valid reason must be provided when rejecting a request.",
      });
    }

    // Update the counselling request
    const updatedRequest = await CounsellingRequest.findByIdAndUpdate(
      id,
      {
        status,
        scheduledDateTime,
        scheduledPlace,
        authorityReason: status === "rejected" ? authorityReason : null,
      },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({
        success: false,
        message: "Counselling request not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Counselling request updated successfully.",
      data: updatedRequest,
    });
  } catch (error) {
    console.error("Error while updating counselling details:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating counselling details.",
    });
  }
};


const getAllCounsellingRequests = async (req, res) => {
  try {
    if(req.user.userType !== "authority"){
      return res.status(403).json({ message: 'Not authorized to access this route' });
    }

    // Fetch all counselling requests for the authenticated user
    const requests = await CounsellingRequest.find({});

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


module.exports = { createCounsellingRequest, getCounsellingRequests , updateCounsellingRequestStatus, getAllCounsellingRequests, updateCounsellingDetails};
