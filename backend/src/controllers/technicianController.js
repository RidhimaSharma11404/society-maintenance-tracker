const Technician = require('../models/Technician');
const Complaint = require('../models/Complaint');

exports.getAllTechnicians = async (req, res, next) => {
  try {
    const technicians = await Technician.find().sort({ status: 1, name: 1 }).lean();
    res.json({ success: true, technicians });
  } catch (err) {
    next(err);
  }
};

exports.dispatchTechnician = async (req, res, next) => {
  try {
    const { technicianId, complaintId } = req.body;

    const technician = await Technician.findById(technicianId);
    if (!technician) {
      return res.status(404).json({ error: 'Technician not found.' });
    }

    technician.status = 'On Job';
    technician.activeJobsCount += 1;
    await technician.save();

    if (complaintId) {
      const complaint = await Complaint.findById(complaintId);
      if (complaint) {
        complaint.assignedStaff = technician._id;
        complaint.statusHistory.push({
          status: complaint.currentStatus,
          changedBy: req.user._id,
          comment: `Contractor Dispatched: ${technician.name} (${technician.company}) assigned for inspection.`
        });
        await complaint.save();
      }
    }

    res.json({
      success: true,
      technician,
      message: `Technician ${technician.name} dispatched successfully.`
    });
  } catch (err) {
    next(err);
  }
};
