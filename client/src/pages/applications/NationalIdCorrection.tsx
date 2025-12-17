import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { BACKEND_URL } from '../../lib/api';

export default function NationalIdCorrection() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Function to get CSRF token from cookies
  const getCookie = (name: string) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      
      // Map form fields to Application model fields
      // Use the "correct" information as the main data
      formData.append('application_type', 'nationalid-replacement');
      formData.append('first_name', data.correctOtherNames || data.currentOtherNames);
      formData.append('last_name', data.correctSurname || data.currentSurname);
      formData.append('date_of_birth', data.correctDateOfBirth || data.currentDateOfBirth);
      formData.append('gender', data.correctGender || data.currentGender);
      formData.append('nationality', 'South Sudanese');
      formData.append('national_id_number', data.currentIdNumber);
      
      // Contact info
      formData.append('phone_number', data.phone || '');
      formData.append('email', data.email || '');
      formData.append('country', 'South Sudan');
      formData.append('state', data.state || '');
      formData.append('city', data.district || '');
      formData.append('place_of_residence', data.district || '');
      
      // Birth location (use current as default)
      formData.append('birth_country', 'South Sudan');
      formData.append('birth_state', data.state || '');
      formData.append('birth_city', data.district || '');
      
      // Parent names (use placeholders if not provided)
      formData.append('father_name', data.fatherName || 'Not Provided');
      formData.append('mother_name', data.motherName || 'Not Provided');
      formData.append('marital_status', data.maritalStatus || 'single');
      
      // Store correction details in rejection_reason field temporarily (or we can add custom fields later)
      const correctionDetails = `Reason: ${data.correctionReason}\nExplanation: ${data.detailedExplanation}\nCurrent: ${data.currentSurname} ${data.currentOtherNames}\nCorrect: ${data.correctSurname} ${data.correctOtherNames}`;
      formData.append('rejection_reason', correctionDetails);
      
      // Add files if present
      if (data.photo?.[0]) formData.append('photo', data.photo[0]);
      if (data.currentIdCopy?.[0]) formData.append('id_copy', data.currentIdCopy[0]);
      if (data.supportingDocument?.[0]) formData.append('birth_certificate', data.supportingDocument[0]);
      if (data.applicationLetter?.[0]) formData.append('police_report', data.applicationLetter[0]);

      const csrfToken = getCookie('csrftoken');
      const headers: HeadersInit = {};
      if (csrfToken) {
        headers['X-CSRFToken'] = csrfToken;
      }

      const response = await fetch(`${BACKEND_URL}/api/applications/`, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: formData,
      });

      if (response.ok) {
        toast.success('National ID correction application submitted successfully!');
        navigate('/my-applications');
      } else {
        const errorData = await response.json();
        
        // Handle specific error types
        if (errorData.error_type === 'duplicate_payment_receipt') {
          toast.error(errorData.error, { duration: 6000 });
        } else if (errorData.error) {
          toast.error(errorData.error);
        } else if (errorData.details) {
          // Handle validation errors
          const firstError = Object.values(errorData.details)[0];
          toast.error(Array.isArray(firstError) ? firstError[0] : firstError);
        } else {
          toast.error('Submission failed. Please check all required fields.');
        }
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Network error. Please check your connection and try again.');
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
        <h1 className="text-3xl font-bold mb-2 text-blue-900">Application for National ID Correction</h1>
        <p className="text-gray-600 mb-6">Apply to correct errors on your National Identity Card</p>

        {/* Service Information */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">About this Service</h3>
          <p className="text-sm text-gray-700 mb-2">
            This service enables South Sudanese citizens to apply for the correction of their National Identity Cards. You will receive an appointment to visit the selected district office with supporting documents. The corrected ID will be collected at your district of registration.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 text-sm">
            <div><strong>Processing Time:</strong> 30 Days</div>
            <div><strong>Price:</strong> Depends on case</div>
            <div><strong>Provided by:</strong> DGIE</div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Identification Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Identification Details</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Current National ID Number *</label>
                <input 
                  {...register('currentIdNumber', { required: 'National ID number is required' })} 
                  placeholder="Enter your current ID number"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {errors.currentIdNumber && (
                  <p className="text-red-600 text-sm mt-1">{errors.currentIdNumber.message as string}</p>
                )}
              </div>
            </div>
          </div>

          {/* Reason for Correction */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Reason for ID Correction</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select Reason for Correction *</label>
                <select 
                  {...register('correctionReason', { required: 'Please select a reason' })} 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select reason</option>
                  <option value="name-error">Name Error/Misspelling</option>
                  <option value="date-of-birth">Date of Birth Error</option>
                  <option value="gender">Gender Error</option>
                  <option value="place-of-birth">Place of Birth Error</option>
                  <option value="photo-quality">Photo Quality Issue</option>
                  <option value="other-details">Other Personal Details Error</option>
                </select>
                {errors.correctionReason && (
                  <p className="text-red-600 text-sm mt-1">{errors.correctionReason.message as string}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Detailed Explanation *</label>
                <textarea 
                  {...register('detailedExplanation', { required: 'Please provide detailed explanation' })} 
                  rows={4}
                  placeholder="Explain what needs to be corrected and why..."
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {errors.detailedExplanation && (
                  <p className="text-red-600 text-sm mt-1">{errors.detailedExplanation.message as string}</p>
                )}
              </div>
            </div>
          </div>

          {/* Current Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Current Information (as shown on ID)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Current Surname *</label>
                <input 
                  {...register('currentSurname', { required: true })} 
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Current Other Names *</label>
                <input 
                  {...register('currentOtherNames', { required: true })} 
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Current Date of Birth *</label>
                <input 
                  type="date" 
                  {...register('currentDateOfBirth', { required: true })} 
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Current Gender *</label>
                <select {...register('currentGender', { required: true })} className="w-full px-4 py-2 border rounded-lg">
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
          </div>

          {/* Correct Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Correct Information (what it should be)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Correct Surname *</label>
                <input 
                  {...register('correctSurname', { required: true })} 
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Correct Other Names *</label>
                <input 
                  {...register('correctOtherNames', { required: true })} 
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Correct Date of Birth *</label>
                <input 
                  type="date" 
                  {...register('correctDateOfBirth', { required: true })} 
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Correct Gender *</label>
                <select {...register('correctGender', { required: true })} className="w-full px-4 py-2 border rounded-lg">
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
          </div>

          {/* Processing Office */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Processing Office</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">State *</label>
                <select {...register('state', { required: true })} className="w-full px-4 py-2 border rounded-lg">
                  <option value="">Select state</option>
                  <option value="central-equatoria">Central Equatoria</option>
                  <option value="eastern-equatoria">Eastern Equatoria</option>
                  <option value="western-equatoria">Western Equatoria</option>
                  <option value="jonglei">Jonglei</option>
                  <option value="unity">Unity</option>
                  <option value="upper-nile">Upper Nile</option>
                  <option value="lakes">Lakes</option>
                  <option value="warrap">Warrap</option>
                  <option value="western-bahr-el-ghazal">Western Bahr el Ghazal</option>
                  <option value="northern-bahr-el-ghazal">Northern Bahr el Ghazal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">District *</label>
                <select {...register('district', { required: true })} className="w-full px-4 py-2 border rounded-lg">
                  <option value="">Select district</option>
                  <option value="juba">Juba</option>
                  <option value="yei">Yei</option>
                  <option value="torit">Torit</option>
                  <option value="malakal">Malakal</option>
                  <option value="wau">Wau</option>
                  <option value="bor">Bor</option>
                  <option value="bentiu">Bentiu</option>
                  <option value="aweil">Aweil</option>
                  <option value="rumbek">Rumbek</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Place of Collection *</label>
                <select {...register('placeOfCollection', { required: true })} className="w-full px-4 py-2 border rounded-lg">
                  <option value="">Select collection point</option>
                  <option value="district-office">District Office</option>
                  <option value="state-office">State Office</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number *</label>
                <input 
                  {...register('phone', { required: true })} 
                  placeholder="+211"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email Address *</label>
                <input 
                  type="email" 
                  {...register('email', { required: true })} 
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Current Residential Address *</label>
                <input 
                  {...register('residentialAddress', { required: true })} 
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Supporting Documents */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Supporting Documents</h3>
            <p className="text-sm text-gray-600 mb-4">Photo must be jpeg/jpg (max 200kb). Other documents must be PDF (max 500kb).</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">1. Recent passport-size photo *</label>
                <input 
                  type="file" 
                  {...register('photo', { required: true })} 
                  accept="image/jpeg,image/jpg" 
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">2. Copy of current National ID *</label>
                <input 
                  type="file" 
                  {...register('currentIdCopy', { required: true })} 
                  accept="application/pdf" 
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">3. Supporting document (birth certificate, school certificate, etc.) *</label>
                <input 
                  type="file" 
                  {...register('supportingDocument', { required: true })} 
                  accept="application/pdf" 
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">4. Application letter explaining the correction needed *</label>
                <input 
                  type="file" 
                  {...register('applicationLetter', { required: true })} 
                  accept="application/pdf" 
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> You will receive an appointment notification to visit your selected district office with original supporting documents. The corrected ID will be ready for collection within 30 days after verification.
            </p>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 font-semibold"
          >
            {loading ? 'Submitting...' : 'Submit Correction Application'}
          </button>
        </form>
      </div>
    </div>
  );
}
