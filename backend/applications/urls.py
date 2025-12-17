from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'applications', views.ApplicationViewSet, basename='application')
router.register(r'news', views.NewsArticleViewSet, basename='news')
router.register(r'blog', views.BlogPostViewSet, basename='blog')
router.register(r'gallery', views.GalleryImageViewSet, basename='gallery')

urlpatterns = [
    # CSRF Token
    path('csrf/', views.get_csrf_token, name='csrf-token'),
    
    # Authentication
    path('auth/register/', views.register_view, name='register'),
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('auth/me/', views.current_user_view, name='current-user'),
    path('auth/password-reset/', views.password_reset_request, name='password-reset'),
    path('auth/password-reset-confirm/', views.password_reset_confirm, name='password-reset-confirm'),
    
    # Setup (for Render free tier - call once after deployment)
    path('setup-admin/', views.create_default_admin_users, name='setup-admin'),
    path('setup-content/', views.create_sample_content, name='setup-content'),
    path('check-models/', views.check_models_status, name='check-models'),
    
    # Applications
    path('applications/submit/', views.submit_application, name='submit-application'),
    
    # Payment
    path('payment/initialize/', views.initialize_payment, name='initialize-payment'),
    path('payment/verify/', views.verify_payment, name='verify-payment'),
    path('payment/public-key/', views.get_paystack_public_key, name='paystack-public-key'),
    
    # Statistics
    path('admin/statistics/', views.statistics_view, name='statistics'),
    
    # Applications (includes all CRUD + custom actions)
    path('', include(router.urls)),
]
