from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.db.models import Count, Q
from django.utils import timezone
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.utils.decorators import method_decorator
from .models import Application, UserProfile
from .serializers import (
    ApplicationSerializer, ApplicationListSerializer,
    RegisterSerializer, LoginSerializer, UserSerializer, UserProfileSerializer
)
from .utils import generate_pdf, send_approval_email, send_rejection_email, send_application_received_email
from .payment_service import PaystackService
from decouple import config

# CSRF Token View
@api_view(['GET'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def get_csrf_token(request):
    """Get CSRF token"""
    return Response({'success': True})

# Authentication Views
@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """Register a new user"""
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        try:
            user = serializer.save()
            login(request, user)
            return Response({
                'success': True,
                'user': UserSerializer(user).data,
                'profile': UserProfileSerializer(user.profile).data
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            error_msg = str(e)
            if 'duplicate key' in error_msg or 'already exists' in error_msg:
                return Response({
                    'error': 'This email is already registered. Please login instead.'
                }, status=status.HTTP_400_BAD_REQUEST)
            return Response({
                'error': 'Registration failed. Please try again.'
            }, status=status.HTTP_400_BAD_REQUEST)
    else:
        # Return specific validation errors
        errors = serializer.errors
        if 'username' in errors:
            return Response({'error': errors['username'][0]}, status=status.HTTP_400_BAD_REQUEST)
        elif 'email' in errors:
            return Response({'error': errors['email'][0]}, status=status.HTTP_400_BAD_REQUEST)
        elif 'password' in errors:
            return Response({'error': errors['password'][0]}, status=status.HTTP_400_BAD_REQUEST)
        elif 'first_name' in errors:
            return Response({'error': 'First name is required'}, status=status.HTTP_400_BAD_REQUEST)
        elif 'last_name' in errors:
            return Response({'error': 'Last name is required'}, status=status.HTTP_400_BAD_REQUEST)
        elif 'phone_number' in errors:
            return Response({'error': 'Phone number is required'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Please fill all required fields correctly'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def login_view(request):
    """Login user"""
    username_or_email = request.data.get('username')
    password = request.data.get('password')
    
    # Check if fields are provided
    if not username_or_email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    if not password:
        return Response({'error': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Try to find user by email or username
    user_obj = None
    try:
        # First try to find by email
        if '@' in username_or_email:
            user_obj = User.objects.filter(email=username_or_email).first()
            if user_obj:
                username = user_obj.username
            else:
                # Try using email prefix as username
                username = username_or_email.split('@')[0]
        else:
            username = username_or_email
            user_obj = User.objects.filter(username=username).first()
        
        # Check if user exists
        if not user_obj and not User.objects.filter(username=username).exists():
            return Response({
                'error': 'No account found with this email. Please register first.'
            }, status=status.HTTP_404_NOT_FOUND)
    except Exception:
        username = username_or_email
    
    # Try to authenticate
    user = authenticate(username=username, password=password)
    
    if user:
        if not user.is_active:
            return Response({
                'error': 'Your account has been deactivated. Please contact support.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        login(request, user)
        return Response({
            'success': True,
            'user': UserSerializer(user).data,
            'profile': UserProfileSerializer(user.profile).data
        })
    else:
        # User exists but password is wrong
        return Response({
            'error': 'Incorrect password. Please try again.'
        }, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Logout user"""
    logout(request)
    return Response({'success': True, 'message': 'Logged out successfully'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user_view(request):
    """Get current user details"""
    return Response({
        'success': True,
        'user': UserSerializer(request.user).data,
        'profile': UserProfileSerializer(request.user.profile).data
    })

# Password Reset Views
@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_request(request):
    """Request password reset - send email with reset link"""
    from django.core.mail import send_mail
    from django.contrib.auth.tokens import default_token_generator
    from django.utils.http import urlsafe_base64_encode
    from django.utils.encoding import force_bytes
    import logging
    
    logger = logging.getLogger(__name__)
    
    email = request.data.get('email')
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        logger.warning(f"Password reset requested for non-existent email: {email}")
        # For security, don't reveal if email exists or not
        return Response({'success': True, 'message': 'If an account exists with this email, you will receive password reset instructions.'})
    
    # Generate token
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    
    # Create reset link
    frontend_url = config('FRONTEND_URL', default='http://localhost:3000')
    reset_link = f"{frontend_url}/reset-password?token={uid}-{token}"
    
    # Send email
    try:
        logger.info(f"Attempting to send password reset email to: {email}")
        logger.info(f"Using EMAIL_HOST_USER: {config('EMAIL_HOST_USER', default='not-set')}")
        
        result = send_mail(
            subject='Password Reset Request - South Sudan Immigration Portal',
            message=f'''
Hello {user.first_name},

You have requested to reset your password for the South Sudan Immigration Portal.

Click the link below to reset your password:
{reset_link}

This link will expire in 24 hours.

If you did not request this password reset, please ignore this email.

Best regards,
South Sudan Immigration Portal Team
            ''',
            from_email=config('EMAIL_HOST_USER', default='noreply@immigration.gov.ss'),
            recipient_list=[email],
            fail_silently=False,
        )
        
        logger.info(f"Email send result: {result}")
        
        if result == 0:
            logger.error("Email failed to send (result = 0)")
            return Response({'error': 'Failed to send email. Please contact support.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    except Exception as e:
        logger.error(f"Error sending password reset email to {email}: {str(e)}")
        logger.exception(e)
        return Response({'error': f'Failed to send email: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response({'success': True, 'message': 'Password reset instructions have been sent to your email.'})

@api_view(['GET'])
@permission_classes([AllowAny])
def create_default_admin_users(request):
    """
    Create default admin users - call this endpoint once after deployment
    GET /api/setup-admin/
    """
    try:
        results = []
        
        # Admin
        admin, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@immigration.gov.ss',
                'first_name': 'System',
                'last_name': 'Administrator',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created or not admin.check_password('admin123'):
            admin.email = 'admin@immigration.gov.ss'
            admin.first_name = 'System'
            admin.last_name = 'Administrator'
            admin.is_staff = True
            admin.is_superuser = True
            admin.set_password('admin123')
            admin.save()
            results.append('✓ Admin user created/updated')
        else:
            results.append('✓ Admin user already exists')
        
        profile, _ = UserProfile.objects.get_or_create(user=admin)
        profile.role = 'admin'
        profile.phone_number = '+211123456789'
        profile.save()
        
        # Supervisor
        supervisor, created = User.objects.get_or_create(
            username='supervisor',
            defaults={
                'email': 'supervisor@immigration.gov.ss',
                'first_name': 'John',
                'last_name': 'Supervisor',
                'is_staff': True,
            }
        )
        if created or not supervisor.check_password('super123'):
            supervisor.email = 'supervisor@immigration.gov.ss'
            supervisor.first_name = 'John'
            supervisor.last_name = 'Supervisor'
            supervisor.is_staff = True
            supervisor.set_password('super123')
            supervisor.save()
            results.append('✓ Supervisor user created/updated')
        else:
            results.append('✓ Supervisor user already exists')
        
        profile, _ = UserProfile.objects.get_or_create(user=supervisor)
        profile.role = 'supervisor'
        profile.phone_number = '+211123456789'
        profile.save()
        
        # Officer
        officer, created = User.objects.get_or_create(
            username='officer1',
            defaults={
                'email': 'officer1@immigration.gov.ss',
                'first_name': 'Mary',
                'last_name': 'Officer',
                'is_staff': True,
            }
        )
        if created or not officer.check_password('officer123'):
            officer.email = 'officer1@immigration.gov.ss'
            officer.first_name = 'Mary'
            officer.last_name = 'Officer'
            officer.is_staff = True
            officer.set_password('officer123')
            officer.save()
            results.append('✓ Officer user created/updated')
        else:
            results.append('✓ Officer user already exists')
        
        profile, _ = UserProfile.objects.get_or_create(user=officer)
        profile.role = 'officer'
        profile.phone_number = '+211123456789'
        profile.save()
        
        return Response({
            'success': True,
            'message': 'Default admin users created/updated successfully!',
            'results': results,
            'credentials': {
                'admin': {
                    'email': 'admin@immigration.gov.ss',
                    'username': 'admin',
                    'password': 'admin123',
                    'role': 'admin'
                },
                'supervisor': {
                    'email': 'supervisor@immigration.gov.ss',
                    'username': 'supervisor',
                    'password': 'super123',
                    'role': 'supervisor'
                },
                'officer': {
                    'email': 'officer1@immigration.gov.ss',
                    'username': 'officer1',
                    'password': 'officer123',
                    'role': 'officer'
                }
            }
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_confirm(request):
    """Confirm password reset with token"""
    from django.contrib.auth.tokens import default_token_generator
    from django.utils.http import urlsafe_base64_decode
    from django.utils.encoding import force_str
    
    token_string = request.data.get('token')
    new_password = request.data.get('password')
    
    if not token_string or not new_password:
        return Response({'error': 'Token and password are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Split the token
        uid, token = token_string.split('-', 1)
        
        # Decode user ID
        user_id = force_str(urlsafe_base64_decode(uid))
        user = User.objects.get(pk=user_id)
        
        # Verify token
        if not default_token_generator.check_token(user, token):
            return Response({'error': 'Invalid or expired reset link'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Set new password
        user.set_password(new_password)
        user.save()
        
        return Response({'success': True, 'message': 'Password has been reset successfully'})
        
    except (ValueError, User.DoesNotExist):
        return Response({'error': 'Invalid reset link'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': 'Failed to reset password'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Application Views
class ApplicationViewSet(viewsets.ModelViewSet):
    """Application CRUD operations"""
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        # Regular users see only their applications
        if user.profile.role == 'applicant':
            return Application.objects.filter(user=user)
        # Admin/Officer/Supervisor see all
        return Application.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ApplicationListSerializer
        return ApplicationSerializer
    
    def handle_exception(self, exc):
        """Custom exception handler for better error messages"""
        from rest_framework.exceptions import ValidationError as DRFValidationError
        
        if isinstance(exc, DRFValidationError):
            # Check if it's a payment receipt error
            error_detail = exc.detail
            if isinstance(error_detail, dict):
                if 'payment_proof' in error_detail:
                    error_msg = error_detail['payment_proof']
                    if isinstance(error_msg, list):
                        error_msg = error_msg[0]
                    return Response({
                        'error': str(error_msg),
                        'error_type': 'duplicate_payment_receipt'
                    }, status=status.HTTP_400_BAD_REQUEST)
        
        return super().handle_exception(exc)
    
    @action(detail=False, methods=['get'])
    def my_applications(self, request):
        """Get current user's applications"""
        applications = Application.objects.filter(user=request.user)
        serializer = ApplicationListSerializer(applications, many=True)
        return Response({'success': True, 'applications': serializer.data})
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def approve(self, request, pk=None):
        """Approve an application (Admin/Supervisor only)"""
        import logging
        logger = logging.getLogger(__name__)
        
        try:
            if request.user.profile.role not in ['admin', 'supervisor']:
                return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
            
            application = self.get_object()
            
            if application.payment_status != 'completed':
                return Response({'error': 'Payment not completed. Please verify payment first.'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Update application
            application.status = 'approved'
            application.reviewed_by = request.user
            application.reviewed_at = timezone.now()
            
            # Generate PDF
            try:
                pdf_path = generate_pdf(application)
                application.approved_pdf = pdf_path
                logger.info(f"PDF generated successfully: {pdf_path}")
            except Exception as e:
                logger.error(f"Error generating PDF: {str(e)}")
                # Continue even if PDF generation fails
                application.approved_pdf = None
            
            application.save()
            
            # Send email
            try:
                send_approval_email(application)
                logger.info(f"Approval email sent to {application.email}")
            except Exception as e:
                logger.error(f"Error sending approval email: {str(e)}")
                # Continue even if email fails
            
            return Response({
                'success': True,
                'message': 'Application approved successfully',
                'application': ApplicationSerializer(application).data
            })
            
        except Exception as e:
            logger.error(f"Error approving application: {str(e)}")
            return Response({
                'error': f'Failed to approve application: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def reject(self, request, pk=None):
        """Reject an application (Admin/Supervisor only)"""
        if request.user.profile.role not in ['admin', 'supervisor']:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        application = self.get_object()
        reason = request.data.get('reason', '')
        
        application.status = 'rejected'
        application.rejection_reason = reason
        application.reviewed_by = request.user
        application.reviewed_at = timezone.now()
        application.save()
        
        # Send rejection email
        try:
            send_rejection_email(application)
        except Exception as email_error:
            print(f"Failed to send rejection email: {email_error}")
        
        return Response({
            'success': True,
            'message': 'Application rejected and email sent',
            'application': ApplicationSerializer(application).data
        })
    
    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated])
    def update_status(self, request, pk=None):
        """Update application status (Admin/Officer/Supervisor)"""
        if request.user.profile.role not in ['admin', 'officer', 'supervisor']:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        application = self.get_object()
        new_status = request.data.get('status')
        
        if new_status in dict(Application.STATUS_CHOICES):
            application.status = new_status
            application.reviewed_by = request.user
            application.reviewed_at = timezone.now()
            application.save()
            
            return Response({
                'success': True,
                'application': ApplicationSerializer(application).data
            })
        
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def verify_payment(self, request, pk=None):
        """Verify payment (Admin/Supervisor only)"""
        if request.user.profile.role not in ['admin', 'supervisor']:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        application = self.get_object()
        
        if not application.payment_proof:
            return Response({'error': 'No payment proof submitted'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update payment status
        application.payment_status = 'completed'
        application.payment_verified_by = request.user
        application.payment_verified_at = timezone.now()
        application.payment_date = timezone.now()
        application.save()
        
        return Response({
            'success': True,
            'message': 'Payment verified successfully',
            'application': ApplicationSerializer(application).data
        })
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def reject_payment(self, request, pk=None):
        """Reject payment (Admin/Supervisor only)"""
        if request.user.profile.role not in ['admin', 'supervisor']:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        application = self.get_object()
        reason = request.data.get('reason', '')
        
        # Update payment status
        application.payment_status = 'failed'
        application.payment_rejection_reason = reason
        application.payment_verified_by = request.user
        application.payment_verified_at = timezone.now()
        application.save()
        
        return Response({
            'success': True,
            'message': 'Payment rejected',
            'application': ApplicationSerializer(application).data
        })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_application(request):
    """Submit a new application"""
    try:
        # Use the serializer to handle validation and creation
        serializer = ApplicationSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            application = serializer.save()
            
            # Send application received email
            try:
                send_application_received_email(application)
            except Exception as email_error:
                print(f"Failed to send email: {email_error}")
                # Don't fail the application submission if email fails
            
            return Response({
                'success': True,
                'message': 'Application submitted successfully',
                'application': ApplicationSerializer(application).data
            }, status=status.HTTP_201_CREATED)
        else:
            # Return validation errors
            return Response({
                'error': 'Validation failed',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        return Response({
            'error': f'Failed to submit application: {str(e)}'
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def statistics_view(request):
    """Get application statistics (Admin only)"""
    if request.user.profile.role not in ['admin', 'officer', 'supervisor']:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    
    total = Application.objects.count()
    by_status = Application.objects.values('status').annotate(count=Count('id'))
    by_type = Application.objects.values('application_type').annotate(count=Count('id'))
    
    stats = {
        'total': total,
        'by_status': {item['status']: item['count'] for item in by_status},
        'by_type': {item['application_type']: item['count'] for item in by_type}
    }
    
    return Response({'success': True, 'statistics': stats})

# Payment Views
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def initialize_payment(request):
    """Initialize Paystack payment for an application"""
    try:
        application_id = request.data.get('application_id')
        
        if not application_id:
            return Response({
                'error': 'Application ID is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get the application
        try:
            application = Application.objects.get(id=application_id, user=request.user)
        except Application.DoesNotExist:
            return Response({
                'error': 'Application not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check if payment is already completed
        if application.payment_status == 'completed':
            return Response({
                'error': 'Payment already completed for this application'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Determine payment amount based on application type
        amount_map = {
            'passport-first': 50000,  # 500 SSP or NGN
            'passport-replacement': 30000,  # 300 SSP or NGN
            'nationalid-first': 20000,  # 200 SSP or NGN
            'nationalid-replacement': 15000,  # 150 SSP or NGN
        }
        
        amount = amount_map.get(application.application_type, 50000)
        
        # Generate unique reference
        reference = f"PAY-{application.confirmation_number}-{int(timezone.now().timestamp())}"
        
        # Initialize payment with Paystack
        paystack = PaystackService()
        callback_url = request.data.get('callback_url', 'http://localhost:5173/payment/verify')
        
        result = paystack.initialize_transaction(
            email=application.email,
            amount=amount,
            reference=reference,
            callback_url=callback_url
        )
        
        if result.get('status'):
            # Update application with payment reference
            application.payment_reference = reference
            application.payment_amount = amount / 100  # Convert from kobo
            application.payment_method = 'credit_card'
            application.save()
            
            return Response({
                'success': True,
                'authorization_url': result['data']['authorization_url'],
                'access_code': result['data']['access_code'],
                'reference': reference
            })
        else:
            return Response({
                'error': result.get('message', 'Payment initialization failed')
            }, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        return Response({
            'error': f'Payment initialization failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    """Verify Paystack payment"""
    try:
        reference = request.query_params.get('reference')
        
        if not reference:
            return Response({
                'error': 'Payment reference is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verify payment with Paystack
        paystack = PaystackService()
        result = paystack.verify_transaction(reference)
        
        if result.get('status') and result.get('data', {}).get('status') == 'success':
            # Find the application
            try:
                application = Application.objects.get(payment_reference=reference)
            except Application.DoesNotExist:
                return Response({
                    'error': 'Application not found for this payment'
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Update application payment status
            application.payment_status = 'completed'
            application.payment_date = timezone.now()
            application.payment_verified_at = timezone.now()
            application.save()
            
            return Response({
                'success': True,
                'message': 'Payment verified successfully',
                'application': ApplicationSerializer(application).data
            })
        else:
            return Response({
                'success': False,
                'message': 'Payment verification failed',
                'details': result.get('message', 'Unknown error')
            }, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        return Response({
            'error': f'Payment verification failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_paystack_public_key(request):
    """Get Paystack public key for frontend"""
    return Response({
        'public_key': config('PAYSTACK_PUBLIC_KEY', default='')
    })


# Content Management Views (News, Blog, Gallery)
from .models import NewsArticle, BlogPost, GalleryImage
from .serializers import NewsArticleSerializer, BlogPostSerializer, GalleryImageSerializer

class NewsArticleViewSet(viewsets.ReadOnlyModelViewSet):
    """Public read-only access to published news articles"""
    serializer_class = NewsArticleSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = NewsArticle.objects.filter(published=True)
        # Filter by featured if requested
        featured = self.request.query_params.get('featured', None)
        if featured == 'true':
            queryset = queryset.filter(featured=True)
        return queryset


class BlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    """Public read-only access to published blog posts"""
    serializer_class = BlogPostSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = BlogPost.objects.filter(published=True)
        # Filter by featured if requested
        featured = self.request.query_params.get('featured', None)
        if featured == 'true':
            queryset = queryset.filter(featured=True)
        # Filter by category if requested
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        return queryset


class GalleryImageViewSet(viewsets.ReadOnlyModelViewSet):
    """Public read-only access to published gallery images"""
    serializer_class = GalleryImageSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = GalleryImage.objects.filter(published=True)
        # Filter by featured if requested
        featured = self.request.query_params.get('featured', None)
        if featured == 'true':
            queryset = queryset.filter(featured=True)
        # Filter by category if requested
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        return queryset


@api_view(['GET'])
@permission_classes([AllowAny])
def create_sample_content(request):
    """
    Create sample content for News, Blog, and Gallery
    Call this endpoint once: GET /api/setup-content/
    """
    from django.core.management import call_command
    from io import StringIO
    
    try:
        # Capture command output
        out = StringIO()
        call_command('create_sample_content', stdout=out)
        output = out.getvalue()
        
        return Response({
            'success': True,
            'message': 'Sample content created successfully!',
            'output': output
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def check_models_status(request):
    """
    Check if content models are registered and available
    GET /api/check-models/
    """
    try:
        from django.apps import apps
        
        # Check if models exist
        models_status = {
            'NewsArticle': False,
            'BlogPost': False,
            'GalleryImage': False,
        }
        
        try:
            NewsArticle = apps.get_model('applications', 'NewsArticle')
            models_status['NewsArticle'] = True
            news_count = NewsArticle.objects.count()
        except Exception as e:
            news_count = f"Error: {str(e)}"
        
        try:
            BlogPost = apps.get_model('applications', 'BlogPost')
            models_status['BlogPost'] = True
            blog_count = BlogPost.objects.count()
        except Exception as e:
            blog_count = f"Error: {str(e)}"
        
        try:
            GalleryImage = apps.get_model('applications', 'GalleryImage')
            models_status['GalleryImage'] = True
            gallery_count = GalleryImage.objects.count()
        except Exception as e:
            gallery_count = f"Error: {str(e)}"
        
        return Response({
            'success': True,
            'models_registered': models_status,
            'content_counts': {
                'news': news_count,
                'blog': blog_count,
                'gallery': gallery_count,
            },
            'admin_url': 'https://southsudan-e-services.onrender.com/admin/',
            'message': 'If models are registered but not showing in admin, try restarting the Render service.'
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
