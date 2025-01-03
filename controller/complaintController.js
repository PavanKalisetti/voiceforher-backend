const asyncHandler = require('express-async-handler');
const Complaint = require('../model/complaintScheme');


const raiseComplaintController = asyncHandler(async (req, res) => {
  const {
    subject,
    description,
    category,
    location,
    dateOfIncident,
    isAnonymous,
  } = req.body;

  
  if (!subject || !description || !category || !location || !dateOfIncident) {
    return res
      .status(400)
      .json({ message: 'All fields except name are required' });
  }

  
  const complaintData = {
    userId: req.user._id,
    email: req.user.email, 
    subject,
    description,
    category,
    location,
    dateOfIncident: new Date(dateOfIncident),
    isAnonymous,
  };

  console.log("debug test "+ isAnonymous);
 

  
  if (isAnonymous) {
    complaintData.name = 'Anonymous';
  } else {
    complaintData.name = req.user.username; 
  }
  console.log("debug test: " + req.user.username);
  

  try {
    
    const newComplaint = await Complaint.create(complaintData);

    res.status(201).json({
      message: 'Complaint raised successfully',
      complaint: newComplaint,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to raise complaint', error });
  }
});


const fetchComplaintsController = asyncHandler(async (req, res) => {
  const { userType, _id: userId, authorityType } = req.user;

  try {
    let complaints;

    

    if (userType === 'authority') {
      
      complaints = await Complaint.find({}).sort("-createdAt");;
    } else if (userType === 'girlUser') {
      
      complaints = await Complaint.find({ userId });
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json({ message: 'Complaints fetched successfully', complaints });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch complaints', error });
  }
}
);

const markComplaintAsSolved = asyncHandler(async (req, res) => {
  const { complaintId } = req.params;

  try {
    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    
    complaint.status = true;
    await complaint.save();

    res.status(200).json({ message: 'Complaint marked as solved', complaint });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update complaint status', error });
  }
});







module.exports = {raiseComplaintController, fetchComplaintsController, markComplaintAsSolved};
