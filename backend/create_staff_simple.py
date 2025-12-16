import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'immigration_portal.settings')
django.setup()

from django.contrib.auth.models import User
from applications.models import UserProfile

print("Creating staff users...\n")

# Admin
try:
    admin = User.objects.filter(username='admin').first()
    if admin:
        print("Admin user already exists, updating...")
        admin.email = 'admin@immigration.gov.ss'
        admin.first_name = 'System'
        admin.last_name = 'Administrator'
        admin.set_password('admin123')
        admin.is_staff = True
        admin.is_superuser = True
        admin.save()
    else:
        admin = User.objects.create_user(
            username='admin',
            email='admin@immigration.gov.ss',
            password='admin123',
            first_name='System',
            last_name='Administrator'
        )
        admin.is_staff = True
        admin.is_superuser = True
        admin.save()
    
    admin.profile.role = 'admin'
    admin.profile.phone_number = '+211123456789'
    admin.profile.save()
    print("✓ ADMIN: admin / admin123")
except Exception as e:
    print(f"Error creating admin: {e}")

# Supervisor
try:
    supervisor = User.objects.filter(username='supervisor').first()
    if supervisor:
        print("Supervisor user already exists, updating...")
        supervisor.email = 'supervisor@immigration.gov.ss'
        supervisor.first_name = 'John'
        supervisor.last_name = 'Supervisor'
        supervisor.set_password('super123')
        supervisor.is_staff = True
        supervisor.save()
    else:
        supervisor = User.objects.create_user(
            username='supervisor',
            email='supervisor@immigration.gov.ss',
            password='super123',
            first_name='John',
            last_name='Supervisor'
        )
        supervisor.is_staff = True
        supervisor.save()
    
    supervisor.profile.role = 'supervisor'
    supervisor.profile.phone_number = '+211123456789'
    supervisor.profile.save()
    print("✓ SUPERVISOR: supervisor / super123")
except Exception as e:
    print(f"Error creating supervisor: {e}")

# Officer
try:
    officer = User.objects.filter(username='officer1').first()
    if officer:
        print("Officer user already exists, updating...")
        officer.email = 'officer1@immigration.gov.ss'
        officer.first_name = 'Mary'
        officer.last_name = 'Officer'
        officer.set_password('officer123')
        officer.is_staff = True
        officer.save()
    else:
        officer = User.objects.create_user(
            username='officer1',
            email='officer1@immigration.gov.ss',
            password='officer123',
            first_name='Mary',
            last_name='Officer'
        )
        officer.is_staff = True
        officer.save()
    
    officer.profile.role = 'officer'
    officer.profile.phone_number = '+211123456789'
    officer.profile.save()
    print("✓ OFFICER: officer1 / officer123")
except Exception as e:
    print(f"Error creating officer: {e}")

print("\n" + "="*60)
print("Staff users created/updated successfully!")
print("="*60)
print("\nLOGIN CREDENTIALS:")
print("-"*60)
print("ADMIN:")
print("  Email: admin@immigration.gov.ss")
print("  Username: admin")
print("  Password: admin123")
print("  Dashboard: http://localhost:5173/admin")
print()
print("SUPERVISOR:")
print("  Email: supervisor@immigration.gov.ss")
print("  Username: supervisor")
print("  Password: super123")
print("  Dashboard: http://localhost:5173/admin")
print()
print("OFFICER:")
print("  Email: officer1@immigration.gov.ss")
print("  Username: officer1")
print("  Password: officer123")
print("  Dashboard: http://localhost:5173/admin")
print("-"*60)
print("\nNOTE: Login at http://localhost:3000/login using email or username")
print("After login, you'll see 'Admin Dashboard' link in navigation")
