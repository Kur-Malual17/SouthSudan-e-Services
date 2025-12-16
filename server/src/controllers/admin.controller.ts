import { Response } from 'express';
import Application from '../models/Application.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { generateApplicationPDF } from '../utils/pdf.generator';
import { sendApprovalEmail } from '../utils/email.service';

export const getAllApplications = async (req: AuthRequest, res: Response) => {
  try {
    const { status, applicationType, page = 1, limit = 20 } = req.query;
    
    const query: any = {};
    if (status) query.status = status;
    if (applicationType) query.applicationType = applicationType;
    
    const applications = await Application.find(query)
      .populate('userId', 'firstName lastName email phoneNumber')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    
    const total = await Application.countDocuments(query);
    
    res.json({
      success: true,
      applications,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getApplicationById = async (req: AuthRequest, res: Response) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('userId', 'firstName lastName email phoneNumber')
      .populate('reviewedBy', 'firstName lastName');
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    res.json({ success: true, application });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateApplicationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status, reviewedBy: req.user.id, reviewedAt: new Date() },
      { new: true }
    );
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    res.json({ success: true, application });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const approveApplication = async (req: AuthRequest, res: Response) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('userId', 'firstName lastName email phoneNumber');
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    if (application.paymentStatus !== 'completed') {
      return res.status(400).json({ message: 'Payment not completed' });
    }
    
    // Generate PDF
    const pdfPath = await generateApplicationPDF(application);
    
    // Update application
    application.status = 'approved';
    application.reviewedBy = req.user.id;
    application.reviewedAt = new Date();
    application.approvedPdfPath = pdfPath;
    await application.save();
    
    // Send email notification
    await sendApprovalEmail(application);
    
    res.json({
      success: true,
      message: 'Application approved and email sent',
      application
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectApplication = async (req: AuthRequest, res: Response) => {
  try {
    const { reason } = req.body;
    
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      {
        status: 'rejected',
        rejectionReason: reason,
        reviewedBy: req.user.id,
        reviewedAt: new Date()
      },
      { new: true }
    );
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    res.json({ success: true, application });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getStatistics = async (req: AuthRequest, res: Response) => {
  try {
    const totalApplications = await Application.countDocuments();
    const pending = await Application.countDocuments({ status: 'pending' });
    const approved = await Application.countDocuments({ status: 'approved' });
    const rejected = await Application.countDocuments({ status: 'rejected' });
    const collected = await Application.countDocuments({ status: 'collected' });
    
    const passportFirst = await Application.countDocuments({ applicationType: 'passport-first' });
    const passportReplacement = await Application.countDocuments({ applicationType: 'passport-replacement' });
    const nationalIdFirst = await Application.countDocuments({ applicationType: 'nationalid-first' });
    const nationalIdReplacement = await Application.countDocuments({ applicationType: 'nationalid-replacement' });
    
    res.json({
      success: true,
      statistics: {
        total: totalApplications,
        byStatus: { pending, approved, rejected, collected },
        byType: {
          passportFirst,
          passportReplacement,
          nationalIdFirst,
          nationalIdReplacement
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
