import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from '../hooks/useTranslation';

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>();
  const { t } = useTranslation();

  const onSubmit = async (data: RegisterForm) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Transform data to match Django's expected format
      const payload = {
        username: data.email.split('@')[0], // Use email prefix as username
        email: data.email,
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName,
        phone_number: data.phoneNumber,
      };
      
      const response = await api.post('/auth/register/', payload);
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
        toast.success(`Welcome, ${user.firstName}!`);
        
        // Redirect staff users to admin dashboard, regular users to dashboard
        if (['admin', 'officer', 'supervisor'].includes(user.role)) {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 
                       error.response?.data?.username?.[0] || 
                       error.response?.data?.email?.[0] || 
                       'Registration failed. Please try again.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl border-t-4 border-secondary">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 text-sm font-medium">
          ← Back to Home
        </Link>
        <div className="text-center mb-6">
          <div className="inline-block p-3 bg-secondary/10 rounded-full mb-3">
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
          <h2 className="text-3xl font-bold text-primary">{t('createAccountTitle')}</h2>
          <p className="text-gray-600 text-sm mt-1">{t('joinPortal')}</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">First Name</label>
              <input
                {...register('firstName', { required: 'First name is required' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {errors.firstName && <p className="text-danger text-sm mt-1">{errors.firstName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Last Name</label>
              <input
                {...register('lastName', { required: 'Last name is required' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {errors.lastName && <p className="text-danger text-sm mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {errors.email && <p className="text-danger text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Phone Number</label>
            <input
              {...register('phoneNumber', { required: 'Phone number is required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {errors.phoneNumber && <p className="text-danger text-sm mt-1">{errors.phoneNumber.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {errors.password && <p className="text-danger text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Confirm Password</label>
            <input
              type="password"
              {...register('confirmPassword', { required: 'Please confirm password' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {errors.confirmPassword && <p className="text-danger text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-secondary to-green-700 text-white py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 font-semibold"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-secondary font-semibold transition">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
