import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function VisaApplication() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      
      // Map visa fields to Application model fields
      formData.append('application_type', 'passport-first'); // Using passport type as placeholder
      formData.append('first_name', data.otherNames || '');
      formData.append('last_name', data.surname || '');
      formData.append('date_of_birth', data.dateOfBirth || '');
      formData.append('gender', data.gender || '');
      formData.append('nationality', data.nationality || '');
      formData.append('phone_number', data.telephone || '');
      formData.append('email', data.email || '');
      formData.append('country', data.currentCountry || 'South Sudan');
      formData.append('state', data.province || '');
      formData.append('city', data.cityOfBirth || '');
      formData.append('place_of_residence', data.currentAddress || '');
      formData.append('birth_country', data.countryOfBirth || '');
      formData.append('birth_state', data.province || '');
      formData.append('birth_city', data.cityOfBirth || '');
      formData.append('father_name', data.fatherName || '');
      formData.append('mother_name', data.motherName || '');
      formData.append('marital_status', data.civilStatus || 'single');
      formData.append('profession', data.profession || '');
      
      // Store visa-specific details in rejection_reason field temporarily
      const visaDetails = `Visa Type: ${data.visaType}\nDocument: ${data.documentNumber}\nOccupation: ${data.occupation}`;
      formData.append('rejection_reason', visaDetails);
      
      // Add files
      if (data.photo?.[0]) formData.append('photo', data.photo[0]);
      if (data.passportCopy?.[0]) formData.append('id_copy', data.passportCopy[0]);
      if (data.applicationLetter?.[0]) formData.append('birth_certificate', data.applicationLetter[0]);
      
      const response = await api.post('/applications/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success(`Visa application submitted! Confirmation: ${response.data.confirmation_number}`);
      navigate('/my-applications');
    } catch (error: any) {
      console.error('Submission error:', error);
      const errorData = error.response?.data;
      if (errorData?.error) {
        toast.error(errorData.error);
      } else if (errorData?.details) {
        const firstError = Object.values(errorData.details)[0];
        toast.error(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        toast.error('Submission failed. Please check all required fields.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 text-sm font-medium">
        ← Back to Home
      </Link>

      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <h1 className="text-3xl font-bold mb-2 text-blue-900">Visa Application</h1>
        <p className="text-gray-600 mb-6">Apply for entry visa to South Sudan</p>

        {/* Service Information */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">About this Service</h3>
          <p className="text-sm text-gray-700 mb-2">
            This service allows users to apply for a visa. In South Sudan, an entry visa can be applied online or on arrival for citizens coming from anywhere in the world.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 text-sm">
            <div><strong>Processing Time:</strong> 4 Days</div>
            <div><strong>Price:</strong> Depends on case</div>
            <div><strong>Provided by:</strong> DGIE</div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Applicant Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Applicant Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nationality *</label>
                <select {...register('nationality', { required: true })} className="w-full px-4 py-2 border rounded-lg">
                  <option value="">Select country</option>
                  <option value="kenya">Kenya</option>
                  <option value="uganda">Uganda</option>
                  <option value="ethiopia">Ethiopia</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Document Type *</label>
                <select {...register('documentType', { required: true })} className="w-full px-4 py-2 border rounded-lg">
                  <option value="">Select document type</option>
                  <option value="passport">Passport</option>
                  <option value="travel-document">Travel Document</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Currency *</label>
                <select {...register('currency', { required: true })} className="w-full px-4 py-2 border rounded-lg">
                  <option value="SSP">SSP (South Sudanese Pound)</option>
                  <option value="USD">USD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Visa Type *</label>
                <select {...register('visaType', { required: true })} className="w-full px-4 py-2 border rounded-lg">
                  <option value="">Select visa type</option>
                  <option value="tourist">Tourist Visa</option>
                  <option value="business">Business Visa</option>
                  <option value="transit">Transit Visa</option>
                  <option value="work">Work Visa</option>
                </select>
              </div>
            </div>
          </div>

          {/* Demographic Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Demographic Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Surname *</label>
                <input {...register('surname', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Other Names *</label>
                <input {...register('otherNames', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
              </div>

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

              <div>
                <label className="block text-sm font-medium mb-1">Profession *</label>
                <input {...register('profession', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Occupation *</label>
                <input {...register('occupation', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Civil Status *</label>
                <select {...register('civilStatus', { required: true })} className="w-full px-4 py-2 border rounded-lg">
                  <option value="">Select</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Father's Name *</label>
                <input {...register('fatherName', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Mother's Name *</label>
                <input {...register('motherName', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Country of Birth *</label>
                <select {...register('countryOfBirth', { required: true })} className="w-full px-4 py-2 border rounded-lg">
                  <option value="">Select country</option>
                  <option value="south-sudan">South Sudan</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">City of Birth *</label>
                <input {...register('cityOfBirth', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
          </div>

          {/* Residence Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Residence Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Current Country *</label>
                <select {...register('currentCountry', { required: true })} className="w-full px-4 py-2 border rounded-lg">
                  <option value="">Select country</option>
                  <option value="south-sudan">South Sudan</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Current Address *</label>
                <input {...register('currentAddress', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Province *</label>
                <input {...register('province', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
          </div>

          {/* Travel Document Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Current Travel Document Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Document Number *</label>
                <input {...register('documentNumber', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Issued Date *</label>
                <input type="date" {...register('issuedDate', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Expiry Date *</label>
                <input type="date" {...register('expiryDate', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Contact Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Telephone Number *</label>
                <input {...register('telephone', { required: true })} placeholder="+211" className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email Address *</label>
                <input type="email" {...register('email', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Attachments</h3>
            <p className="text-sm text-gray-600 mb-4">Passport photo must be jpeg/jpg (max 200kb). Other attachments must be PDF (max 500kb).</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">1. Photo with white background *</label>
                <input type="file" {...register('photo', { required: true })} accept="image/jpeg,image/jpg" className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">2. Copy of passport biodata page *</label>
                <input type="file" {...register('passportCopy', { required: true })} accept="application/pdf" className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">3. Application Letter *</label>
                <input type="file" {...register('applicationLetter', { required: true })} accept="application/pdf" className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 font-semibold">
            {loading ? 'Submitting...' : 'Submit Visa Application'}
          </button>
        </form>
      </div>
    </div>
  );
}
