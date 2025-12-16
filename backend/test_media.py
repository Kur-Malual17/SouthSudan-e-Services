#!/usr/bin/env python
"""
Test if media files are accessible
Run: python test_media.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'immigration_portal.settings')
django.setup()

from django.conf import settings
from applications.models import Application

print("="*60)
print("MEDIA CONFIGURATION TEST")
print("="*60)

print(f"\nMEDIA_URL: {settings.MEDIA_URL}")
print(f"MEDIA_ROOT: {settings.MEDIA_ROOT}")
print(f"DEBUG: {settings.DEBUG}")

print(f"\nMEDIA_ROOT exists: {os.path.exists(settings.MEDIA_ROOT)}")

if os.path.exists(settings.MEDIA_ROOT):
    print(f"\nFiles in MEDIA_ROOT:")
    for root, dirs, files in os.walk(settings.MEDIA_ROOT):
        level = root.replace(settings.MEDIA_ROOT, '').count(os.sep)
        indent = ' ' * 2 * level
        print(f'{indent}{os.path.basename(root)}/')
        subindent = ' ' * 2 * (level + 1)
        for file in files[:5]:  # Show first 5 files
            print(f'{subindent}{file}')
        if len(files) > 5:
            print(f'{subindent}... and {len(files) - 5} more files')

print("\n" + "="*60)
print("APPLICATION FILES TEST")
print("="*60)

apps = Application.objects.all()[:3]
for app in apps:
    print(f"\nApplication ID: {app.id}")
    print(f"Confirmation: {app.confirmation_number}")
    
    if app.photo:
        photo_path = os.path.join(settings.MEDIA_ROOT, str(app.photo))
        print(f"  Photo: {app.photo}")
        print(f"  Full path: {photo_path}")
        print(f"  Exists: {os.path.exists(photo_path)}")
        print(f"  URL: http://localhost:8000{settings.MEDIA_URL}{app.photo}")
    
    if app.id_copy:
        id_path = os.path.join(settings.MEDIA_ROOT, str(app.id_copy))
        print(f"  ID Copy: {app.id_copy}")
        print(f"  Full path: {id_path}")
        print(f"  Exists: {os.path.exists(id_path)}")
        print(f"  URL: http://localhost:8000{settings.MEDIA_URL}{app.id_copy}")
    
    if app.signature:
        sig_path = os.path.join(settings.MEDIA_ROOT, str(app.signature))
        print(f"  Signature: {app.signature}")
        print(f"  Full path: {sig_path}")
        print(f"  Exists: {os.path.exists(sig_path)}")
        print(f"  URL: http://localhost:8000{settings.MEDIA_URL}{app.signature}")

print("\n" + "="*60)
print("NEXT STEPS")
print("="*60)
print("\n1. Make sure Django server is running:")
print("   cd backend")
print("   python manage.py runserver")
print("\n2. Test URLs in browser:")
print("   Open the URLs shown above in your browser")
print("\n3. If files exist but URLs don't work:")
print("   - Restart Django server")
print("   - Check CORS settings")
print("   - Check browser console for errors")
print("\n" + "="*60)
