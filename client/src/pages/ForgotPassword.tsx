import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { useTranslation } from '../hooks/useTranslation';

interface ForgotPasswordForm {
  email: string;
}

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>();
  const { t, language } = useTranslation();

  const onSubmit = async (data: ForgotPasswordForm) => {
    setLoading(true);
    try {
      await api.post('/auth/password-reset/', { email: data.email });
      setEmailSent(true);
      toast.success(t('resetEmailSent'));
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-[80vh] flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 to-green-50 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl border-t-4 border-accent">
        <Link to="/login" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 text-sm font-medium">
          {language === 'ar' ? '→' : '←'} {t('backToLogin')}
        </Link>
        
        <div className="text-center mb-6">
          <div className="inline-block p-3 bg-primary/10 rounded-full mb-3">
            <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-primary">{t('resetPassword')}</h2>
          <p className="text-gray-600 text-sm mt-1">{t('resetPasswordDesc')}</p>
        </div>

        {!emailSent ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">{t('email')}</label>
              <input
                type="email"
                {...register('email', { required: `${t('email')} ${t('required')}` })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="your@email.com"
              />
              {errors.email && <p className="text-danger text-sm mt-1">{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 font-semibold"
            >
              {loading ? t('sending') : t('sendResetLink')}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <svg className="w-12 h-12 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-green-800 font-medium">{t('resetEmailSent')}</p>
            </div>
            <Link 
              to="/login" 
              className="text-primary hover:text-secondary font-semibold transition"
            >
              {t('backToLogin')}
            </Link>
          </div>
        )}

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
