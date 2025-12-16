"""
Paystack Payment Integration Service
"""
import requests
from decimal import Decimal
from decouple import config


class PaystackService:
    """Handle Paystack payment operations"""
    
    BASE_URL = "https://api.paystack.co"
    
    def __init__(self):
        self.secret_key = config('PAYSTACK_SECRET_KEY', default='')
        self.headers = {
            'Authorization': f'Bearer {self.secret_key}',
            'Content-Type': 'application/json'
        }
        
        # Debug: Print first few characters of key (for troubleshooting)
        if self.secret_key:
            print(f"Paystack key loaded: {self.secret_key[:7]}...")
        else:
            print("WARNING: Paystack secret key not found!")
    
    def initialize_transaction(self, email, amount, reference, callback_url=None):
        """
        Initialize a payment transaction
        
        Args:
            email: Customer email
            amount: Amount in kobo (multiply by 100 for naira/SSP)
            reference: Unique transaction reference
            callback_url: URL to redirect after payment
        
        Returns:
            dict: Response with authorization_url and access_code
        """
        url = f"{self.BASE_URL}/transaction/initialize"
        
        # Convert amount to kobo (smallest currency unit)
        amount_kobo = int(Decimal(amount) * 100)
        
        payload = {
            "email": email,
            "amount": amount_kobo,
            "reference": reference,
            "currency": "GHS",  # Ghanaian Cedi (supported by your account)
        }
        
        if callback_url:
            payload["callback_url"] = callback_url
        
        # Debug logging
        print(f"Paystack Request URL: {url}")
        print(f"Paystack Payload: {payload}")
        print(f"Paystack Headers: Authorization: Bearer {self.secret_key[:10]}...")
        
        try:
            response = requests.post(url, json=payload, headers=self.headers)
            print(f"Paystack Response Status: {response.status_code}")
            print(f"Paystack Response Body: {response.text}")
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            error_detail = response.text if 'response' in locals() else str(e)
            print(f"Paystack Error Detail: {error_detail}")
            return {
                'status': False,
                'message': f'Payment initialization failed: {str(e)}',
                'detail': error_detail
            }
    
    def verify_transaction(self, reference):
        """
        Verify a transaction
        
        Args:
            reference: Transaction reference to verify
        
        Returns:
            dict: Transaction details
        """
        url = f"{self.BASE_URL}/transaction/verify/{reference}"
        
        try:
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {
                'status': False,
                'message': f'Verification failed: {str(e)}'
            }
    
    def get_transaction(self, transaction_id):
        """
        Get transaction details
        
        Args:
            transaction_id: Transaction ID
        
        Returns:
            dict: Transaction details
        """
        url = f"{self.BASE_URL}/transaction/{transaction_id}"
        
        try:
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {
                'status': False,
                'message': f'Failed to get transaction: {str(e)}'
            }
    
    def list_transactions(self, per_page=50, page=1):
        """
        List all transactions
        
        Args:
            per_page: Number of transactions per page
            page: Page number
        
        Returns:
            dict: List of transactions
        """
        url = f"{self.BASE_URL}/transaction"
        params = {
            'perPage': per_page,
            'page': page
        }
        
        try:
            response = requests.get(url, headers=self.headers, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {
                'status': False,
                'message': f'Failed to list transactions: {str(e)}'
            }
