from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Fix GalleryImage author_name field'

    def handle(self, *args, **kwargs):
        self.stdout.write('Checking GalleryImage table...')
        
        with connection.cursor() as cursor:
            try:
                # Check if column exists
                cursor.execute("""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name='applications_galleryimage' 
                    AND column_name='author_name';
                """)
                exists = cursor.fetchone()
                
                if exists:
                    self.stdout.write(self.style.WARNING('✓ author_name already exists in GalleryImage'))
                    return
                
                # Try to add the column
                self.stdout.write('Adding author_name column to GalleryImage...')
                cursor.execute("""
                    ALTER TABLE applications_galleryimage 
                    ADD COLUMN author_name VARCHAR(200) DEFAULT '';
                """)
                
                self.stdout.write(self.style.SUCCESS('✅ Successfully added author_name to GalleryImage!'))
                
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'❌ Error: {str(e)}'))
                self.stdout.write('Trying alternative approach...')
                
                try:
                    # Alternative: Add column without default first
                    cursor.execute("""
                        ALTER TABLE applications_galleryimage 
                        ADD COLUMN IF NOT EXISTS author_name VARCHAR(200);
                    """)
                    # Then set default
                    cursor.execute("""
                        ALTER TABLE applications_galleryimage 
                        ALTER COLUMN author_name SET DEFAULT '';
                    """)
                    self.stdout.write(self.style.SUCCESS('✅ Added using alternative method!'))
                except Exception as e2:
                    self.stdout.write(self.style.ERROR(f'❌ Alternative also failed: {str(e2)}'))
