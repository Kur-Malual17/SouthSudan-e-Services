import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { useTranslation } from '../hooks/useTranslation';

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetPasswordForm>();
  const { t, language } = useTranslation();

  const onSubmit = async (data: ResetPasswordForm) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!token) {
      toast.error('Invalid reset token');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/password-reset-confirm/', {
        token,
        password: data.password
      });
      toast.success(t('passwordResetSuccess'));
      setTimeout(() => navigate('/login'), 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Reset Link</h2>
          <Link to="/forgot-password" className="text-primary hover:text-secondary font-semibold">
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-[80vh] flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 to-green-50 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl border-t-4 border-accent">
        <Link to="/login" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 text-sm font-medium">
          {language === 'ar' ? '→' : '←'} {t('backToLogin')}
        </Link>
        
        <div className="text-center mb-6">
          <div className="inline-block p-3 bg-primary/10 rounded-full mb-3">
            <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-primary">{t('setNewPassword')}</h2>
          <p className="text-gray-600 text-sm mt-1">{t('setNewPasswordDesc')}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">{t('newPassword')}</label>
            <input
              type="password"
              {...register('password', { 
                required: `${t('password')} ${t('required')}`,
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {errors.password && <p className="text-danger text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">{t('confirmPassword')}</label>
            <input
              type="password"
              {...register('confirmPassword', { 
                required: `${t('confirmPassword')} ${t('required')}`,
                validate: (val: string) => {
                  if (watch('password') != val) {
                    return "Passwords do not match";
                  }
                }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {errors.confirmPassword && <p className="text-danger text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 font-semibold"
          >
            {loading ? t('resetting') : t('resetPasswordBtn')}
          </button>
        </form>
      </div>
    </div>
  );
}
