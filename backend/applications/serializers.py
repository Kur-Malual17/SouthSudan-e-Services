from rest_framework import serializers
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from .models import UserProfile, Application, NewsArticle, BlogPost, GalleryImage

class UserSerializer(serializers.ModelSerializer):
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
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('This email is already registered. Please login instead.')
        return value
    
    def validate_password(self, value):
        if len(value) < 6:
            raise serializers.ValidationError('Password must be at least 6 characters long.')
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
    class Meta:
        model = NewsArticle
        fields = ['id', 'title', 'title_ar', 'content', 'content_ar', 'excerpt', 'excerpt_ar', 
                 'image', 'author', 'author_name', 'published', 'featured', 'created_at', 'updated_at']
        read_only_fields = ['author', 'created_at', 'updated_at']


class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'title_ar', 'content', 'content_ar', 'excerpt', 'excerpt_ar', 
                 'image', 'author', 'author_name', 'category', 'published', 'featured', 
                 'created_at', 'updated_at']
        read_only_fields = ['author', 'created_at', 'updated_at']


class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = ['id', 'title', 'title_ar', 'description', 'description_ar', 'image', 
                 'category', 'author_name', 'published', 'featured', 'uploaded_by', 'created_at']
        read_only_fields = ['uploaded_by', 'created_at']
