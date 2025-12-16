"""
Test email configuration
Run this to verify your email settings are working
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'immigration_portal.settings')
django.setup()

from django.core.mail import send_mail
from django.conf import settings

def test_email():
    print("=" * 60)
    print("Testing Email Configuration")
    print("=" * 60)
    
    print(f"\nEmail Settings:")
    print(f"  EMAIL_BACKEND: {settings.EMAIL_BACKEND}")
    print(f"  EMAIL_HOST: {settings.EMAIL_HOST}")
    print(f"  EMAIL_PORT: {settings.EMAIL_PORT}")
    print(f"  EMAIL_USE_TLS: {settings.EMAIL_USE_TLS}")
    print(f"  EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}")
    print(f"  EMAIL_HOST_PASSWORD: {'*' * len(settings.EMAIL_HOST_PASSWORD) if settings.EMAIL_HOST_PASSWORD else 'NOT SET'}")
    print(f"  DEFAULT_FROM_EMAIL: {settings.DEFAULT_FROM_EMAIL}")
    
    test_email = input("\nEnter email address to send test email to: ").strip()
    
    if not test_email:
        print("No email provided. Exiting.")
        return
    
    print(f"\nSending test email to: {test_email}")
    
    try:
        result = send_mail(
            subject='Test Email - South Sudan Immigration Portal',
            message='This is a test email to verify your email configuration is working correctly.',
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[test_email],
            fail_silently=False,
        )
        
        if result == 1:
            print("\n✅ SUCCESS! Email sent successfully.")
            print(f"Check the inbox of {test_email}")
        else:
            print("\n❌ FAILED! Email was not sent.")
            
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        print("\nCommon issues:")
        print("1. Gmail: Make sure you're using an App Password, not your regular password")
        print("2. Gmail: Enable 'Less secure app access' or use App Password")
        print("3. Check if EMAIL_HOST_USER and EMAIL_HOST_PASSWORD are correct")
        print("4. Make sure EMAIL_USE_TLS=True for Gmail")

if __name__ == '__main__':
    test_email()
