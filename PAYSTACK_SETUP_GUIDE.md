# Paystack Payment Integration Setup Guide

## Overview
This guide will help you set up Paystack payment integration for card payments in the South Sudan e-Services platform.

## Prerequisites
- Paystack account (sign up at https://paystack.com)
- Test API keys from Paystack dashboard

## Step 1: Get Your Paystack API Keys

1. Log in to your Paystack dashboard at https://dashboard.paystack.com
2. Go to **Settings** > **API Keys & Webhooks**
3. Copy your:
   - **Public Key** (starts with `pk_test_` for test mode)
   - **Secret Key** (starts with `sk_test_` for test mode)

## Step 2: Configure Backend

1. Open `backend/.env` file
2. Replace the placeholder values with your actual keys:

```env
# Paystack Configuration
PAYSTACK_SECRET_KEY=sk_test_your_actual_secret_key_here
PAYSTACK_PUBLIC_KEY=pk_test_your_actual_public_key_here
```

3. Install required Python package:
```bash
cd backend
pip install requests
```

Or install all requirements:
```bash
pip install -r requirements.txt
```

## Step 3: Test the Integration

### Using Test Cards

Paystack provides test cards for testing:

**Successful Payment:**
- Card Number: `4084084084084081`
- CVV: `408`
- Expiry: Any future date
- PIN: `0000`
- OTP: `123456`

**Failed Payment:**
- Card Number: `5060666666666666666`
- CVV: Any 3 digits
- Expiry: Any future date

### Testing Flow

1. **Start the backend server:**
```bash
cd backend
python manage.py runserver
```

2. **Start the frontend:**
```bash
cd client
npm run dev
```

3. **Test the payment flow:**
   - Submit an application
   - Go to "My Applications"
   - Click "Make Payment" or navigate to `/payment`
   - Select your application
   - Click "Proceed to Payment"
   - You'll be redirected to Paystack payment page
   - Use test card details above
   - Complete the payment
   - You'll be redirected back to verify payment

## Payment Amounts

Current pricing (in SSP/NGN):
- **e-Passport First-Time**: 500
- **e-Passport Replacement**: 300
- **National ID First-Time**: 200
- **National ID Replacement**: 150

You can modify these in `backend/applications/views.py` in the `initialize_payment` function.

## API Endpoints

### Initialize Payment
```
POST /api/payment/initialize/
Body: {
  "application_id": 123,
  "callback_url": "http://localhost:5173/payment/verify"
}
```

### Verify Payment
```
GET /api/payment/verify/?reference=PAY-SS-IMM-0-123-1234567890
```

### Get Public Key
```
GET /api/payment/public-key/
```

## Currency Configuration

By default, the integration uses NGN (Nigerian Naira). To change to SSP (South Sudanese Pound):

1. Open `backend/applications/payment_service.py`
2. Find the `initialize_transaction` method
3. Change the currency:
```python
payload = {
    "email": email,
    "amount": amount_kobo,
    "reference": reference,
    "currency": "SSP",  # Changed from "NGN"
}
```

**Note:** Check if Paystack supports SSP in your region. If not, you may need to use NGN or USD.

## Webhook Setup (Optional but Recommended)

For production, set up webhooks to automatically verify payments:

1. In Paystack dashboard, go to **Settings** > **API Keys & Webhooks**
2. Add webhook URL: `https://yourdomain.com/api/payment/webhook/`
3. Implement webhook handler in `views.py`

## Going Live

When ready for production:

1. Switch to **Live Mode** in Paystack dashboard
2. Get your live API keys (start with `pk_live_` and `sk_live_`)
3. Update `.env` with live keys
4. Set `DEBUG=False` in Django settings
5. Update callback URLs to your production domain

## Troubleshooting

### Payment initialization fails
- Check if PAYSTACK_SECRET_KEY is set correctly
- Verify the secret key is valid (not expired)
- Check backend logs for detailed error messages

### Payment verification fails
- Ensure the reference matches exactly
- Check if payment was actually completed on Paystack
- Verify webhook is configured (if using webhooks)

### Redirect issues
- Ensure callback_url is correct
- Check CORS settings in Django
- Verify frontend route exists

## Security Notes

1. **Never expose your secret key** in frontend code
2. **Always verify payments on the backend** - don't trust frontend verification alone
3. **Use HTTPS in production** - Paystack requires secure connections
4. **Store API keys in environment variables** - never commit them to git
5. **Validate payment amounts** - ensure they match expected values

## Support

- Paystack Documentation: https://paystack.com/docs
- Paystack Support: support@paystack.com
- Test your integration: https://paystack.com/docs/payments/test-payments

## Additional Features

You can extend the integration with:
- **Subscriptions** - For recurring payments
- **Split Payments** - For multi-party transactions
- **Refunds** - For payment reversals
- **Payment Plans** - For installment payments
- **Mobile Money** - For MTN, Airtel, etc.

Check Paystack documentation for implementation details.
