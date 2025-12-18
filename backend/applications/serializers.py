from rest_framework import serializers
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.core.validators import EmailValidator
from .models import UserProfile, Application, NewsArticle, BlogPost
import re

class UserSerializer(serializers.ModelSerializer):
    def validate_email(self, value):
        """Validate email format"""
        email_validator = EmailValidator()
        try:
            email_validator(value)
        except ValidationError:
            raise serializers.ValidationError("Please enter a valid email address")
        return value.lower()
    
    def validate_first_name(self, value):
        """Validate first name - only letters, must start with capital"""
        if not value:
            raise serializers.ValidationError("First name is required")
        
        if len(value) < 2:
            raise serializers.ValidationError("First name must be at least 2 characters")
        
        if not re.match(r'^[A-Za-z\s\-\']+$', value):
            raise serializers.ValidationError("First name can only contain letters, spaces, hyphens, and apostrophes")
        
        if not value[0].isupper():
            raise serializers.ValidationError("First name must start with a capital letter")
        
        return value
    
    def validate_last_name(self, value):
        """Validate last name - only letters, must start with capital"""
        if not value:
            raise serializers.ValidationError("Last name is required")
        
        if len(value) < 2:
            raise serializers.ValidationError("Last name must be at least 2 characters")
        
        if not re.match(r'^[A-Za-z\s\-\']+$', value):
            raise serializers.ValidationError("Last name can only contain letters, spaces, hyphens, and apostrophes")
        
        if not value[0].isupper():
            raise serializers.ValidationError("Last name must start with a capital letter")
        
        return value
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'phone_number', 'role', 'is_active', 'created_at']

class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)
    phone_number = serializers.CharField(max_length=20)
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('This email is already registered. Please login instead.')
        return value
    
    def validate_email(self, value):
        """Validate email format"""
        email_validator = EmailValidator()
        try:
            email_validator(value)
        except ValidationError:
            raise serializers.ValidationError("Please enter a valid email address")
        
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('This email is already registered. Please login instead.')
        return value.lower()
    
    def validate_password(self, value):
        """
        Validate password strength:
        - Minimum 6 characters
        - At least one uppercase letter
        - At least one lowercase letter
        - At least one digit
        - At least one special character
        """
        if len(value) < 6:
            raise serializers.ValidationError('Password must be at least 6 characters long')
        
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError('Password must contain at least one uppercase letter')
        
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError('Password must contain at least one lowercase letter')
        
        if not re.search(r'[0-9]', value):
            raise serializers.ValidationError('Password must contain at least one digit')
        
        if not re.search(r'[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]', value):
            raise serializers.ValidationError('Password must contain at least one special character (!@#$%^&*...)')
        
        return value
    
    def validate_first_name(self, value):
        """Validate first name - only letters, must start with capital"""
        if not value:
            raise serializers.ValidationError("First name is required")
        
        if len(value) < 2:
            raise serializers.ValidationError("First name must be at least 2 characters")
        
        if not re.match(r'^[A-Za-z\s\-\']+$', value):
            raise serializers.ValidationError("First name can only contain letters, spaces, hyphens, and apostrophes")
        
        if not value[0].isupper():
            raise serializers.ValidationError("First name must start with a capital letter")
        
        return value
    
    def validate_last_name(self, value):
        """Validate last name - only letters, must start with capital"""
        if not value:
            raise serializers.ValidationError("Last name is required")
        
        if len(value) < 2:
            raise serializers.ValidationError("Last name must be at least 2 characters")
        
        if not re.match(r'^[A-Za-z\s\-\']+$', value):
            raise serializers.ValidationError("Last name can only contain letters, spaces, hyphens, and apostrophes")
        
        if not value[0].isupper():
            raise serializers.ValidationError("Last name must start with a capital letter")
        
        return value
    
    def validate_phone_number(self, value):
        """Validate phone number - 10-15 digits"""
        # Remove spaces and dashes
        clean_phone = re.sub(r'[\s\-]', '', value)
        
        if not re.match(r'^\+?[0-9]{10,15}$', clean_phone):
            raise serializers.ValidationError("Please enter a valid phone number (10-15 digits)")
        
        return value
    
    def create(self, validated_data):
        phone_number = validated_data.pop('phone_number')
        user = User.objects.create_user(**validated_data)
        # Update the profile created by signal
        user.profile.phone_number = phone_number
        user.profile.save()
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

class ApplicationSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    reviewed_by_details = UserSerializer(source='reviewed_by', read_only=True)
    duplicate_receipt_warning = serializers.SerializerMethodField()
    
    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ['confirmation_number', 'user', 'reviewed_by', 'reviewed_at', 'approved_pdf', 'payment_proof_hash']
    
    def get_duplicate_receipt_warning(self, obj):
        """Check if payment receipt is duplicated"""
        if obj.payment_proof_hash:
            duplicates = Application.objects.filter(
                payment_proof_hash=obj.payment_proof_hash
            ).exclude(pk=obj.pk)
            
            if duplicates.exists():
                return {
                    'is_duplicate': True,
                    'message': 'This payment receipt has been used in other applications',
                    'duplicate_applications': [
                        {
                            'confirmation_number': dup.confirmation_number,
                            'status': dup.status,
                            'application_type': dup.application_type
                        }
                        for dup in duplicates
                    ]
                }
        return {'is_duplicate': False}
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        try:
            return super().create(validated_data)
        except ValidationError as e:
            # Re-raise with proper format for DRF
            from rest_framework.exceptions import ValidationError as DRFValidationError
            if isinstance(e.messages, list) and len(e.messages) > 0:
                raise DRFValidationError({'payment_proof': e.messages[0]})
            raise DRFValidationError({'error': str(e)})
    
    def update(self, instance, validated_data):
        try:
            return super().update(instance, validated_data)
        except ValidationError as e:
            # Re-raise with proper format for DRF
            from rest_framework.exceptions import ValidationError as DRFValidationError
            if isinstance(e.messages, list) and len(e.messages) > 0:
                raise DRFValidationError({'payment_proof': e.messages[0]})
            raise DRFValidationError({'error': str(e)})

class ApplicationListSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    
    class Meta:
        model = Application
        fields = ['id', 'confirmation_number', 'application_type', 'status', 'first_name', 
                 'last_name', 'email', 'phone_number', 'payment_status', 'created_at', 'user_details']


class NewsArticleSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    def get_image_url(self, obj):
        """Safely get image URL"""
        try:
            if obj.image and hasattr(obj.image, 'url'):
                return obj.image.url
        except Exception:
            return None
        return None
    
    class Meta:
        model = NewsArticle
        fields = ['id', 'title', 'title_ar', 'content', 'content_ar', 'excerpt', 'excerpt_ar', 
                 'image', 'image_url', 'author', 'author_name', 'published', 'featured', 'created_at', 'updated_at']
        read_only_fields = ['author', 'created_at', 'updated_at', 'image_url']


class BlogPostSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    def get_image_url(self, obj):
        """Safely get image URL"""
        try:
            if obj.image and hasattr(obj.image, 'url'):
                return obj.image.url
        except Exception:
            return None
        return None
    
    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'title_ar', 'content', 'content_ar', 'excerpt', 'excerpt_ar', 
                 'image', 'image_url', 'author', 'author_name', 'category', 'published', 'featured', 
                 'created_at', 'updated_at']
        read_only_fields = ['author', 'created_at', 'updated_at', 'image_url']



