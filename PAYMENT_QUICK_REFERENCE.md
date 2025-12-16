# Payment System - Quick Reference Card

## 🚀 Quick Start

### Start Servers
```bash
# Backend
cd backend && python manage.py runserver

# Frontend
cd client && npm run dev
```

### Test Accounts
| Role | Email | Password |
|------|-------|----------|
| Applicant | test@example.com | test123 |
| Admin | admin@immigration.gov.ss | admin123 |
| Supervisor | supervisor@immigration.gov.ss | super123 |

## 💰 Payment Fees

| Service | Fee (SSP) |
|---------|-----------|
| Passport First-Time | 5,000 |
| Passport Replacement | 3,000 |
| National ID First-Time | 1,000 |
| National ID Replacement | 500 |

## 📱 Payment Methods

### Mobile Money (MTN)
- Dial: `*165#`
- Number: `0921234567`

### Mobile Money (Airtel)
- Dial: `*185#`
- Number: `0971234567`

### Bank Transfer
- Bank: Bank of South Sudan
- Account: `1234567890`

## 🔄 Payment Flow

```
Submit Application → Make Payment → Upload Proof → Admin Verifies → Application Approved
```

## 👤 Applicant Actions

1. **Submit Application**
   - Dashboard → Select Service → Fill Form → Submit

2. **Make Payment**
   - My Applications → "Make Payment" button
   - Select method → Enter reference → Upload proof

3. **Check Status**
   - My Applications → View payment status badge

## 👨‍💼 Admin Actions

1. **View Pending Payments**
   - Admin Dashboard → All Applications
   - Look for applications with payment proof

2. **Verify Payment**
   - Click application → View payment proof
   - Click "✓ Verify Payment"

3. **Reject Payment**
   - Click "✗ Reject Payment"
   - Enter reason → Confirm

## 🎯 Payment Status

| Status | Meaning | Action |
|--------|---------|--------|
| 🟡 Pending | No proof submitted | Applicant: Make Payment |
| 🔵 Pending | Proof submitted | Admin: Verify/Reject |
| 🟢 Completed | Payment verified | Can approve application |
| 🔴 Failed | Payment rejected | Applicant: Resubmit |

## 🔗 Key Routes

| Route | Purpose |
|-------|---------|
| `/payment/:id` | Payment submission |
| `/my-applications` | View payment status |
| `/admin/applications/:id` | Verify payment |

## 📋 API Endpoints

```
PATCH /api/applications/{id}/          # Submit payment
POST  /api/applications/{id}/verify_payment/   # Verify (Admin)
POST  /api/applications/{id}/reject_payment/   # Reject (Admin)
```

## ⚠️ Important Rules

1. ✅ Payment must be verified before application approval
2. ✅ Only Admin/Supervisor can verify payments
3. ✅ Applicants can resubmit if payment rejected
4. ✅ Payment proof required (image upload)

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Image not showing | Restart Django server |
| Can't verify | Login as Admin/Supervisor |
| Wrong amount | Check application type |
| Button disabled | Check payment status |

## 📚 Full Documentation

- **Complete Guide:** `PAYMENT_SYSTEM_GUIDE.md`
- **Testing Guide:** `QUICK_START_PAYMENT.md`
- **Implementation:** `PAYMENT_IMPLEMENTATION_SUMMARY.md`

## ✅ Testing Checklist

- [ ] Submit application
- [ ] Make payment
- [ ] Upload proof
- [ ] Admin verifies
- [ ] Test rejection
- [ ] Resubmit payment
- [ ] Approve application

---

**Quick Help:** Open `QUICK_START_PAYMENT.md` for detailed testing steps
