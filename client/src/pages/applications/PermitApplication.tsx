import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function PermitApplication() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      
      // Map permit fields to Application model
      formData.append('application_type', 'passport-replacement'); // Using as placeholder
      formData.append('first_name', data.firstName || '');
      formData.append('last_name', data.lastName || '');
      formData.append('date_of_birth', data.dateOfBirth || '');
      formData.append('gender', data.gender || '');
      formData.append('nationality', data.nationality || 'South Sudanese');
      formData.append('phone_number', data.phoneNumber || '');
      formData.append('email', data.email || '');
      formData.append('country', 'South Sudan');
      formData.append('state', data.state || '');
      formData.append('city', data.city || '');
      formData.append('place_of_residence', data.address || '');
      formData.append('birth_country', 'South Sudan');
      formData.append('birth_state', data.state || '');
      formData.append('birth_city', data.city || '');
      formData.append('father_name', data.fatherName || 'Not Provided');
      formData.append('mother_name', data.motherName || 'Not Provided');
      formData.append('marital_status', data.maritalStatus || 'single');
      
      // Store permit-specific details
      const permitDetails = `Permit Type: ${data.permitType}\nPurpose: ${data.purpose}`;
      formData.append('rejection_reason', permitDetails);
      
      // Add files
      if (data.photo?.[0]) formData.append('photo', data.photo[0]);
      if (data.idCopy?.[0]) formData.append('id_copy', data.idCopy[0]);
      if (data.supportingDocs?.[0]) formData.append('birth_certificate', data.supportingDocs[0]);
      
      const response = await api.post('/applications/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success(`Permit application submitted! Confirmation: ${response.data.confirmation_number}`);
      navigate('/my-applications');
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error(error.response?.data?.error || 'Submission failed. Please check all required fields.');
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
        <h1 className="text-3xl font-bold mb-2 text-blue-900">Permit Application</h1>
        <p className="text-gray-600 mb-6">Apply for residence or work permit in South Sudan</p>

        {/* Service Information */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">About this Service</h3>
          <p className="text-sm text-gray-700 mb-2">
            This service allows investors and workers to apply for residence or work permits in South Sudan. Required for foreign nationals planning to work or reside in the country.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 text-sm">
            <div><strong>Processing Time:</strong> 7-14 Days</div>
            <div><strong>Price:</strong> Depends on permit type</div>
            <div><strong>Provided by:</strong> DGIE</div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Permit Type */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Permit Type</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Permit Category *</label>
                <select {...register('permitType', { required: true })} className="w-full px-4 py-2 border rounded-lg">
                  <option value="">Select permit type</option>
                  <option value="work">Work Permit</option>
                  <option value="residence">Residence Permit</option>
                  <option value="business">Business Permit</option>
                  <option value="investor">Investor Permit</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Duration *</label>
                <select {...register('duration', { required: true })} className="w-full px-4 py-2 border rounded-lg">
                  <option value="">Select duration</option>
                  <option value="6months">6 Months</option>
                  <option value="1year">1 Year</option>
                  <option value="2years">2 Years</option>
                  <option value="3years">3 Years</option>
                </select>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Personal Information</h3>
            
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
                <label className="block text-sm font-medium mb-1">Place of Birth *</label>
                <input {...register('placeOfBirth', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
          </div>

          {/* Passport Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Passport Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Passport Number *</label>
                <input {...register('passportNumber', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Issue Date *</label>
                <input type="date" {...register('passportIssueDate', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Expiry Date *</label>
                <input type="date" {...register('passportExpiryDate', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
          </div>

          {/* Employment/Business Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Employment/Business Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Company/Organization Name *</label>
                <input {...register('companyName', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Position/Job Title *</label>
                <input {...register('position', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Company Address *</label>
                <input {...register('companyAddress', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Company Phone *</label>
                <input {...register('companyPhone', { required: true })} placeholder="+211" className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Nature of Business *</label>
                <textarea {...register('businessNature', { required: true })} rows={3} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number *</label>
                <input {...register('phone', { required: true })} placeholder="+211" className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email Address *</label>
                <input type="email" {...register('email', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Residential Address in South Sudan *</label>
                <input {...register('residentialAddress', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Required Documents</h3>
            <p className="text-sm text-gray-600 mb-4">Passport photo must be jpeg/jpg (max 200kb). Other documents must be PDF (max 500kb).</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">1. Passport-size photo *</label>
                <input type="file" {...register('photo', { required: true })} accept="image/jpeg,image/jpg" className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">2. Copy of passport biodata page *</label>
                <input type="file" {...register('passportCopy', { required: true })} accept="application/pdf" className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">3. Employment contract or business registration *</label>
                <input type="file" {...register('employmentContract', { required: true })} accept="application/pdf" className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">4. Company registration certificate *</label>
                <input type="file" {...register('companyRegistration', { required: true })} accept="application/pdf" className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">5. Application letter *</label>
                <input type="file" {...register('applicationLetter', { required: true })} accept="application/pdf" className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 font-semibold">
            {loading ? 'Submitting...' : 'Submit Permit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}
