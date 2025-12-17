#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate

# Apply author_name migration manually (fallback)
echo "Applying author_name field migration..."
python manage.py apply_author_migration || echo "Migration command failed or already applied"

# Fix Gallery specifically
echo "Fixing GalleryImage author_name field..."
python manage.py fix_gallery_author || echo "Gallery fix failed or already applied"

# Create default admin users
echo "Creating default admin users..."
python manage.py create_default_admin
