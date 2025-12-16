import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  userId: mongoose.Types.ObjectId;
  applicationType: 'passport-first' | 'passport-replacement' | 'nationalid-first' | 'nationalid-replacement';
  status: 'pending' | 'in-progress' | 'approved' | 'rejected' | 'collected';
  confirmationNumber: string;
  
  // Applicant Details
  applicantType?: 'above18' | 'below18';
  nationalIdNumber?: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: Date;
  gender: 'male' | 'female';
  nationality: string;
  fatherName: string;
  motherName: string;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  profession?: string;
  employer?: string;
  height?: number;
  otherNationality?: string;
  otherPassportNumber?: string;
  
  // Contact Details
  phoneNumber: string;
  email: string;
  country: string;
  state: string;
  city: string;
  placeOfResidence: string;
  
  // Birth Location
  birthCountry: string;
  birthState: string;
  birthCity: string;
  
  // Passport Specific
  passportType?: '2-year' | '5-year' | '10-year';
  travelPurpose?: string;
  destinationCountry?: string;
  destinationCity?: string;
  
  // Replacement Specific
  replacementReason?: 'lost' | 'stolen' | 'damaged' | 'expired' | 'correction';
  
  // Attachments
  attachments: {
    photo?: string;
    idCopy?: string;
    signature?: string;
    birthCertificate?: string;
    oldDocument?: string;
    policeReport?: string;
    civilRegistryNumber?: string;
  };
  
  // Payment
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentAmount?: number;
  paymentDate?: Date;
  
  // Admin Actions
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  rejectionReason?: string;
  approvedPdfPath?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  applicationType: { 
    type: String, 
    enum: ['passport-first', 'passport-replacement', 'nationalid-first', 'nationalid-replacement'],
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'approved', 'rejected', 'collected'],
    default: 'pending'
  },
  confirmationNumber: { type: String, required: true, unique: true },
  
  applicantType: { type: String, enum: ['above18', 'below18'] },
  nationalIdNumber: String,
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  middleName: String,
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['male', 'female'], required: true },
  nationality: { type: String, required: true },
  fatherName: { type: String, required: true },
  motherName: { type: String, required: true },
  maritalStatus: { type: String, enum: ['single', 'married', 'divorced', 'widowed'], required: true },
  profession: String,
  employer: String,
  height: Number,
  otherNationality: String,
  otherPassportNumber: String,
  
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  placeOfResidence: { type: String, required: true },
  
  birthCountry: { type: String, required: true },
  birthState: { type: String, required: true },
  birthCity: { type: String, required: true },
  
  passportType: { type: String, enum: ['2-year', '5-year', '10-year'] },
  travelPurpose: String,
  destinationCountry: String,
  destinationCity: String,
  
  replacementReason: { type: String, enum: ['lost', 'stolen', 'damaged', 'expired', 'correction'] },
  
  attachments: {
    photo: String,
    idCopy: String,
    signature: String,
    birthCertificate: String,
    oldDocument: String,
    policeReport: String,
    civilRegistryNumber: String
  },
  
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  paymentAmount: Number,
  paymentDate: Date,
  
  reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: Date,
  rejectionReason: String,
  approvedPdfPath: String
}, {
  timestamps: true
});

export default mongoose.model<IApplication>('Application', applicationSchema);
