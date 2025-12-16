import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../lib/api';

export default function PassportReplacement() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      
      // Add all text fields with snake_case keys for Django
      Object.keys(data).forEach(key => {
        if (!['photo', 'idCopy', 'signature', 'oldDocument', 'policeReport'].includes(key)) {
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
      if (data.idCopy?.[0]) formData.append('id_copy', data.idCopy[0]);
      if (data.signature?.[0]) formData.append('signature', data.signature[0]);
      if (data.oldDocument?.[0]) formData.append('old_document', data.oldDocument[0]);
      if (data.policeReport?.[0]) formData.append('police_report', data.policeReport[0]);
      
      formData.append('application_type', 'passport-replacement');
      
      const response = await api.post('/applications/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success(`Application submitted! Confirmation: ${response.data.confirmation_number}`);
      navigate('/my-applications');
    } catch (error: any) {
      console.error('Submission error:', error.response?.data);
      
      // Handle specific error types
      const errorData = error.response?.data;
      if (errorData?.error_type === 'duplicate_payment_receipt') {
        toast.error(errorData.error, { duration: 6000 });
      } else if (errorData?.error) {
        toast.error(errorData.error);
      } else if (errorData?.details) {
        // Handle validation errors
        const firstError = Object.values(errorData.details)[0];
        toast.error(Array.isArray(firstError) ? firstError[0] : firstError);
      } else if (errorData?.detail) {
        toast.error(errorData.detail);
      } else {
        toast.error('Submission failed. Please check all required fields.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-2">e-Passport Replacement</h1>
        <p className="text-gray-600 mb-6">Replace your lost, stolen, damaged, expired, or incorrect passport</p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This form is similar to first-time application with additional fields for replacement reason.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Reason for Replacement *</label>
            <select {...register('replacementReason', { required: true })} className="w-full px-4 py-2 border rounded-lg">
              <option value="">Select reason</option>
              <option value="lost">Lost</option>
              <option value="stolen">Stolen</option>
              <option value="damaged">Damaged</option>
              <option value="expired">Expired</option>
              <option value="correction">Correction/Error</option>
            </select>
          </div>

          {/* Include all fields from PassportFirstTime here - simplified for brevity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name *</label>
              <input {...register('firstName', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
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

          <div>
            <label className="block text-sm font-medium mb-1">Nationality *</label>
            <input {...register('nationality', { required: true })} defaultValue="South Sudanese" className="w-full px-4 py-2 border rounded-lg" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Country *</label>
              <input {...register('country', { required: true })} defaultValue="South Sudan" className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State *</label>
              <input {...register('state', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City *</label>
              <input {...register('city', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Place of Residence *</label>
            <input {...register('placeOfResidence', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
          </div>

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

          <h3 className="text-lg font-semibold mt-6">Upload Documents</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Passport Photo *</label>
              <input type="file" {...register('photo', { required: true })} accept="image/*" className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">National ID Copy *</label>
              <input type="file" {...register('idCopy', { required: true })} accept="image/*,application/pdf" className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Old Passport (if available)</label>
              <input type="file" {...register('oldDocument')} accept="image/*,application/pdf" className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Police Report (if lost/stolen)</label>
              <input type="file" {...register('policeReport')} accept="application/pdf" className="w-full px-4 py-2 border rounded-lg" />
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
