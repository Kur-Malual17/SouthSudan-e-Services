import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { IApplication } from '../models/Application.model';

export const generateApplicationPDF = async (application: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const pdfDir = path.join(process.cwd(), 'uploads', 'pdfs');
      if (!fs.existsSync(pdfDir)) {
        fs.mkdirSync(pdfDir, { recursive: true });
      }
      
      const filename = `application-${application.confirmationNumber}.pdf`;
      const filepath = path.join(pdfDir, filename);
      
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filepath);
      
      doc.pipe(stream);
      
      // Header
      doc.fontSize(20).text('REPUBLIC OF SOUTH SUDAN', { align: 'center' });
      doc.fontSize(16).text('DIRECTORATE OF NATIONALITY, PASSPORTS AND IMMIGRATION', { align: 'center' });
      doc.moveDown();
      doc.fontSize(14).text('APPROVED APPLICATION FORM', { align: 'center', underline: true });
      doc.moveDown(2);
      
      // Application Type
      const typeMap: any = {
        'passport-first': 'e-Passport First-Time Application',
        'passport-replacement': 'e-Passport Replacement',
        'nationalid-first': 'National ID First-Time Application',
        'nationalid-replacement': 'National ID Replacement'
      };
      
      doc.fontSize(12);
      doc.text(`Application Type: ${typeMap[application.applicationType]}`, { bold: true });
      doc.text(`Confirmation Number: ${application.confirmationNumber}`);
      doc.text(`Application Date: ${new Date(application.createdAt).toLocaleDateString()}`);
      doc.text(`Approval Date: ${new Date(application.reviewedAt).toLocaleDateString()}`);
      doc.moveDown();
      
      // Applicant Details
      doc.fontSize(14).text('APPLICANT DETAILS', { underline: true });
      doc.fontSize(10).moveDown(0.5);
      doc.text(`Full Name: ${application.firstName} ${application.middleName || ''} ${application.lastName}`);
      doc.text(`Date of Birth: ${new Date(application.dateOfBirth).toLocaleDateString()}`);
      doc.text(`Gender: ${application.gender.toUpperCase()}`);
      doc.text(`Nationality: ${application.nationality}`);
      doc.text(`National ID Number: ${application.nationalIdNumber || 'N/A'}`);
      doc.text(`Father's Name: ${application.fatherName}`);
      doc.text(`Mother's Name: ${application.motherName}`);
      doc.text(`Marital Status: ${application.maritalStatus}`);
      if (application.profession) doc.text(`Profession: ${application.profession}`);
      if (application.employer) doc.text(`Employer: ${application.employer}`);
      doc.moveDown();
      
      // Contact Details
      doc.fontSize(14).text('CONTACT DETAILS', { underline: true });
      doc.fontSize(10).moveDown(0.5);
      doc.text(`Phone Number: ${application.phoneNumber}`);
      doc.text(`Email: ${application.email}`);
      doc.text(`Address: ${application.placeOfResidence}, ${application.city}, ${application.state}, ${application.country}`);
      doc.moveDown();
      
      // Birth Location
      doc.fontSize(14).text('BIRTH LOCATION', { underline: true });
      doc.fontSize(10).moveDown(0.5);
      doc.text(`Place of Birth: ${application.birthCity}, ${application.birthState}, ${application.birthCountry}`);
      doc.moveDown();
      
      // Passport/ID Specific Details
      if (application.applicationType.includes('passport')) {
        doc.fontSize(14).text('PASSPORT DETAILS', { underline: true });
        doc.fontSize(10).moveDown(0.5);
        doc.text(`Passport Type: ${application.passportType}`);
        if (application.travelPurpose) doc.text(`Travel Purpose: ${application.travelPurpose}`);
        if (application.destinationCountry) doc.text(`Destination: ${application.destinationCity}, ${application.destinationCountry}`);
      }
      
      if (application.replacementReason) {
        doc.fontSize(14).text('REPLACEMENT REASON', { underline: true });
        doc.fontSize(10).moveDown(0.5);
        doc.text(`Reason: ${application.replacementReason.toUpperCase()}`);
      }
      
      doc.moveDown(2);
      
      // Footer
      doc.fontSize(10);
      doc.text('INSTRUCTIONS FOR COLLECTION:', { underline: true });
      doc.fontSize(9).moveDown(0.5);
      doc.text('1. Please bring this approved application form (printed or digital copy)');
      doc.text('2. Visit the Immigration Head Office in Juba');
      doc.text('3. Present your original National ID and other supporting documents');
      doc.text('4. Collection hours: Monday - Friday, 8:00 AM - 4:00 PM');
      doc.moveDown();
      doc.text('For inquiries, contact: +211 XXX XXX XXX or info@immigration.gov.ss');
      
      doc.end();
      
      stream.on('finish', () => {
        resolve(`uploads/pdfs/${filename}`);
      });
      
      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
};
