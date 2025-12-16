# Quick Start: Testing Payment System

## Prerequisites
- Django backend running on `localhost:8000`
- React frontend running on `localhost:3000`
- Database migrations applied
- Staff users created (admin, supervisor, officer)

## Step-by-Step Testing Guide

### Step 1: Start the Servers

**Backend (Django):**
```bash
cd backend
python manage.py runserver
```

**Frontend (React):**
```bash
cd client
npm run dev
```

### Step 2: Submit an Application (As Applicant)

1. Open browser: `http://localhost:3000`
2. Click "Sign Up" and register a new user:
   - Email: test@example.com
   - Password: test123
   - First Name: John
   - Last Name: Doe
   - Phone: +211912345678

3. After registration, you'll be logged in automatically
4. Click "Dashboard" or any service (e.g., "e-Passport First-Time")
5. Fill out the application form
6. Upload required documents
7. Submit application
8. Note the confirmation number (e.g., SS-IMM-12345678-123)

### Step 3: Make Payment (As Applicant)

1. Go to "My Applications" from navigation
2. You'll see your application with:
   - Status: PENDING
   - Payment: PENDING
   - Yellow warning: "Payment Required"
   - Button: "Make Payment"

3. Click "Make Payment"
4. You'll see the payment page with:
   - Application details
   - Payment amount (e.g., 5000 SSP for passport)

5. Select a payment method (e.g., Mobile Money)
6. View payment instructions
7. Enter transaction reference: `TEST123456`
8. Upload payment proof:
   - Take a screenshot or use any image
   - Click "Choose File" and select image
9. Click "Submit Payment Proof"
10. You'll be redirected to My Applications
11. Status now shows: "Payment Verification Pending"

### Step 4: Verify Payment (As Admin)

1. Logout from applicant account
2. Login as admin:
   - Email: admin@immigration.gov.ss
   - Password: admin123

3. You'll be redirected to Admin Dashboard
4. Click "All Applications" or "Review Pending"
5. Find the application you just submitted
6. Click on it to view details

7. You'll see a blue "Payment Verification Required" section with:
   - Payment method
   - Transaction reference
   - Payment amount
   - Payment proof image (click to view full size)

8. Review the payment proof
9. Click "✓ Verify Payment" to approve
   - OR click "✗ Reject Payment" to reject with reason

10. If verified:
    - Payment status changes to "completed"
    - Green message: "Payment verified and approved"
    - "Approve & Send Email" button becomes enabled

### Step 5: Test Payment Rejection (Optional)

1. As admin, click "✗ Reject Payment"
2. Enter reason: "Screenshot is unclear, please resubmit"
3. Click "Confirm Reject Payment"
4. Payment status changes to "failed"

5. Logout and login as applicant
6. Go to My Applications
7. You'll see:
   - Red message: "Payment Rejected"
   - Rejection reason displayed
   - Button: "Resubmit Payment"

8. Click "Resubmit Payment"
9. Upload new payment proof
10. Submit again
11. Admin can verify the new proof

### Step 6: Approve Application (As Admin)

1. After payment is verified (status = completed)
2. In application detail page
3. Click "✓ Approve & Send Email"
4. Confirm the action
5. Application status changes to "approved"
6. Email sent to applicant with PDF attachment

### Step 7: Check Applicant View

1. Logout and login as applicant
2. Go to My Applications
3. You'll see:
   - Status: APPROVED
   - Payment: COMPLETED
   - Green message: "Your application has been approved!"
   - Instructions to collect document

## Payment Fees Reference

| Application Type | Fee (SSP) |
|-----------------|-----------|
| e-Passport First-Time | 5,000 |
| e-Passport Replacement | 3,000 |
| National ID First-Time | 1,000 |
| National ID Replacement | 500 |

## Test Accounts

### Applicant
- Email: test@example.com
- Password: test123

### Admin
- Email: admin@immigration.gov.ss
- Password: admin123

### Supervisor
- Email: supervisor@immigration.gov.ss
- Password: super123

### Officer
- Email: officer1@immigration.gov.ss
- Password: officer123

## Common Issues

### Payment proof image not showing
**Solution:** Restart Django server to load CORS middleware
```bash
cd backend
python manage.py runserver
```

### Cannot verify payment
**Problem:** Not logged in as admin/supervisor
**Solution:** Login with admin or supervisor account

### "Make Payment" button not showing
**Problem:** Payment proof already submitted
**Solution:** Check payment status - if pending verification, wait for admin

### Payment amount is 0 or wrong
**Problem:** Application type not in fee mapping
**Solution:** Check Payment.tsx getPaymentAmount() function

## Payment Methods for Testing

### Mobile Money (MTN)
- Number: 0921234567
- Test Reference: MTN-TEST-123456

### Mobile Money (Airtel)
- Number: 0971234567
- Test Reference: AIRTEL-TEST-123456

### Bank Transfer
- Account: 1234567890
- Test Reference: BANK-TEST-123456

## Verification Checklist

- [ ] Application submitted successfully
- [ ] "Make Payment" button appears
- [ ] Payment page loads with correct amount
- [ ] Payment method selection works
- [ ] Payment instructions display correctly
- [ ] Transaction reference input works
- [ ] Payment proof upload works
- [ ] Payment submission successful
- [ ] Admin can see payment verification section
- [ ] Payment proof image displays correctly
- [ ] Admin can verify payment
- [ ] Admin can reject payment
- [ ] Rejection reason displays to applicant
- [ ] Resubmit payment works
- [ ] Application approval blocked until payment verified
- [ ] Application approval works after payment verified

## Next Steps

After testing the payment system:
1. Configure real payment gateway (if available)
2. Update payment instructions with real account numbers
3. Set up email notifications for payment status
4. Configure payment receipt generation
5. Set up payment analytics dashboard

## Support

For issues or questions:
- Check browser console for errors
- Check Django server logs
- Review PAYMENT_SYSTEM_GUIDE.md
- Contact: dev@immigration.gov.ss

---

**Last Updated:** December 11, 2025
