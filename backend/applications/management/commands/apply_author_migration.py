from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Manually apply author_name field migration'

    def handle(self, *args, **kwargs):
        with connection.cursor() as cursor:
            try:
                # Check if columns exist
                cursor.execute("""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name='applications_newsarticle' 
                    AND column_name='author_name';
                """)
                news_exists = cursor.fetchone()
                
                cursor.execute("""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name='applications_blogpost' 
                    AND column_name='author_name';
                """)
                blog_exists = cursor.fetchone()
                
                cursor.execute("""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name='applications_galleryimage' 
                    AND column_name='author_name';
                """)
                gallery_exists = cursor.fetchone()
                
                # Add columns if they don't exist
                if not news_exists:
                    self.stdout.write('Adding author_name to NewsArticle...')
                    cursor.execute("""
                        ALTER TABLE applications_newsarticle 
                        ADD COLUMN author_name VARCHAR(200) DEFAULT '' NOT NULL;
                    """)
                    self.stdout.write(self.style.SUCCESS('✓ Added author_name to NewsArticle'))
                else:
                    self.stdout.write(self.style.WARNING('author_name already exists in NewsArticle'))
                
                if not blog_exists:
                    self.stdout.write('Adding author_name to BlogPost...')
                    cursor.execute("""
                        ALTER TABLE applications_blogpost 
                        ADD COLUMN author_name VARCHAR(200) DEFAULT '' NOT NULL;
                    """)
                    self.stdout.write(self.style.SUCCESS('✓ Added author_name to BlogPost'))
                else:
                    self.stdout.write(self.style.WARNING('author_name already exists in BlogPost'))
                
                if not gallery_exists:
                    self.stdout.write('Adding author_name to GalleryImage...')
                    cursor.execute("""
                        ALTER TABLE applications_galleryimage 
                        ADD COLUMN author_name VARCHAR(200) DEFAULT '' NOT NULL;
                    """)
                    self.stdout.write(self.style.SUCCESS('✓ Added author_name to GalleryImage'))
                else:
                    self.stdout.write(self.style.WARNING('author_name already exists in GalleryImage'))
                
                self.stdout.write(self.style.SUCCESS('\n✅ Migration completed successfully!'))
                
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'❌ Error: {str(e)}'))
