# Payment System Guide

## Overview
The South Sudan Immigration Portal now includes a complete payment system that allows applicants to submit payment proofs and administrators to verify payments before processing applications.

## Payment Flow

### 1. Application Submission
- User submits an application through any of the available services
- Application is created with `payment_status = 'pending'`
- User receives confirmation email

### 2. Payment Submission (Applicant)
- After submitting application, user sees "Make Payment" button in My Applications
- User clicks "Make Payment" and is redirected to payment page
- User selects payment method:
  - **Mobile Money (MTN/Airtel)**: Instructions for USSD codes
  - **Credit/Debit Card**: Card payment (coming soon)
  - **Bank Transfer**: Bank account details provided
- User completes payment through selected method
- User enters transaction reference number
- User uploads payment proof (screenshot/receipt)
- System updates application with payment details

### 3. Payment Verification (Admin/Supervisor)
- Admin/Supervisor views application in admin dashboard
- Payment verification section shows:
  - Payment method
  - Transaction reference
  - Payment amount
  - Payment proof image (clickable to view full size)
- Admin can:
  - **Verify Payment**: Marks payment as completed
  - **Reject Payment**: Provides reason for rejection
- Applicant is notified of verification status

### 4. Payment Rejection Handling
- If payment is rejected, applicant sees rejection reason in My Applications
- "Resubmit Payment" button appears
- Applicant can upload new payment proof
- Process repeats until payment is verified

### 5. Application Processing
- Application can only be approved after payment is verified
- Approve button is disabled until `payment_status = 'completed'`
- Once payment verified, normal approval workflow continues

## Payment Fees

| Application Type | Fee (SSP) |
|-----------------|-----------|
| e-Passport First-Time | 5,000 |
| e-Passport Replacement | 3,000 |
| National ID First-Time | 1,000 |
| National ID Replacement | 500 |
| National ID Correction | 500 |
| Visa Application | 2,000 |
| Permit Application | 3,000 |
| Emergency Travel Document | 4,000 |

## Database Fields

### Application Model - Payment Fields
```python
payment_status = 'pending' | 'completed' | 'failed'
payment_method = 'momo' | 'credit_card' | 'bank'
payment_amount = Decimal (auto-calculated based on application type)
payment_reference = String (transaction ID)
payment_proof = ImageField (screenshot/receipt)
payment_date = DateTime (when verified)
payment_verified_by = ForeignKey(User) (admin who verified)
payment_verified_at = DateTime
payment_rejection_reason = Text (if rejected)
```

## API Endpoints

### Submit Payment Proof
```
PATCH /api/applications/{id}/
Content-Type: multipart/form-data

{
  payment_method: 'momo',
  payment_reference: 'TXN123456',
  payment_amount: '5000',
  payment_proof: <file>
}
```

### Verify Payment (Admin/Supervisor only)
```
POST /api/applications/{id}/verify_payment/

Response:
{
  success: true,
  message: 'Payment verified successfully',
  application: {...}
}
```

### Reject Payment (Admin/Supervisor only)
```
POST /api/applications/{id}/reject_payment/

{
  reason: 'Screenshot is unclear, please resubmit'
}

Response:
{
  success: true,
  message: 'Payment rejected',
  application: {...}
}
```

## Frontend Routes

- `/payment/:id` - Payment submission page
- `/my-applications` - Shows payment status and action buttons
- `/admin/applications/:id` - Admin payment verification interface

## Payment Methods

### Mobile Money (MTN)
- Dial: *165#
- Select: Send Money
- Number: 0921234567
- Amount: [Application Fee]

### Mobile Money (Airtel)
- Dial: *185#
- Select: Send Money
- Number: 0971234567
- Amount: [Application Fee]

### Bank Transfer
- Bank: Bank of South Sudan
- Account Name: Immigration Services
- Account Number: 1234567890
- Branch: Juba Main Branch
- Reference: [Confirmation Number]

## User Interface

### Applicant View (My Applications)
- Payment status badge (Pending/Completed/Failed)
- "Make Payment" button (if pending and no proof submitted)
- "Payment Verification Pending" message (if proof submitted)
- "Payment Verified" message (if completed)
- "Payment Rejected" message with reason (if failed)
- "Resubmit Payment" button (if rejected)

### Admin View (Application Detail)
- Payment verification section (if proof submitted)
- Payment proof image viewer
- "Verify Payment" button
- "Reject Payment" button with reason input
- Payment status indicators
- Warning message if payment not completed

## Testing the Payment System

### As Applicant:
1. Register/Login as regular user
2. Submit any application
3. Go to My Applications
4. Click "Make Payment"
5. Select payment method (e.g., Mobile Money)
6. Enter transaction reference: TEST123456
7. Upload any image as payment proof
8. Submit

### As Admin:
1. Login as admin (admin@immigration.gov.ss / admin123)
2. Go to Admin Dashboard → All Applications
3. Click on application with pending payment
4. View payment proof in verification section
5. Click "Verify Payment" to approve
6. OR click "Reject Payment" and provide reason

### Test Payment Rejection:
1. Admin rejects payment with reason
2. Applicant sees rejection in My Applications
3. Applicant clicks "Resubmit Payment"
4. Applicant uploads new proof
5. Admin verifies again

## Security Considerations

- Only authenticated users can submit payments
- Only Admin/Supervisor can verify/reject payments
- Payment proof images stored securely in `media/payment_proofs/`
- CORS configured for media file access
- Payment verification requires explicit admin action

## Future Enhancements

1. **Online Payment Gateway Integration**
   - Integrate with South Sudan payment providers
   - Real-time payment verification
   - Automatic payment confirmation

2. **Payment Receipts**
   - Generate official payment receipts
   - Email receipts to applicants
   - PDF receipt downloads

3. **Payment Analytics**
   - Revenue tracking dashboard
   - Payment method statistics
   - Failed payment analysis

4. **Refund System**
   - Handle refund requests
   - Track refund status
   - Automated refund processing

## Troubleshooting

### Payment proof not showing
- Check CORS middleware is enabled
- Verify Django server is running
- Check media files exist in `backend/media/payment_proofs/`
- Open browser console for errors

### Cannot verify payment
- Ensure logged in as Admin or Supervisor
- Check payment proof was uploaded
- Verify API endpoint is accessible

### Payment status not updating
- Check backend logs for errors
- Verify database migrations are applied
- Test API endpoint directly

## Support

For payment-related issues:
- Email: payments@immigration.gov.ss
- Phone: +211 XXX XXX XXX
- Office: Immigration Headquarters, Juba

---

**Last Updated:** December 11, 2025
**Version:** 1.0
