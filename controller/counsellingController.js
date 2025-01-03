const CounsellingRequest = require("../model/counsellingModel");

const createCounsellingRequest = async (req, res) => {
  try {
    
    const { reason } = req.body;
    const userId = req.user._id;  

    
    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Please provide the required field 'reason'.",
      });
    }

    
    const newRequest = new CounsellingRequest({
      reason,
      user: userId,  
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


const getCounsellingRequests = async (req, res) => {
  try {
    const userId = req.user._id;  

    
    const requests = await CounsellingRequest.find({ user: userId }).sort("-createdAt");

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
    const { id } = req.params; 
    const { status } = req.body; 

    
    const validStatuses = ["pending", "in-progress", "completed", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed statuses are: ${validStatuses.join(", ")}.`,
      });
    }

    console.log(id)
    
    const updatedRequest = await CounsellingRequest.findOneAndUpdate(
      { _id: id}, 
      { status },
      { new: true } 
    );
    console.log(updatedRequest);
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
    const { id } = req.params; 
    const { scheduledDate, scheduledTime, scheduledPlace, authorityReason, status } = req.body;

    
    if (req.user.userType !== "authority") {
      return res.status(403).json({ message: "Not authorized to access this route" });
    }

    if (status === "rejected" && !authorityReason) {
      return res.status(400).json({
        success: false,
        message: "A valid reason must be provided when rejecting a request.",
      });
    }

    
    const updatedRequest = await CounsellingRequest.findByIdAndUpdate(
      id,
      {
        status,
        scheduledDate,
        scheduledTime,
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

    
    const requests = await CounsellingRequest.find({}).sort("-createdAt");

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
