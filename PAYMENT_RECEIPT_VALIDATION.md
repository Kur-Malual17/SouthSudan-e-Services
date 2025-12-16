# Payment Receipt Duplicate Detection

## Overview
This system prevents fraud by detecting when the same payment receipt screenshot is used for multiple applications.

## How It Works

### 1. Hash-Based Detection
- When a payment receipt is uploaded, the system calculates a SHA-256 hash of the file
- This hash is stored in the `payment_proof_hash` field
- Before accepting any new receipt, the system checks if this hash already exists

### 2. Automatic Validation
- **During Application Submission**: The system validates the receipt and rejects duplicates
- **In Django Admin**: Staff can see duplicate warnings with links to other applications using the same receipt
- **Via API**: The response includes duplicate warnings for staff review

## Features

### Admin Interface
- **List View**: Shows a warning icon (⚠️) next to applications with duplicate receipts
- **Detail View**: Displays a "Duplicate Receipt Check" section showing:
  - ✓ Green checkmark for unique receipts
  - ⚠️ Red warning with links to duplicate applications

### API Response
The API includes a `duplicate_receipt_warning` field:
```json
{
  "duplicate_receipt_warning": {
    "is_duplicate": true,
    "message": "This payment receipt has been used in other applications",
    "duplicate_applications": [
      {
        "confirmation_number": "SS-IMM-0-123",
        "status": "approved",
        "application_type": "passport-first"
      }
    ]
  }
}
```

### Validation Error
If someone tries to submit a duplicate receipt, they'll see:
```
This payment receipt has already been used for application SS-IMM-0-123. 
Each payment receipt can only be used once.
```

## Additional Security Measures

### 1. Payment Reference Validation
- Require unique payment reference numbers
- Staff should verify references against bank records

### 2. Manual Review
- Staff can see all applications using the same receipt
- Review suspicious patterns (same amounts, dates, etc.)

### 3. Best Practices
- Always verify payment references with your payment gateway
- Check transaction dates match application dates
- Look for patterns of fraud (same user, similar timing)
- Contact applicants if receipts look suspicious

## Technical Details

### Database Field
- `payment_proof_hash`: CharField(64) - stores SHA-256 hash
- Indexed for fast duplicate lookups

### Hash Calculation
- Uses SHA-256 algorithm
- Processes files in chunks (handles large files)
- Calculated automatically on save

### Migration
Run this to apply the changes:
```bash
cd backend
python manage.py migrate
```

## Limitations

### What This Detects
✓ Exact same file uploaded multiple times
✓ Same screenshot used for different applications
✓ Copy-pasted receipt images

### What This Doesn't Detect
✗ Edited/cropped versions of the same receipt
✗ Screenshots taken at different times of the same receipt
✗ Photos of the same receipt from different angles

### Additional Recommendations
For even stronger protection:
1. Integrate with payment gateway APIs for real-time verification
2. Implement image similarity detection (more complex)
3. Require payment reference numbers that you can verify
4. Add manual staff review for high-value applications

## Usage

### For Staff
1. Upload applications normally
2. Check the "Payment Check" column in the list view
3. Click into applications with ⚠️ warnings
4. Review the "Duplicate Receipt Check" section
5. Investigate linked applications
6. Reject fraudulent applications

### For Developers
The validation happens automatically in the model's `clean()` method. No additional code needed for basic usage.

To check for duplicates programmatically:
```python
from applications.models import Application

# Check if a receipt is duplicated
app = Application.objects.get(pk=123)
duplicates = Application.objects.filter(
    payment_proof_hash=app.payment_proof_hash
).exclude(pk=app.pk)

if duplicates.exists():
    print(f"Found {duplicates.count()} duplicate(s)")
```
