"""
Simple script to test Paystack API keys
"""
import requests
from decouple import config

# Load keys
secret_key = config('PAYSTACK_SECRET_KEY', default='')
public_key = config('PAYSTACK_PUBLIC_KEY', default='')

print("=" * 50)
print("PAYSTACK KEY TEST")
print("=" * 50)
print(f"Secret Key: {secret_key[:15]}..." if secret_key else "Secret Key: NOT FOUND")
print(f"Public Key: {public_key[:15]}..." if public_key else "Public Key: NOT FOUND")
print("=" * 50)

if not secret_key:
    print("ERROR: Secret key not found in .env file")
    exit(1)

# Test the key with a simple API call
url = "https://api.paystack.co/transaction/initialize"
headers = {
    'Authorization': f'Bearer {secret_key}',
    'Content-Type': 'application/json'
}

payload = {
    "email": "test@example.com",
    "amount": 50000,  # 500 GHS in pesewas
    "reference": "TEST-" + str(int(1000000)),
    "currency": "GHS"
}

print("\nTesting Paystack API...")
print(f"URL: {url}")
print(f"Payload: {payload}")

try:
    response = requests.post(url, json=payload, headers=headers)
    print(f"\nResponse Status: {response.status_code}")
    print(f"Response Body: {response.text}")
    
    if response.status_code == 200:
        print("\n✓ SUCCESS! Your Paystack keys are working correctly.")
    elif response.status_code == 401:
        print("\n✗ ERROR: Unauthorized - Your secret key is invalid or expired.")
        print("Please get a new key from: https://dashboard.paystack.com/settings/developer")
    elif response.status_code == 403:
        print("\n✗ ERROR: Forbidden - Your API key doesn't have permission.")
        print("Possible reasons:")
        print("1. The key is from a test account that hasn't been activated")
        print("2. The key has been revoked")
        print("3. Your Paystack account needs verification")
        print("\nPlease check your Paystack dashboard: https://dashboard.paystack.com")
    else:
        print(f"\n✗ ERROR: Unexpected status code {response.status_code}")
        
except Exception as e:
    print(f"\n✗ ERROR: {str(e)}")

print("=" * 50)
