from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
import random
import string
import hashlib

class UserProfile(models.Model):
    """Extended user profile"""
    ROLE_CHOICES = [
        ('applicant', 'Applicant'),
        ('officer', 'Officer'),
        ('supervisor', 'Supervisor'),
        ('admin', 'Admin'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone_number = models.CharField(max_length=20)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='applicant')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.role}"


class Application(models.Model):
    """Main application model"""
    
    TYPE_CHOICES = [
        ('passport-first', 'e-Passport First-Time'),
        ('passport-replacement', 'e-Passport Replacement'),
        ('nationalid-first', 'National ID First-Time'),
        ('nationalid-replacement', 'National ID Replacement'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in-progress', 'In Progress'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('collected', 'Collected'),
    ]
    
    PAYMENT_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
    ]
    
    MARITAL_CHOICES = [
        ('single', 'Single'),
        ('married', 'Married'),
        ('divorced', 'Divorced'),
        ('widowed', 'Widowed'),
    ]
    
    APPLICANT_TYPE_CHOICES = [
        ('above18', 'Above 18'),
        ('below18', 'Below 18'),
    ]
    
    PASSPORT_TYPE_CHOICES = [
        ('2-year', '2 Years'),
        ('5-year', '5 Years'),
        ('10-year', '10 Years'),
    ]
    
    REPLACEMENT_REASON_CHOICES = [
        ('lost', 'Lost'),
        ('stolen', 'Stolen'),
        ('damaged', 'Damaged'),
        ('expired', 'Expired'),
        ('correction', 'Correction'),
    ]
    
    # Basic Information
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    application_type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    confirmation_number = models.CharField(max_length=50, unique=True, blank=True)
    
    # Personal Details
    applicant_type = models.CharField(max_length=10, choices=APPLICANT_TYPE_CHOICES, null=True, blank=True)
    national_id_number = models.CharField(max_length=50, null=True, blank=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, null=True, blank=True)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    nationality = models.CharField(max_length=100)
    father_name = models.CharField(max_length=200)
    mother_name = models.CharField(max_length=200)
    marital_status = models.CharField(max_length=20, choices=MARITAL_CHOICES)
    profession = models.CharField(max_length=100, null=True, blank=True)
    employer = models.CharField(max_length=200, null=True, blank=True)
    height = models.IntegerField(null=True, blank=True)
    other_nationality = models.CharField(max_length=100, null=True, blank=True)
    other_passport_number = models.CharField(max_length=50, null=True, blank=True)
    
    # Contact Details
    phone_number = models.CharField(max_length=20)
    email = models.EmailField()
    country = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    place_of_residence = models.CharField(max_length=200)
    
    # Birth Location
    birth_country = models.CharField(max_length=100)
    birth_state = models.CharField(max_length=100)
    birth_city = models.CharField(max_length=100)
    
    # Passport Specific
    passport_type = models.CharField(max_length=10, choices=PASSPORT_TYPE_CHOICES, null=True, blank=True)
    travel_purpose = models.CharField(max_length=200, null=True, blank=True)
    destination_country = models.CharField(max_length=100, null=True, blank=True)
    destination_city = models.CharField(max_length=100, null=True, blank=True)
    
    # Replacement Specific
    replacement_reason = models.CharField(max_length=20, choices=REPLACEMENT_REASON_CHOICES, null=True, blank=True)
    
    # Document Attachments
    photo = models.ImageField(upload_to='documents/photos/', null=True, blank=True)
    id_copy = models.FileField(upload_to='documents/ids/', null=True, blank=True)
    signature = models.ImageField(upload_to='documents/signatures/', null=True, blank=True)
    birth_certificate = models.FileField(upload_to='documents/certificates/', null=True, blank=True)
    old_document = models.FileField(upload_to='documents/old/', null=True, blank=True)
    police_report = models.FileField(upload_to='documents/reports/', null=True, blank=True)
    civil_registry_number = models.CharField(max_length=100, null=True, blank=True)
    
    # Payment Information
    PAYMENT_METHOD_CHOICES = [
        ('momo', 'Mobile Money (MTN/Airtel)'),
        ('credit_card', 'Credit/Debit Card'),
        ('bank', 'Bank Transfer'),
    ]
    
    payment_status = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default='pending')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, null=True, blank=True)
    payment_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    payment_reference = models.CharField(max_length=100, null=True, blank=True)
    payment_proof = models.ImageField(upload_to='payment_proofs/', null=True, blank=True)
    payment_proof_hash = models.CharField(max_length=64, null=True, blank=True, db_index=True)
    payment_date = models.DateTimeField(null=True, blank=True)
    payment_verified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='verified_payments')
    payment_verified_at = models.DateTimeField(null=True, blank=True)
    payment_rejection_reason = models.TextField(null=True, blank=True)
    
    # Admin Actions
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_applications')
    reviewed_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(null=True, blank=True)
    approved_pdf = models.FileField(upload_to='approved_pdfs/', null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['confirmation_number']),
            models.Index(fields=['status']),
            models.Index(fields=['application_type']),
            models.Index(fields=['user']),
        ]
    
    def _calculate_file_hash(self, file_field):
        """Calculate SHA-256 hash of a file"""
        try:
            hasher = hashlib.sha256()
            
            # Reset file pointer to beginning
            if hasattr(file_field, 'seek'):
                file_field.seek(0)
            
            # Read file in chunks to handle large files
            if hasattr(file_field, 'chunks'):
                for chunk in file_field.chunks():
                    hasher.update(chunk)
            else:
                # For already saved files
                file_field.open('rb')
                for chunk in iter(lambda: file_field.read(4096), b''):
                    hasher.update(chunk)
                file_field.close()
            
            # Reset file pointer again
            if hasattr(file_field, 'seek'):
                file_field.seek(0)
            
            return hasher.hexdigest()
        except Exception as e:
            # If hash calculation fails, return None (don't block the save)
            print(f"Error calculating file hash: {e}")
            return None
    
    def _check_duplicate_payment_proof(self):
        """Check if payment proof is a duplicate and update hash"""
        if self.payment_proof:
            try:
                # Calculate hash of the uploaded file
                file_hash = self._calculate_file_hash(self.payment_proof)
                
                if file_hash:
                    # Only check for duplicates if the hash has changed
                    # This prevents false positives when updating other fields
                    if file_hash != self.payment_proof_hash:
                        # Check if this hash already exists in another application
                        duplicate = Application.objects.filter(
                            payment_proof_hash=file_hash
                        ).exclude(pk=self.pk).first()
                        
                        if duplicate:
                            raise ValidationError(
                                f'This payment receipt has already been used for application {duplicate.confirmation_number}. Each payment receipt can only be used once.'
                            )
                        
                        # Store the new hash
                        self.payment_proof_hash = file_hash
            except ValidationError:
                raise
            except Exception as e:
                # Don't block save if hash check fails
                print(f"Error checking duplicate payment proof: {e}")
    
    def save(self, *args, **kwargs):
        # Generate confirmation number if needed
        if not self.confirmation_number:
            # Use current time for new applications
            import time
            timestamp = str(int(time.time()))[-8:]
            random_part = ''.join(random.choices(string.digits, k=3))
            conf_num = f"SS-IMM-{timestamp}-{random_part}"
            
            # Ensure uniqueness
            counter = 0
            while Application.objects.filter(confirmation_number=conf_num).exists():
                counter += 1
                random_part = ''.join(random.choices(string.digits, k=3))
                conf_num = f"SS-IMM-{timestamp}-{random_part}"
                if counter > 100:  # Safety limit
                    break
            
            self.confirmation_number = conf_num
        
        # Check for duplicate payment proof (only if payment_proof exists)
        if self.payment_proof:
            self._check_duplicate_payment_proof()
        
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.confirmation_number} - {self.get_application_type_display()}"


class NewsArticle(models.Model):
    """News articles for the homepage"""
    title = models.CharField(max_length=200)
    title_ar = models.CharField(max_length=200, blank=True, help_text="Arabic translation of title")
    content = models.TextField()
    content_ar = models.TextField(blank=True, help_text="Arabic translation of content")
    excerpt = models.CharField(max_length=300, help_text="Short summary for preview")
    excerpt_ar = models.CharField(max_length=300, blank=True, help_text="Arabic translation of excerpt")
    image = models.ImageField(upload_to='news/', null=True, blank=True)
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    author_name = models.CharField(max_length=200, blank=True, help_text="Publisher name (e.g., Juba News Monitor)")
    published = models.BooleanField(default=True)
    featured = models.BooleanField(default=False, help_text="Show in featured section")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'News Article'
        verbose_name_plural = 'News Articles'
    
    def __str__(self):
        return self.title


class BlogPost(models.Model):
    """Blog posts for the homepage"""
    title = models.CharField(max_length=200)
    title_ar = models.CharField(max_length=200, blank=True, help_text="Arabic translation of title")
    content = models.TextField()
    content_ar = models.TextField(blank=True, help_text="Arabic translation of content")
    excerpt = models.CharField(max_length=300, help_text="Short summary for preview")
    excerpt_ar = models.CharField(max_length=300, blank=True, help_text="Arabic translation of excerpt")
    image = models.ImageField(upload_to='blog/', null=True, blank=True)
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    author_name = models.CharField(max_length=200, blank=True, help_text="Publisher name (e.g., Juba News Monitor)")
    category = models.CharField(max_length=100, blank=True, help_text="e.g., Tips, Updates, Guides")
    published = models.BooleanField(default=True)
    featured = models.BooleanField(default=False, help_text="Show in featured section")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Blog Post'
        verbose_name_plural = 'Blog Posts'
    
    def __str__(self):
        return self.title


class GalleryImage(models.Model):
    """Gallery images for the homepage"""
    title = models.CharField(max_length=200)
    title_ar = models.CharField(max_length=200, blank=True, help_text="Arabic translation of title")
    description = models.TextField(blank=True)
    description_ar = models.TextField(blank=True, help_text="Arabic translation of description")
    image = models.ImageField(upload_to='gallery/')
    category = models.CharField(max_length=100, blank=True, help_text="e.g., Events, Facilities, Staff")
    author_name = models.CharField(max_length=200, blank=True, help_text="Photographer or source (e.g., 'Immigration Department')")
    published = models.BooleanField(default=True)
    featured = models.BooleanField(default=False, help_text="Show in featured section")
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Gallery Image'
        verbose_name_plural = 'Gallery Images'
    
    def __str__(self):
        return self.title
