import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showPaymentRejectModal, setShowPaymentRejectModal] = useState(false);
  const [paymentRejectionReason, setPaymentRejectionReason] = useState('');
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      const response = await api.get(`/applications/${id}/`);
      setApplication(response.data);
    } catch (error) {
      toast.error('Failed to load application');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!confirm('Are you sure you want to approve this application? An email with PDF will be sent to the applicant.')) {
      return;
    }

    setActionLoading(true);
    try {
      await api.post(`/applications/${id}/approve/`);
      toast.success('Application approved! Email sent to applicant.');
      fetchApplication();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to approve application');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setActionLoading(true);
    try {
      await api.post(`/applications/${id}/reject/`, { reason: rejectionReason });
      toast.success('Application rejected');
      setShowRejectModal(false);
      fetchApplication();
    } catch (error) {
      toast.error('Failed to reject application');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setActionLoading(true);
    try {
      await api.patch(`/applications/${id}/update_status/`, { status: newStatus });
      toast.success('Status updated');
      fetchApplication();
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyPayment = async () => {
    if (!confirm('Are you sure you want to approve this payment?')) {
      return;
    }

    setActionLoading(true);
    try {
      await api.post(`/applications/${id}/verify_payment/`);
      toast.success('Payment verified successfully!');
      fetchApplication();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to verify payment');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectPayment = async () => {
    if (!paymentRejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setActionLoading(true);
    try {
      await api.post(`/applications/${id}/reject_payment/`, { reason: paymentRejectionReason });
      toast.success('Payment rejected');
      setShowPaymentRejectModal(false);
      setPaymentRejectionReason('');
      fetchApplication();
    } catch (error) {
      toast.error('Failed to reject payment');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-8">Loading...</div>;
  }

  if (!application) {
    return <div className="max-w-7xl mx-auto px-4 py-8">Application not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/admin/applications')} className="text-primary hover:underline mb-4">
        ← Back to Applications
      </button>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Application Details</h1>
            <p className="text-gray-600">Confirmation: {application.confirmation_number}</p>
          </div>
          <div className="text-right">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              application.status === 'approved' ? 'bg-green-100 text-green-800' :
              application.status === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {application.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Payment Verification Section */}
        {application.payment_proof && application.payment_status === 'pending' && (
          <div className="mb-6 p-6 bg-blue-50 border-2 border-blue-300 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-blue-900">Payment Verification Required</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-700"><strong>Payment Method:</strong> {application.payment_method}</p>
                <p className="text-sm text-gray-700"><strong>Transaction Reference:</strong> {application.payment_reference}</p>
                <p className="text-sm text-gray-700"><strong>Amount:</strong> {application.payment_amount} SSP</p>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2 text-gray-700">Payment Proof:</p>
                <img 
                  src={`http://localhost:8000${application.payment_proof}`} 
                  alt="Payment Proof" 
                  className="w-full max-w-xs h-48 object-contain border rounded cursor-pointer hover:opacity-80"
                  onClick={() => setViewingImage(`http://localhost:8000${application.payment_proof}`)}
                />
                <button
                  onClick={() => setViewingImage(`http://localhost:8000${application.payment_proof}`)}
                  className="text-xs text-blue-600 hover:underline mt-1"
                >
                  🔍 Click to view full size
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleVerifyPayment}
                disabled={actionLoading}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold"
              >
                Verify Payment
              </button>
              <button
                onClick={() => setShowPaymentRejectModal(true)}
                disabled={actionLoading}
                className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 font-semibold"
              >
                Reject Payment
              </button>
            </div>
          </div>
        )}

        {/* Payment Status Messages */}
        {application.payment_status === 'completed' && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
            <p className="text-green-800">Payment verified and approved.</p>
          </div>
        )}

        {application.payment_status === 'failed' && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
            <p className="text-red-800 font-medium">Payment Rejected</p>
            {application.payment_rejection_reason && (
              <p className="text-sm text-red-700 mt-1">Reason: {application.payment_rejection_reason}</p>
            )}
          </div>
        )}

        {application.payment_status === 'pending' && !application.payment_proof && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
            <p className="text-yellow-800">Waiting for applicant to submit payment proof.</p>
          </div>
        )}

        {/* Action Buttons */}
        {application.status === 'pending' && (
          <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <button
              onClick={handleApprove}
              disabled={actionLoading || application.payment_status !== 'completed'}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              Approve & Send Email
            </button>
            <button
              onClick={() => setShowRejectModal(true)}
              disabled={actionLoading}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              Reject
            </button>
            <button
              onClick={() => handleStatusChange('in-progress')}
              disabled={actionLoading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              → Mark In Progress
            </button>
          </div>
        )}

        {application.payment_status !== 'completed' && application.status === 'pending' && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
            <p className="text-yellow-800">Payment not completed. Cannot approve application until payment is verified.</p>
          </div>
        )}

        {/* Application Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-lg mb-3">Applicant Information</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> {application.first_name} {application.middle_name} {application.last_name}</p>
              <p><strong>Date of Birth:</strong> {new Date(application.date_of_birth).toLocaleDateString()}</p>
              <p><strong>Gender:</strong> {application.gender}</p>
              <p><strong>Nationality:</strong> {application.nationality}</p>
              <p><strong>National ID:</strong> {application.national_id_number || 'N/A'}</p>
              <p><strong>Father's Name:</strong> {application.father_name}</p>
              <p><strong>Mother's Name:</strong> {application.mother_name}</p>
              <p><strong>Marital Status:</strong> {application.marital_status}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Contact Information</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Phone:</strong> {application.phone_number}</p>
              <p><strong>Email:</strong> {application.email}</p>
              <p><strong>Address:</strong> {application.place_of_residence}, {application.city}, {application.state}, {application.country}</p>
              <p><strong>Birth Place:</strong> {application.birth_city}, {application.birth_state}, {application.birth_country}</p>
            </div>
          </div>
        </div>

        {/* Application Specific Details */}
        {application.application_type?.includes('passport') && (
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3">Passport Details</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Passport Type:</strong> {application.passport_type}</p>
              {application.travel_purpose && <p><strong>Travel Purpose:</strong> {application.travel_purpose}</p>}
              {application.destination_country && (
                <p><strong>Destination:</strong> {application.destination_city}, {application.destination_country}</p>
              )}
            </div>
          </div>
        )}

        {application.replacement_reason && (
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3">Replacement Information</h3>
            <p className="text-sm"><strong>Reason:</strong> {application.replacement_reason.toUpperCase()}</p>
          </div>
        )}

        {/* Attachments */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-3">Uploaded Documents</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Photo */}
            {application.photo && (
              <div className="border rounded p-2 hover:shadow-lg transition">
                <p className="text-xs font-medium mb-1 text-gray-700">Passport Photo</p>
                <img 
                  src={`http://localhost:8000${application.photo}`} 
                  alt="Photo" 
                  className="w-full h-32 object-cover rounded cursor-pointer hover:opacity-80"
                  onClick={() => setViewingImage(`http://localhost:8000${application.photo}`)}
                  onError={(e) => {
                    console.error('Failed to load photo:', application.photo);
                    e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><text x="10" y="50">Image not found</text></svg>';
                  }}
                />
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => setViewingImage(`http://localhost:8000${application.photo}`)}
                    className="text-xs text-blue-600 hover:underline flex-1 text-left"
                  >
                    🔍 View
                  </button>
                  <a
                    href={`http://localhost:8000${application.photo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-green-600 hover:underline"
                  >
                    🔗 Open
                  </a>
                </div>
              </div>
            )}
            
            {/* ID Copy */}
            {application.id_copy && (
              <div className="border rounded p-2 hover:shadow-lg transition">
                <p className="text-xs font-medium mb-1 text-gray-700">ID Copy</p>
                <div 
                  className="flex items-center justify-center h-32 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                  onClick={() => window.open(`http://localhost:8000${application.id_copy}`, '_blank', 'noopener,noreferrer')}
                >
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <button
                  onClick={() => window.open(`http://localhost:8000${application.id_copy}`, '_blank', 'noopener,noreferrer')}
                  className="text-xs text-blue-600 hover:underline block mt-1 w-full text-left"
                >
                  📄 View Document
                </button>
              </div>
            )}
            
            {/* Signature */}
            {application.signature && (
              <div className="border rounded p-2 hover:shadow-lg transition">
                <p className="text-xs font-medium mb-1 text-gray-700">Signature</p>
                <img 
                  src={`http://localhost:8000${application.signature}`} 
                  alt="Signature" 
                  className="w-full h-32 object-contain rounded cursor-pointer hover:opacity-80 bg-gray-50"
                  onClick={() => setViewingImage(`http://localhost:8000${application.signature}`)}
                />
                <button
                  onClick={() => setViewingImage(`http://localhost:8000${application.signature}`)}
                  className="text-xs text-blue-600 mt-1 hover:underline w-full text-left"
                >
                  🔍 Click to view full size
                </button>
              </div>
            )}
            
            {/* Birth Certificate */}
            {application.birth_certificate && (
              <div className="border rounded p-2 hover:shadow-lg transition">
                <p className="text-xs font-medium mb-1 text-gray-700">Birth Certificate</p>
                <div 
                  className="flex items-center justify-center h-32 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                  onClick={() => window.open(`http://localhost:8000${application.birth_certificate}`, '_blank', 'noopener,noreferrer')}
                >
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <button
                  onClick={() => window.open(`http://localhost:8000${application.birth_certificate}`, '_blank', 'noopener,noreferrer')}
                  className="text-xs text-blue-600 hover:underline block mt-1 w-full text-left"
                >
                  📄 View Document
                </button>
              </div>
            )}
            
            {/* Passport Photo (alternative field name) */}
            {application.passport_photo && (
              <div className="border rounded p-2 hover:shadow-lg transition">
                <p className="text-xs font-medium mb-1 text-gray-700">Passport Photo</p>
                <img 
                  src={`http://localhost:8000${application.passport_photo}`} 
                  alt="Passport Photo" 
                  className="w-full h-32 object-cover rounded cursor-pointer hover:opacity-80"
                  onClick={() => setViewingImage(`http://localhost:8000${application.passport_photo}`)}
                />
                <button
                  onClick={() => setViewingImage(`http://localhost:8000${application.passport_photo}`)}
                  className="text-xs text-blue-600 mt-1 hover:underline w-full text-left"
                >
                  🔍 Click to view full size
                </button>
              </div>
            )}
            
            {/* Supporting Documents */}
            {application.supporting_documents && (
              <div className="border rounded p-2 hover:shadow-lg transition">
                <p className="text-xs font-medium mb-1 text-gray-700">Supporting Documents</p>
                <div 
                  className="flex items-center justify-center h-32 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                  onClick={() => window.open(`http://localhost:8000${application.supporting_documents}`, '_blank', 'noopener,noreferrer')}
                >
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <button
                  onClick={() => window.open(`http://localhost:8000${application.supporting_documents}`, '_blank', 'noopener,noreferrer')}
                  className="text-xs text-blue-600 hover:underline block mt-1 w-full text-left"
                >
                  📄 View Document
                </button>
              </div>
            )}
            
            {/* Police Report */}
            {application.police_report && (
              <div className="border rounded p-2 hover:shadow-lg transition">
                <p className="text-xs font-medium mb-1 text-gray-700">Police Report</p>
                <div 
                  className="flex items-center justify-center h-32 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                  onClick={() => window.open(`http://localhost:8000${application.police_report}`, '_blank', 'noopener,noreferrer')}
                >
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <button
                  onClick={() => window.open(`http://localhost:8000${application.police_report}`, '_blank', 'noopener,noreferrer')}
                  className="text-xs text-blue-600 hover:underline block mt-1 w-full text-left"
                >
                  📄 View Document
                </button>
              </div>
            )}
            
            {/* Affidavit */}
            {application.affidavit && (
              <div className="border rounded p-2 hover:shadow-lg transition">
                <p className="text-xs font-medium mb-1 text-gray-700">Affidavit</p>
                <div 
                  className="flex items-center justify-center h-32 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                  onClick={() => window.open(`http://localhost:8000${application.affidavit}`, '_blank', 'noopener,noreferrer')}
                >
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <button
                  onClick={() => window.open(`http://localhost:8000${application.affidavit}`, '_blank', 'noopener,noreferrer')}
                  className="text-xs text-blue-600 hover:underline block mt-1 w-full text-left"
                >
                  📄 View Document
                </button>
              </div>
            )}
          </div>
          
          {!application.photo && !application.id_copy && !application.signature && !application.birth_certificate && !application.passport_photo && !application.supporting_documents && (
            <p className="text-gray-500 text-sm">No documents uploaded</p>
          )}
        </div>

        {/* Rejection Reason */}
        {application.status === 'rejected' && application.rejection_reason && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2">Rejection Reason</h3>
            <p className="text-sm text-red-700">{application.rejection_reason}</p>
          </div>
        )}
      </div>

      {/* Reject Application Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Reject Application</h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full px-4 py-2 border rounded-lg mb-4"
              rows={4}
            />
            <div className="flex gap-4">
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                Confirm Reject
              </button>
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 border py-2 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Payment Modal */}
      {showPaymentRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Reject Payment</h3>
            <textarea
              value={paymentRejectionReason}
              onChange={(e) => setPaymentRejectionReason(e.target.value)}
              placeholder="Enter reason for payment rejection (e.g., unclear screenshot, wrong amount, etc.)..."
              className="w-full px-4 py-2 border rounded-lg mb-4"
              rows={4}
            />
            <div className="flex gap-4">
              <button
                onClick={handleRejectPayment}
                disabled={actionLoading}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                Confirm Reject Payment
              </button>
              <button
                onClick={() => {
                  setShowPaymentRejectModal(false);
                  setPaymentRejectionReason('');
                }}
                className="flex-1 border py-2 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Viewer Modal */}
      {viewingImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4" onClick={() => setViewingImage(null)}>
          <div className="relative max-w-6xl max-h-full">
            <button
              onClick={() => setViewingImage(null)}
              className="absolute top-4 right-4 bg-white text-black rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200 z-10"
            >
              ✕
            </button>
            <img 
              src={viewingImage} 
              alt="Document" 
              className="max-w-full max-h-[90vh] object-contain rounded bg-white"
              onClick={(e) => e.stopPropagation()}
              onError={() => {
                console.error('Image failed to load:', viewingImage);
                toast.error('Failed to load image. Opening in new tab...');
                window.open(viewingImage, '_blank');
                setViewingImage(null);
              }}
            />
            <div className="text-center mt-4 space-x-4">
              <a 
                href={viewingImage} 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 inline-block"
                onClick={(e) => e.stopPropagation()}
              >
                🔗 Open in New Tab
              </a>
              <a 
                href={viewingImage} 
                download 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 inline-block"
                onClick={(e) => e.stopPropagation()}
              >
                📥 Download Image
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
