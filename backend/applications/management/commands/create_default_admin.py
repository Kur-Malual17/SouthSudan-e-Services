"""
Django management command to create default admin user
Run with: python manage.py create_default_admin
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from applications.models import UserProfile


class Command(BaseCommand):
    help = 'Creates default admin, supervisor, and officer users if they do not exist'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING('Creating default staff users...'))
        self.stdout.write('')

        # Admin
        try:
            admin, created = User.objects.get_or_create(
                username='admin',
                defaults={
                    'email': 'admin@immigration.gov.ss',
                    'first_name': 'System',
                    'last_name': 'Administrator',
                    'is_staff': True,
                    'is_superuser': True,
                }
            )
            
            if created:
                admin.set_password('admin123')
                admin.save()
                self.stdout.write(self.style.SUCCESS('✓ Created ADMIN user'))
            else:
                # Update existing admin
                admin.email = 'admin@immigration.gov.ss'
                admin.first_name = 'System'
                admin.last_name = 'Administrator'
                admin.is_staff = True
                admin.is_superuser = True
                admin.set_password('admin123')
                admin.save()
                self.stdout.write(self.style.WARNING('✓ Updated ADMIN user'))
            
            # Ensure profile exists and set role
            profile, _ = UserProfile.objects.get_or_create(user=admin)
            profile.role = 'admin'
            profile.phone_number = '+211123456789'
            profile.save()
            
            self.stdout.write(f'  Email: admin@immigration.gov.ss')
            self.stdout.write(f'  Username: admin')
            self.stdout.write(f'  Password: admin123')
            self.stdout.write('')
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'✗ Error creating admin: {e}'))

        # Supervisor
        try:
            supervisor, created = User.objects.get_or_create(
                username='supervisor',
                defaults={
                    'email': 'supervisor@immigration.gov.ss',
                    'first_name': 'John',
                    'last_name': 'Supervisor',
                    'is_staff': True,
                }
            )
            
            if created:
                supervisor.set_password('super123')
                supervisor.save()
                self.stdout.write(self.style.SUCCESS('✓ Created SUPERVISOR user'))
            else:
                supervisor.email = 'supervisor@immigration.gov.ss'
                supervisor.first_name = 'John'
                supervisor.last_name = 'Supervisor'
                supervisor.is_staff = True
                supervisor.set_password('super123')
                supervisor.save()
                self.stdout.write(self.style.WARNING('✓ Updated SUPERVISOR user'))
            
            profile, _ = UserProfile.objects.get_or_create(user=supervisor)
            profile.role = 'supervisor'
            profile.phone_number = '+211123456789'
            profile.save()
            
            self.stdout.write(f'  Email: supervisor@immigration.gov.ss')
            self.stdout.write(f'  Username: supervisor')
            self.stdout.write(f'  Password: super123')
            self.stdout.write('')
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'✗ Error creating supervisor: {e}'))

        # Officer
        try:
            officer, created = User.objects.get_or_create(
                username='officer1',
                defaults={
                    'email': 'officer1@immigration.gov.ss',
                    'first_name': 'Mary',
                    'last_name': 'Officer',
                    'is_staff': True,
                }
            )
            
            if created:
                officer.set_password('officer123')
                officer.save()
                self.stdout.write(self.style.SUCCESS('✓ Created OFFICER user'))
            else:
                officer.email = 'officer1@immigration.gov.ss'
                officer.first_name = 'Mary'
                officer.last_name = 'Officer'
                officer.is_staff = True
                officer.set_password('officer123')
                officer.save()
                self.stdout.write(self.style.WARNING('✓ Updated OFFICER user'))
            
            profile, _ = UserProfile.objects.get_or_create(user=officer)
            profile.role = 'officer'
            profile.phone_number = '+211123456789'
            profile.save()
            
            self.stdout.write(f'  Email: officer1@immigration.gov.ss')
            self.stdout.write(f'  Username: officer1')
            self.stdout.write(f'  Password: officer123')
            self.stdout.write('')
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'✗ Error creating officer: {e}'))

        self.stdout.write(self.style.SUCCESS('='*60))
        self.stdout.write(self.style.SUCCESS('Staff users created/updated successfully!'))
        self.stdout.write(self.style.SUCCESS('='*60))
        self.stdout.write('')
        self.stdout.write(self.style.WARNING('⚠️  IMPORTANT: Change these default passwords immediately!'))
        self.stdout.write('')
        self.stdout.write('Login at: https://south-sudan-e-services.vercel.app/login')
        self.stdout.write('Use email or username with the password shown above')
