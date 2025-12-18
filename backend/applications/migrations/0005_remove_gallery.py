# Generated manually to remove gallery feature

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('applications', '0004_newsarticle_galleryimage_blogpost'),
    ]

    operations = [
        # Remove GalleryImage model completely
        migrations.DeleteModel(
            name='GalleryImage',
        ),
    ]
