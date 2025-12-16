from django.core.mail import EmailMessage
from django.conf import settings
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
import os

def generate_pdf(application):
    """Generate PDF for approved application"""
    filename = f"application-{application.confirmation_number}.pdf"
    filepath = os.path.join(settings.MEDIA_ROOT, 'approved_pdfs', filename)
    
    # Create directory if it doesn't exist
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    
    # Create PDF
    c = canvas.Canvas(filepath, pagesize=letter)
    width, height = letter
    
    # Header
    c.setFont("Helvetica-Bold", 20)
    c.drawCentredString(width/2, height - 1*inch, "REPUBLIC OF SOUTH SUDAN")
    c.setFont("Helvetica", 14)
    c.drawCentredString(width/2, height - 1.3*inch, "DIRECTORATE OF NATIONALITY, PASSPORTS AND IMMIGRATION")
    c.setFont("Helvetica-Bold", 12)
    c.drawCentredString(width/2, height - 1.7*inch, "APPROVED APPLICATION FORM")
    
    # Application Details
    y = height - 2.2*inch
    c.setFont("Helvetica", 10)
    
    lines = [
        f"Confirmation Number: {application.confirmation_number}",
        f"Application Type: {application.get_application_type_display()}",
        f"Status: {application.get_status_display()}",
        "",
        "APPLICANT DETAILS:",
        f"Name: {application.first_name} {application.middle_name or ''} {application.last_name}",
        f"Date of Birth: {application.date_of_birth}",
        f"Gender: {application.get_gender_display()}",
        f"Nationality: {application.nationality}",
        f"National ID: {application.national_id_number or 'N/A'}",
        f"Father's Name: {application.father_name}",
        f"Mother's Name: {application.mother_name}",
        "",
        "CONTACT DETAILS:",
        f"Phone: {application.phone_number}",
        f"Email: {application.email}",
        f"Address: {application.place_of_residence}, {application.city}, {application.state}",
        "",
        "COLLECTION INSTRUCTIONS:",
        "1. Bring this approval form (printed or digital)",
        "2. Visit Immigration Head Office in Juba",
        "3. Present your original National ID",
        "4. Collection hours: Monday-Friday, 8:00 AM - 4:00 PM",
    ]
    
    for line in lines:
        c.drawString(1*inch, y, line)
        y -= 0.25*inch
    
    c.save()
    return f"approved_pdfs/{filename}"

def send_application_received_email(application):
    """Send email when application is received"""
    subject = 'Application Received - South Sudan Immigration'
    message = f"""
Dear {application.first_name} {application.last_name},

Thank you for submitting your application for {application.get_application_type_display()}.

Your application has been successfully received and is now being processed.

Application Details:
- Confirmation Number: {application.confirmation_number}
- Application Type: {application.get_application_type_display()}
- Submission Date: {application.created_at.strftime('%B %d, %Y at %I:%M %p')}
- Status: Pending Review

What happens next?
1. Your application will be reviewed by our immigration officers
2. You will receive an email notification once your application is approved or if additional information is needed
3. Processing time: 7-14 business days

You can track your application status online using your confirmation number.

If you have any questions, please contact us:
- Email: info@immigration.gov.ss
- Phone: +211 123 456 789
- Office: Immigration Head Office, Juba

Thank you for using the South Sudan Immigration Online Portal.

Best regards,
South Sudan Immigration Services
Directorate of Nationality, Passports and Immigration
    """
    
    email = EmailMessage(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [application.email]
    )
    
    try:
        email.send()
        print(f"Application received email sent to {application.email}")
    except Exception as e:
        print(f"Error sending application received email: {e}")

def send_approval_email(application):
    """Send approval email with PDF attachment"""
    subject = 'Application Approved - South Sudan Immigration'
    message = f"""
Dear {application.first_name} {application.last_name},

Congratulations! Your application for {application.get_application_type_display()} has been APPROVED.

Application Details:
- Confirmation Number: {application.confirmation_number}
- Application Type: {application.get_application_type_display()}
- Approval Date: {application.reviewed_at.strftime('%B %d, %Y at %I:%M %p')}

NEXT STEPS - DOCUMENT COLLECTION:
Please visit the Immigration Head Office in Juba to collect your document.

Requirements for Collection:
1. This approval email (printed or on your phone)
2. Original National ID card
3. Confirmation number: {application.confirmation_number}

Collection Location:
Immigration Head Office
Juba, South Sudan

Office Hours:
Monday - Friday: 8:00 AM - 4:00 PM
Saturday: 9:00 AM - 1:00 PM
Sunday: Closed

Important Notes:
- Please collect your document within 30 days of approval
- Bring valid identification
- Collection is free of charge

If you have any questions, please contact us:
- Email: info@immigration.gov.ss
- Phone: +211 123 456 789

Thank you for using the South Sudan Immigration Online Portal.

Best regards,
South Sudan Immigration Services
Directorate of Nationality, Passports and Immigration
    """
    
    email = EmailMessage(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [application.email]
    )
    
    # Attach PDF if it exists
    if application.approved_pdf:
        pdf_path = os.path.join(settings.MEDIA_ROOT, str(application.approved_pdf))
        if os.path.exists(pdf_path):
            email.attach_file(pdf_path)
    
    try:
        email.send()
        print(f"Approval email sent to {application.email}")
    except Exception as e:
        print(f"Error sending approval email: {e}")

def send_rejection_email(application):
    """Send rejection email with reason"""
    subject = 'Application Status Update - South Sudan Immigration'
    message = f"""
Dear {application.first_name} {application.last_name},

We regret to inform you that your application for {application.get_application_type_display()} has been reviewed and cannot be approved at this time.

Application Details:
- Confirmation Number: {application.confirmation_number}
- Application Type: {application.get_application_type_display()}
- Review Date: {application.reviewed_at.strftime('%B %d, %Y at %I:%M %p')}

Reason for Rejection:
{application.rejection_reason}

What you can do:
1. Review the rejection reason carefully
2. Address the issues mentioned
3. Submit a new application with the correct information/documents
4. Contact our office if you need clarification

If you believe this decision was made in error or need assistance, please contact us:
- Email: info@immigration.gov.ss
- Phone: +211 123 456 789
- Office: Immigration Head Office, Juba

Office Hours:
Monday - Friday: 8:00 AM - 4:00 PM
Saturday: 9:00 AM - 1:00 PM

You may submit a new application at any time through our online portal.

Thank you for your understanding.

Best regards,
South Sudan Immigration Services
Directorate of Nationality, Passports and Immigration
    """
    
    email = EmailMessage(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [application.email]
    )
    
    try:
        email.send()
        print(f"Rejection email sent to {application.email}")
    except Exception as e:
        print(f"Error sending rejection email: {e}")
