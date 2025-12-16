import { Response } from 'express';
import Application from '../models/Application.model';
import { AuthRequest } from '../middleware/auth.middleware';

const generateConfirmationNumber = () => {
  const prefix = 'SS-IMM';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
};

export const createApplication = async (req: AuthRequest, res: Response) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    const attachments: any = {};
    if (files.photo) attachments.photo = files.photo[0].path;
    if (files.idCopy) attachments.idCopy = files.idCopy[0].path;
    if (files.signature) attachments.signature = files.signature[0].path;
    if (files.birthCertificate) attachments.birthCertificate = files.birthCertificate[0].path;
    if (files.oldDocument) attachments.oldDocument = files.oldDocument[0].path;
    if (files.policeReport) attachments.policeReport = files.policeReport[0].path;
    
    const confirmationNumber = generateConfirmationNumber();
    
    const application = await Application.create({
      ...req.body,
      userId: req.user.id,
      confirmationNumber,
      attachments,
      paymentStatus: 'pending'
    });
    
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      confirmationNumber,
      application
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyApplications = async (req: AuthRequest, res: Response) => {
  try {
    const applications = await Application.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json({ success: true, applications });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getApplicationById = async (req: AuthRequest, res: Response) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    res.json({ success: true, application });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
