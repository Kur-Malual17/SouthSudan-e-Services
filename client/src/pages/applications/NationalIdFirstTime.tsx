import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../lib/api';

export default function NationalIdFirstTime() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      
      // Add all text fields with snake_case keys for Django
      Object.keys(data).forEach(key => {
        if (!['photo', 'birthCertificate'].includes(key)) {
          const value = data[key];
          // Only add non-empty values
          if (value !== '' && value !== null && value !== undefined) {
            // Convert camelCase to snake_case
            const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
            formData.append(snakeKey, value);
          }
        }
      });
      
      // Add files
      if (data.photo?.[0]) formData.append('photo', data.photo[0]);
      if (data.birthCertificate?.[0]) formData.append('birth_certificate', data.birthCertificate[0]);
      
      formData.append('application_type', 'nationalid-first');
      
      const response = await api.post('/applications/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success(`Application submitted! Confirmation: ${response.data.confirmation_number}`);
      navigate('/my-applications');
    } catch (error: any) {
      console.error('Submission error:', error.response?.data);
      const errorMsg = error.response?.data?.detail || 
                       JSON.stringify(error.response?.data) || 
                       'Submission failed';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-2">National ID First-Time Application</h1>
        <p className="text-gray-600 mb-6">Apply for your first South Sudan National ID card</p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <h3 className="text-lg font-semibold">Personal Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name *</label>
              <input {...register('firstName', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Middle Name</label>
              <input {...register('middleName')} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name *</label>
              <input {...register('lastName', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date of Birth *</label>
              <input type="date" {...register('dateOfBirth', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Gender *</label>
              <select {...register('gender', { required: true })} className="w-full px-4 py-2 border rounded-lg">
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nationality *</label>
            <input {...register('nationality', { required: true })} defaultValue="South Sudanese" className="w-full px-4 py-2 border rounded-lg" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Father's Name *</label>
              <input {...register('fatherName', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mother's Name *</label>
              <input {...register('motherName', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Marital Status *</label>
            <select {...register('maritalStatus', { required: true })} className="w-full px-4 py-2 border rounded-lg">
              <option value="">Select</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
          </div>

          <h3 className="text-lg font-semibold mt-6">Contact Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number *</label>
              <input {...register('phoneNumber', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input type="email" {...register('email', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Country *</label>
              <input {...register('country', { required: true })} defaultValue="South Sudan" className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State/County *</label>
              <input {...register('state', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City/Town *</label>
              <input {...register('city', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Place of Residence *</label>
            <input {...register('placeOfResidence', { required: true })} className="w-full px-4 py-2 border rounded-lg" placeholder="Street address or area" />
          </div>

          <h3 className="text-lg font-semibold mt-6">Birth Location</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Birth Country *</label>
              <input {...register('birthCountry', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Birth State *</label>
              <input {...register('birthState', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Birth City *</label>
              <input {...register('birthCity', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>

          <h3 className="text-lg font-semibold mt-6">Upload Documents</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Passport Photo * (White background)</label>
              <input type="file" {...register('photo', { required: true })} accept="image/*" className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Birth Certificate *</label>
              <input type="file" {...register('birthCertificate', { required: true })} accept="image/*,application/pdf" className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Civil Registry Application Number</label>
              <input {...register('civilRegistryNumber')} className="w-full px-4 py-2 border rounded-lg" placeholder="If available" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}
