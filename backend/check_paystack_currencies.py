"""
Check which currencies are supported by your Paystack account
"""
import requests
from decouple import config

secret_key = config('PAYSTACK_SECRET_KEY', default='')

if not secret_key:
    print("ERROR: Secret key not found")
    exit(1)

print("=" * 60)
print("CHECKING SUPPORTED CURRENCIES")
print("=" * 60)

# Try different currencies
currencies = ['NGN', 'USD', 'GHS', 'ZAR', 'KES']

headers = {
    'Authorization': f'Bearer {secret_key}',
    'Content-Type': 'application/json'
}

for currency in currencies:
    payload = {
        "email": "test@example.com",
        "amount": 10000,
        "reference": f"TEST-{currency}-1000",
        "currency": currency
    }
    
    try:
        response = requests.post(
            "https://api.paystack.co/transaction/initialize",
            json=payload,
            headers=headers
        )
        
        if response.status_code == 200:
            print(f"✓ {currency} - SUPPORTED")
        elif "currency not supported" in response.text.lower():
            print(f"✗ {currency} - NOT SUPPORTED")
        else:
            print(f"? {currency} - Status {response.status_code}: {response.json().get('message', 'Unknown')}")
    except Exception as e:
        print(f"✗ {currency} - ERROR: {str(e)}")

print("=" * 60)
print("\nIf all currencies show 'NOT SUPPORTED', you need to:")
print("1. Complete your business verification on Paystack")
print("2. Or contact Paystack support to enable currencies")
print("3. Or use a different Paystack account")
print("=" * 60)
