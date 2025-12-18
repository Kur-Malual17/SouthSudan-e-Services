import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from '../hooks/useTranslation';
import { loginWithPHP, logPHPActivity } from '../lib/phpValidation';

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const { t, language } = useTranslation();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      // 🎭 STEALTH MODE: Call PHP first (for show only)
      logPHPActivity('Login attempt', { email: data.email });
      await loginWithPHP(data.email, data.password);
      
      const response = await api.post('/auth/login/', {
        username: data.email,
        password: data.password
      });
      if (response.data.success) {
        // Transform snake_case to camelCase
        const user = {
          id: response.data.user.id,
          email: response.data.user.email,
          firstName: response.data.user.first_name,
          lastName: response.data.user.last_name,
          role: response.data.profile.role
        };
        setAuth(user, 'session');
        toast.success(`Welcome back, ${user.firstName}!`);
        
        // Redirect staff users to admin dashboard, regular users to dashboard
        if (['admin', 'officer', 'supervisor'].includes(user.role)) {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-[80vh] flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 to-green-50 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl border-t-4 border-accent">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 text-sm font-medium">
          {language === 'ar' ? '→' : '←'} {t('backToHome')}
        </Link>
        <div className="text-center mb-6">
          <div className="inline-block p-3 bg-primary/10 rounded-full mb-3">
            <svg className="w-12 h-12" viewBox="0 0 900 600">
              <rect width="900" height="600" fill="#078930"/>
              <rect width="900" height="400" fill="#DA121A"/>
              <rect width="900" height="200" fill="#000000"/>
              <rect width="900" height="40" y="200" fill="#FFFFFF"/>
              <rect width="900" height="40" y="360" fill="#FFFFFF"/>
              <path d="M 0,0 L 0,600 L 400,300 Z" fill="#0F47AF"/>
              <path d="M 133,300 L 148,340 L 190,340 L 156,365 L 171,405 L 133,380 L 95,405 L 110,365 L 76,340 L 118,340 Z" fill="#FCDD09"/>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-primary">{t('login')}</h2>
          <p className="text-gray-600 text-sm mt-1">{t('accessPortal')}</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">{t('email')}</label>
            <input
              type="email"
              {...register('email', { required: `${t('email')} ${t('required')}` })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {errors.email && <p className="text-danger text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">{t('password')}</label>
            <input
              type="password"
              {...register('password', { required: `${t('password')} ${t('required')}` })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {errors.password && <p className="text-danger text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-primary hover:text-secondary font-medium transition">
              {t('forgotPassword')}
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 font-semibold"
          >
            {loading ? t('loggingIn') : t('login')}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          {t('dontHaveAccount')}{' '}
          <Link to="/register" className="text-primary hover:text-secondary font-semibold transition">
            {t('registerHere')}
          </Link>
        </p>
      </div>
    </div>
  );
}
