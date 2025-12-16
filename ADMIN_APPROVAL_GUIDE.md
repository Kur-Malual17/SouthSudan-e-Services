# Admin Application Review & Approval Guide

## How to Review and Approve Applications

### Step 1: Login as Admin/Supervisor

1. Go to: http://localhost:3000/login
2. Login with:
   - **Admin**: admin@immigration.gov.ss / admin123
   - **Supervisor**: supervisor@immigration.gov.ss / super123

### Step 2: Access Admin Dashboard

After login, you'll be redirected to: http://localhost:3000/admin

You'll see:
- Total applications count
- Pending applications
- Approved applications
- Rejected applications
- Applications by type

### Step 3: View Applications

Click on **"Review Pending"** or **"All Applications"**

This takes you to: http://localhost:3000/admin/applications

You'll see a table with:
- Confirmation Number
- Applicant Name
- Application Type
- Status
- Date
- Actions (View Details link)

### Step 4: View Application Details

Click **"View Details"** on any application

This shows:
- ✅ Full applicant information
- ✅ Contact details
- ✅ Application-specific details
- ✅ **ALL uploaded documents** (photos, PDFs, etc.)
- ✅ Action buttons (Approve, Reject, Mark In Progress)

## Viewing Documents

### Images (Photos, Signatures):
- **Displayed as thumbnails** in the documents section
- **Click on image** to view full size in new tab
- Includes:
  - Passport photo
  - Signature
  - Any other image uploads

### PDF Documents:
- **Shown with document icon**
- **Click "View Document"** link to open PDF in new tab
- Includes:
  - ID Copy
  - Birth Certificate
  - Supporting Documents
  - Police Reports
  - Affidavits
  - Any other PDF uploads

### Document Types Displayed:
1. **Passport Photo** - Thumbnail, click to enlarge
2. **ID Copy** - PDF icon, click to view
3. **Signature** - Thumbnail, click to enlarge
4. **Birth Certificate** - PDF icon, click to view
5. **Supporting Documents** - PDF icon, click to view
6. **Police Report** - PDF icon, click to view
7. **Affidavit** - PDF icon, click to view
8. **Any other uploaded files**

## Approving Applications

### Requirements for Approval:
- ✅ Application status must be "Pending"
- ✅ Payment status must be "Completed"
- ✅ All required documents uploaded
- ✅ Information verified

### Approval Process:

1. **Review all information**:
   - Check applicant details are correct
   - Verify contact information
   - Review uploaded documents (click to view full size)

2. **Click "Approve & Send Email"** button:
   - Confirmation dialog appears
   - Click "OK" to confirm

3. **What happens**:
   - ✉️ Email sent to applicant automatically
   - 📄 PDF approval form generated
   - 📧 PDF attached to email
   - ✅ Status changed to "Approved"
   - 📅 Approval date recorded

4. **Applicant receives**:
   - Email with approval notification
   - PDF approval form (attached)
   - Collection instructions
   - Office location and hours

### If Payment Not Completed:

You'll see a warning:
> ⚠️ Payment not completed. Cannot approve until payment is verified.

**Action**: Wait for payment verification or contact applicant

## Rejecting Applications

### Rejection Process:

1. **Click "Reject"** button

2. **Enter rejection reason**:
   - Be specific and clear
   - Explain what's wrong
   - Provide guidance on how to fix

3. **Click "Confirm Reject"**

4. **What happens**:
   - ✉️ Email sent to applicant with reason
   - ✗ Status changed to "Rejected"
   - 📅 Rejection date recorded
   - 📝 Reason saved in system

5. **Applicant receives**:
   - Email with rejection notification
   - Detailed rejection reason
   - Instructions on what to do next
   - How to submit new application

### Example Rejection Reasons:

**Good**:
- "Photo does not meet requirements: background must be white, not blue. Please upload a new photo with white background."
- "Birth certificate is not clear. Please upload a higher quality scan or photo."
- "National ID number does not match our records. Please verify and resubmit."

**Bad**:
- "Photo wrong" (not specific enough)
- "Documents unclear" (which documents?)
- "Rejected" (no explanation)

## Marking In Progress

For applications that need more time to review:

1. **Click "Mark In Progress"**
2. Status changes to "In Progress"
3. Applicant can see status updated
4. You can continue reviewing later

## Permissions by Role

### Admin (Full Access):
- ✅ View all applications
- ✅ Approve applications
- ✅ Reject applications
- ✅ Update status
- ✅ View all documents
- ✅ Access statistics

### Supervisor:
- ✅ View all applications
- ✅ Approve applications
- ✅ Reject applications
- ✅ Update status
- ✅ View all documents
- ✅ Access statistics

### Officer:
- ✅ View all applications
- ✅ View all documents
- ✅ Update status to "In Progress" only
- ❌ Cannot approve
- ❌ Cannot reject

## Tips for Reviewing Applications

### 1. Check Photo Quality:
- Click on photo to view full size
- Verify:
  - White background
  - Clear face
  - Recent photo
  - Proper lighting

### 2. Verify Documents:
- Click "View Document" for each PDF
- Check:
  - Document is readable
  - Information matches application
  - Document is valid/not expired

### 3. Cross-Check Information:
- Name matches ID
- Date of birth matches birth certificate
- Address is complete
- Phone number is valid

### 4. Review Application Type Specific Details:
- **Passport**: Travel purpose, destination
- **National ID**: Residence details
- **Replacement**: Reason for replacement, police report

## Workflow Example

### Typical Approval Flow:

1. **Applicant submits** → Status: Pending
2. **Officer reviews** → Status: In Progress
3. **Supervisor reviews documents**:
   - Clicks on photo to verify
   - Opens ID copy PDF
   - Checks birth certificate
4. **Supervisor approves** → Status: Approved
5. **Email sent automatically** with PDF
6. **Applicant collects document** → Status: Collected

### Typical Rejection Flow:

1. **Applicant submits** → Status: Pending
2. **Admin reviews documents**:
   - Photo has blue background (should be white)
3. **Admin rejects** with reason:
   - "Photo background must be white, not blue"
4. **Email sent automatically** with reason
5. **Applicant submits new application** with correct photo

## Keyboard Shortcuts

- **Ctrl + Click** on document link: Open in new tab
- **Right-click** on image: Save image
- **Esc**: Close rejection modal

## Troubleshooting

### Can't see documents?
- Check if applicant uploaded files
- Try clicking "View Document" link
- Check browser allows pop-ups
- Verify Django server is running

### Images not loading?
- Check URL: http://localhost:8000/media/...
- Verify files exist in backend/media folder
- Check Django MEDIA_URL settings

### Can't approve?
- Check payment status is "Completed"
- Verify you're logged in as admin/supervisor
- Check application status is "Pending"

### Approve button disabled?
- Payment not completed
- Application already approved/rejected
- You're logged in as officer (can't approve)

## Summary

✅ **View Documents**: Click on images or "View Document" links
✅ **Approve**: Click "Approve & Send Email" (auto-sends email with PDF)
✅ **Reject**: Click "Reject", enter reason (auto-sends email)
✅ **In Progress**: Click "Mark In Progress" for later review
✅ **All documents visible**: Photos, PDFs, signatures, certificates

**Admin/Supervisor can approve and reject**
**Officer can only view and mark in progress**
