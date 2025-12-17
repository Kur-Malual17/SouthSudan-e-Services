# Generated migration for adding author_name field

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('applications', '0004_newsarticle_galleryimage_blogpost'),
    ]

    operations = [
        migrations.AddField(
            model_name='blogpost',
            name='author_name',
            field=models.CharField(blank=True, default='', help_text='Publisher name (e.g., Juba News Monitor)', max_length=200),
        ),
        migrations.AddField(
            model_name='newsarticle',
            name='author_name',
            field=models.CharField(blank=True, default='', help_text='Publisher name (e.g., Juba News Monitor)', max_length=200),
        ),
        migrations.AddField(
            model_name='galleryimage',
            name='author_name',
            field=models.CharField(blank=True, default='', help_text="Photographer or source (e.g., 'Immigration Department')", max_length=200),
        ),
    ]
