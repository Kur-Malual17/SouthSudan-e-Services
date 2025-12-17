# Generated manually for adding author_name field

from django.db import migrations, models
import django.db.models.deletion


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
        migrations.AlterField(
            model_name='blogpost',
            name='author',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='auth.user'),
        ),
        migrations.AlterField(
            model_name='newsarticle',
            name='author',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='auth.user'),
        ),
        migrations.AlterField(
            model_name='galleryimage',
            name='uploaded_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='auth.user'),
        ),
    ]
