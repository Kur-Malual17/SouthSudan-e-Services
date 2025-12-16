#!/usr/bin/env python
"""
Script to create staff users (admin, officer, supervisor)
Run: python create_staff.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'immigration_portal.settings')
django.setup()

from django.contrib.auth.models import User
from applications.models import UserProfile

def create_staff_user(username, email, password, role, first_name, last_name):
    """Create a staff user with specified role"""
    try:
        # Check if user exists
        if User.objects.filter(username=username).exists():
            print(f"User '{username}' already exists. Updating role...")
            user = User.objects.get(username=username)
            user.email = email
            user.first_name = first_name
            user.last_name = last_name
            user.set_password(password)
        else:
            # Create new user
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name
            )
            print(f"Created user: {username}")
        
        # Set staff permissions
        user.is_staff = True
        if role == 'admin':
            user.is_superuser = True
        user.save()
        
        # Update profile
        profile = user.profile
        profile.role = role
        profile.phone_number = '+211123456789'
        profile.save()
        
        print(f"✓ {role.upper()}: {username} (password: {password})")
        return user
    except Exception as e:
        print(f"Error creating {username}: {e}")
        return None

if __name__ == '__main__':
    print("Creating staff users...\n")
    
    # Create Admin
    create_staff_user(
        username='admin',
        email='admin@immigration.gov.ss',
        password='admin123',
        role='admin',
        first_name='System',
        last_name='Administrator'
    )
    
    # Create Supervisor
    create_staff_user(
        username='supervisor',
        email='supervisor@immigration.gov.ss',
        password='super123',
        role='supervisor',
        first_name='John',
        last_name='Supervisor'
    )
    
    # Create Officer 1
    create_staff_user(
        username='officer1',
        email='officer1@immigration.gov.ss',
        password='officer123',
        role='officer',
        first_name='Mary',
        last_name='Officer'
    )
    
    # Create Officer 2
    create_staff_user(
        username='officer2',
        email='officer2@immigration.gov.ss',
        password='officer123',
        role='officer',
        first_name='James',
        last_name='Officer'
    )
    
    print("\n" + "="*50)
    print("Staff users created successfully!")
    print("="*50)
    print("\nLogin Credentials:")
    print("-" * 50)
    print("ADMIN:")
    print("  Username: admin")
    print("  Password: admin123")
    print("\nSUPERVISOR:")
    print("  Username: supervisor")
    print("  Password: super123")
    print("\nOFFICER 1:")
    print("  Username: officer1")
    print("  Password: officer123")
    print("\nOFFICER 2:")
    print("  Username: officer2")
    print("  Password: officer123")
    print("-" * 50)
