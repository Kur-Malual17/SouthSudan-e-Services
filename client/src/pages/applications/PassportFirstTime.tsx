import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../lib/api';

export default function PassportFirstTime() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { register, handleSubmit, watch } = useForm();

  const applicantType = watch('applicantType');
  const age = applicantType === 'above18' ? 26 : 15;

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      
      // Add all text fields with snake_case keys for Django
      Object.keys(data).forEach(key => {
        if (!['photo', 'idCopy', 'signature'].includes(key)) {
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
      
      formData.append('application_type', 'passport-first');
      
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
        <h1 className="text-3xl font-bold mb-2">e-Passport First-Time Application</h1>
        <p className="text-gray-600 mb-6">Complete all required fields to submit your application</p>
        
        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`flex-1 ${s < 4 ? 'border-r-2' : ''} ${step >= s ? 'border-primary' : 'border-gray-300'}`}>
              <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center ${step >= s ? 'bg-primary text-white' : 'bg-gray-300'}`}>
                {s}
              </div>
              <p className="text-xs text-center mt-1">
                {s === 1 && 'Personal'}
                {s === 2 && 'Contact'}
                {s === 3 && 'Passport'}
                {s === 4 && 'Documents'}
              </p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
              
              <div>
                <label className="block text-sm font-medium mb-1">Applicant Type *</label>
                <select {...register('applicantType', { required: true })} className="w-full px-4 py-2 border rounded-lg">
                  <option value="">Select</option>
                  <option value="above18">Above 18 years</option>
                  <option value="below18">Below 18 years</option>
                </select>
              </div>

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-sm font-medium mb-1">Nationality *</label>
                  <input {...register('nationality', { required: true })} defaultValue="South Sudanese" className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">National ID Number *</label>
                  <input {...register('nationalIdNumber', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Height (cm)</label>
                  <input type="number" {...register('height')} className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Profession</label>
                  <input {...register('profession')} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Employer</label>
                  <input {...register('employer')} className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contact & Address */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Contact & Address Details</h2>
              
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Country *</label>
                  <input {...register('country', { required: true })} defaultValue="South Sudan" className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State/County *</label>
                  <input {...register('state', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City/Town *</label>
                  <input {...register('city', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Place of Residence *</label>
                  <input {...register('placeOfResidence', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </div>

              <h3 className="text-lg font-semibold mt-6 mb-3">Birth Location</h3>
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
            </div>
          )}

          {/* Step 3: Passport Details */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Passport Details</h2>
              
              <div>
                <label className="block text-sm font-medium mb-1">Passport Validity *</label>
                <select {...register('passportType', { required: true })} className="w-full px-4 py-2 border rounded-lg">
                  <option value="">Select validity period</option>
                  {applicantType === 'below18' && <option value="2-year">2 Years (Under 16)</option>}
                  <option value="5-year">5 Years</option>
                  {applicantType === 'above18' && age > 26 && <option value="10-year">10 Years (Over 26)</option>}
                </select>
                <p className="text-sm text-gray-600 mt-1">
                  {applicantType === 'below18' ? 'Under 16: 2-year only' : 'Over 26: 5 or 10 years, 16-26: 5-year only'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Travel Purpose</label>
                <input {...register('travelPurpose')} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g., Business, Tourism, Education" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Destination Country</label>
                  <input {...register('destinationCountry')} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Destination City</label>
                  <input {...register('destinationCity')} className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Documents */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Upload Documents</h2>
              
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Requirements:</strong> All files must be in JPG, PNG, or PDF format. Maximum size: 5MB per file.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Passport Photo * (White background)</label>
                <input type="file" {...register('photo', { required: true })} accept="image/*" className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">National ID Copy *</label>
                <input type="file" {...register('idCopy', { required: true })} accept="image/*,application/pdf" className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Signature *</label>
                <input type="file" {...register('signature', { required: true })} accept="image/*" className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            {step > 1 && (
              <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-2 border rounded-lg hover:bg-gray-50">
                Previous
              </button>
            )}
            {step < 4 ? (
              <button type="button" onClick={() => setStep(step + 1)} className="ml-auto px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">
                Next
              </button>
            ) : (
              <button type="submit" disabled={loading} className="ml-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
