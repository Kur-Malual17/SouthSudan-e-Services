import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function EmergencyTravelDocument() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      
      // Map emergency travel fields to Application model
      formData.append('application_type', 'passport-replacement'); // Using as placeholder
      formData.append('first_name', data.firstName || '');
      formData.append('last_name', data.lastName || '');
      formData.append('date_of_birth', data.dateOfBirth || '');
      formData.append('gender', data.gender || '');
      formData.append('nationality', 'South Sudanese');
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
      
      // Store emergency details
      const emergencyDetails = `Emergency Reason: ${data.emergencyReason}\nTravel Date: ${data.travelDate}`;
      formData.append('rejection_reason', emergencyDetails);
      
      // Add files
      if (data.photo?.[0]) formData.append('photo', data.photo[0]);
      if (data.idCopy?.[0]) formData.append('id_copy', data.idCopy[0]);
      if (data.policeReport?.[0]) formData.append('police_report', data.policeReport[0]);
      
      const response = await api.post('/applications/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success(`Emergency travel document submitted! Confirmation: ${response.data.confirmation_number}`);
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
        <h1 className="text-3xl font-bold mb-2 text-blue-900">Emergency Travel Document</h1>
        <p className="text-gray-600 mb-6">Apply for emergency travel document for urgent travel needs</p>

        {/* Service Information */}
        <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6">
          <h3 className="font-semibold text-red-900 mb-2">About this Service</h3>
          <p className="text-sm text-gray-700 mb-2">
            This service provides emergency travel documents for South Sudanese citizens who have lost their passport while abroad or need urgent travel documentation. Valid for single journey only.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 text-sm">
            <div><strong>Processing Time:</strong> 1-2 Days</div>
            <div><strong>Price:</strong> Expedited fee applies</div>
            <div><strong>Provided by:</strong> DGIE</div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Emergency Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Emergency Details</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Reason for Emergency Document *</label>
                <select {...register('emergencyReason', { required: true })} className="w-full px-4 py-2 border rounded-lg">
                  <option value="">Select reason</option>
                  <option value="lost">Lost Passport</option>
                  <option value="stolen">Stolen Passport</option>
                  <option value="damaged">Damaged Passport</option>
                  <option value="urgent-travel">Urgent Travel Need</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Current Location *</label>
                <input {...register('currentLocation', { required: true })} placeholder="City, Country" className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Intended Travel Date *</label>
                <input type="date" {...register('travelDate', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Destination *</label>
                <input {...register('destination', { required: true })} placeholder="City, Country" className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Detailed Explanation of Emergency *</label>
                <textarea {...register('emergencyExplanation', { required: true })} rows={4} placeholder="Provide detailed information about your situation..." className="w-full px-4 py-2 border rounded-lg" />
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
                <label className="block text-sm font-medium mb-1">Place of Birth *</label>
                <input {...register('placeOfBirth', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Nationality *</label>
                <input {...register('nationality', { required: true })} value="South Sudanese" readOnly className="w-full px-4 py-2 border rounded-lg bg-gray-50" />
              </div>
            </div>
          </div>

          {/* Previous Passport Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Previous Passport Information</h3>
            <p className="text-sm text-gray-600 mb-4">Provide details of your lost/stolen/damaged passport if available</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Previous Passport Number</label>
                <input {...register('previousPassportNumber')} className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Issue Date</label>
                <input type="date" {...register('previousIssueDate')} className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Expiry Date</label>
                <input type="date" {...register('previousExpiryDate')} className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Place of Issue</label>
                <input {...register('previousPlaceOfIssue')} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
          </div>

          {/* Police Report Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Police Report (if applicable)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Police Report Number</label>
                <input {...register('policeReportNumber')} placeholder="If passport was lost/stolen" className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Police Station</label>
                <input {...register('policeStation')} className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Report Date</label>
                <input type="date" {...register('reportDate')} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number *</label>
                <input {...register('phone', { required: true })} placeholder="Include country code" className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email Address *</label>
                <input type="email" {...register('email', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Current Address *</label>
                <input {...register('currentAddress', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Emergency Contact Name *</label>
                <input {...register('emergencyContactName', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Emergency Contact Phone *</label>
                <input {...register('emergencyContactPhone', { required: true })} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
          </div>

          {/* Required Documents */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Required Documents</h3>
            <p className="text-sm text-gray-600 mb-4">Photo must be jpeg/jpg (max 200kb). Other documents must be PDF (max 500kb).</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">1. Recent passport-size photo *</label>
                <input type="file" {...register('photo', { required: true })} accept="image/jpeg,image/jpg" className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">2. Copy of previous passport (if available)</label>
                <input type="file" {...register('previousPassportCopy')} accept="application/pdf" className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">3. Police report (if passport lost/stolen) *</label>
                <input type="file" {...register('policeReport', { required: true })} accept="application/pdf" className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">4. National ID or birth certificate *</label>
                <input type="file" {...register('identityDocument', { required: true })} accept="application/pdf" className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">5. Travel itinerary or ticket *</label>
                <input type="file" {...register('travelItinerary', { required: true })} accept="application/pdf" className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">6. Application letter explaining emergency *</label>
                <input type="file" {...register('applicationLetter', { required: true })} accept="application/pdf" className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> Emergency travel documents are valid for single journey only and must be used within the specified travel dates. Processing is expedited but requires all supporting documents.
            </p>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 font-semibold">
            {loading ? 'Submitting...' : 'Submit Emergency Application'}
          </button>
        </form>
      </div>
    </div>
  );
}
