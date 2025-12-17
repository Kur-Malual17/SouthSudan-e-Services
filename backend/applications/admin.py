from django.contrib import admin
from django.utils.html import format_html
from .models import UserProfile, Application, NewsArticle, BlogPost, GalleryImage

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'phone_number', 'role', 'is_active', 'created_at']
    list_filter = ['role', 'is_active']
    search_fields = ['user__username', 'user__email', 'phone_number']

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ['confirmation_number', 'application_type', 'first_name', 'last_name', 'status', 'payment_duplicate_warning', 'created_at']
    list_filter = ['status', 'application_type', 'payment_status']
    search_fields = ['confirmation_number', 'first_name', 'last_name', 'email', 'national_id_number']
    readonly_fields = ['confirmation_number', 'created_at', 'updated_at', 'payment_proof_hash', 'duplicate_receipt_check']
    
    def payment_duplicate_warning(self, obj):
        """Show warning icon if payment receipt is duplicated"""
        if obj.payment_proof_hash:
            duplicate_count = Application.objects.filter(
                payment_proof_hash=obj.payment_proof_hash
            ).exclude(pk=obj.pk).count()
            
            if duplicate_count > 0:
                return format_html(
                    '<span style="color: red; font-weight: bold;">⚠️ DUPLICATE</span>'
                )
        return '✓'
    payment_duplicate_warning.short_description = 'Payment Check'
    
    def duplicate_receipt_check(self, obj):
        """Show detailed info about duplicate receipts"""
        if not obj.payment_proof_hash:
            return "No payment receipt uploaded"
        
        duplicates = Application.objects.filter(
            payment_proof_hash=obj.payment_proof_hash
        ).exclude(pk=obj.pk)
        
        if duplicates.exists():
            duplicate_list = '<br>'.join([
                f'<a href="/admin/applications/application/{dup.pk}/change/">{dup.confirmation_number}</a> - {dup.get_status_display()}'
                for dup in duplicates
            ])
            return format_html(
                '<div style="color: red; font-weight: bold;">⚠️ WARNING: This payment receipt has been used in other applications:</div>'
                '<div style="margin-top: 10px;">{}</div>',
                duplicate_list
            )
        return format_html('<span style="color: green;">✓ Unique payment receipt</span>')
    duplicate_receipt_check.short_description = 'Duplicate Receipt Check'
    
    fieldsets = (
        ('Application Info', {
            'fields': ('confirmation_number', 'application_type', 'status', 'user')
        }),
        ('Personal Details', {
            'fields': ('first_name', 'middle_name', 'last_name', 'date_of_birth', 'gender', 
                      'nationality', 'national_id_number', 'father_name', 'mother_name', 'marital_status')
        }),
        ('Contact Information', {
            'fields': ('phone_number', 'email', 'country', 'state', 'city', 'place_of_residence')
        }),
        ('Documents', {
            'fields': ('photo', 'id_copy', 'signature', 'birth_certificate', 'old_document', 'police_report')
        }),
        ('Payment', {
            'fields': ('payment_status', 'payment_amount', 'payment_date', 'payment_proof', 
                      'payment_proof_hash', 'duplicate_receipt_check', 'payment_method', 'payment_reference')
        }),
        ('Admin Actions', {
            'fields': ('reviewed_by', 'reviewed_at', 'rejection_reason', 'approved_pdf')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )



@admin.register(NewsArticle)
class NewsArticleAdmin(admin.ModelAdmin):
    list_display = ['title', 'get_author_display', 'published', 'featured', 'created_at']
    list_filter = ['published', 'featured', 'created_at']
    search_fields = ['title', 'title_ar', 'content', 'content_ar']
    readonly_fields = ['created_at', 'updated_at']
    
    def get_author_display(self, obj):
        return obj.author_name if hasattr(obj, 'author_name') and obj.author_name else '-'
    get_author_display.short_description = 'Author'
    
    fieldsets = (
        ('English Content', {
            'fields': ('title', 'excerpt', 'content', 'image')
        }),
        ('Arabic Translation', {
            'fields': ('title_ar', 'excerpt_ar', 'content_ar'),
            'classes': ('collapse',)
        }),
        ('Settings', {
            'fields': ('author_name', 'published', 'featured')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if not obj.author:
            obj.author = request.user
        super().save_model(request, obj, form, change)


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'get_author_display', 'published', 'featured', 'created_at']
    list_filter = ['published', 'featured', 'category', 'created_at']
    search_fields = ['title', 'title_ar', 'content', 'content_ar', 'category']
    readonly_fields = ['created_at', 'updated_at']
    
    def get_author_display(self, obj):
        return obj.author_name if hasattr(obj, 'author_name') and obj.author_name else '-'
    get_author_display.short_description = 'Author'
    
    fieldsets = (
        ('English Content', {
            'fields': ('title', 'excerpt', 'content', 'image', 'category')
        }),
        ('Arabic Translation', {
            'fields': ('title_ar', 'excerpt_ar', 'content_ar'),
            'classes': ('collapse',)
        }),
        ('Settings', {
            'fields': ('author_name', 'published', 'featured')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if not obj.author:
            obj.author = request.user
        super().save_model(request, obj, form, change)


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'published', 'featured', 'image_preview', 'created_at']
    list_filter = ['published', 'featured', 'category', 'created_at']
    search_fields = ['title', 'title_ar', 'description', 'description_ar', 'category']
    readonly_fields = ['created_at', 'image_preview']
    
    fieldsets = (
        ('English Content', {
            'fields': ('title', 'description', 'image', 'image_preview', 'category')
        }),
        ('Arabic Translation', {
            'fields': ('title_ar', 'description_ar'),
            'classes': ('collapse',)
        }),
        ('Settings', {
            'fields': ('author_name', 'published', 'featured')
        }),
        ('Timestamp', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def image_preview(self, obj):
        """Safely display image preview"""
        try:
            if obj.image and hasattr(obj.image, 'url'):
                return format_html('<img src="{}" style="max-height: 200px; max-width: 300px;" />', obj.image.url)
        except Exception:
            return "Image error"
        return "No image"
    image_preview.short_description = 'Preview'
    
    def save_model(self, request, obj, form, change):
        if not obj.uploaded_by:
            obj.uploaded_by = request.user
        super().save_model(request, obj, form, change)
