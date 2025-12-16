from django.contrib import admin
from django.utils.html import format_html
from .models import UserProfile, Application

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
