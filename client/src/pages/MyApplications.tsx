import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { useTranslation } from '../hooks/useTranslation';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications/my_applications/');
      setApplications(response.data.applications);
    } catch (error: any) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      collected: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: any = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeLabel = (type: string) => {
    const labels: any = {
      'passport-first': 'e-Passport First-Time',
      'passport-replacement': 'e-Passport Replacement',
      'nationalid-first': 'National ID First-Time',
      'nationalid-replacement': 'National ID Replacement',
    };
    return labels[type] || type;
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('myApplicationsTitle')}</h1>

      {applications.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600 mb-4">You haven't submitted any applications yet.</p>
          <a href="/dashboard" className="text-primary hover:underline">
            Go to Dashboard to apply
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app: any) => (
            <div key={app.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold">{getTypeLabel(app.application_type)}</h3>
                  <p className="text-sm text-gray-600">Confirmation: {app.confirmation_number}</p>
                  <p className="text-sm text-gray-600">
                    Submitted: {new Date(app.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right space-y-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium block ${getStatusColor(app.status)}`}>
                    {app.status.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium block ${getPaymentStatusColor(app.payment_status)}`}>
                    Payment: {app.payment_status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Payment Action */}
              {app.payment_status === 'pending' && !app.payment_proof && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-yellow-800 font-medium mb-2">Payment Required</p>
                  <p className="text-sm text-yellow-700 mb-3">
                    Please complete payment to proceed with your application.
                  </p>
                  <Link
                    to={`/payment/${app.id}`}
                    className="inline-block bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition font-medium"
                  >
                    Make Payment
                  </Link>
                </div>
              )}

              {/* Payment Pending Verification */}
              {app.payment_status === 'pending' && app.payment_proof && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-blue-800 font-medium">Payment Verification Pending</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Your payment proof has been submitted and is being verified by our team.
                  </p>
                </div>
              )}

              {/* Payment Completed */}
              {app.payment_status === 'completed' && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                  <p className="text-green-800 font-medium">Payment Verified</p>
                  <p className="text-sm text-green-700 mt-1">
                    Your payment has been verified. Your application is being processed.
                  </p>
                </div>
              )}

              {/* Payment Failed */}
              {app.payment_status === 'failed' && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
                  <p className="text-red-800 font-medium">Payment Rejected</p>
                  <p className="text-sm text-red-700 mt-1">
                    {app.payment_rejection_reason || 'Your payment proof was rejected. Please submit again.'}
                  </p>
                  <Link
                    to={`/payment/${app.id}`}
                    className="inline-block mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium"
                  >
                    Resubmit Payment
                  </Link>
                </div>
              )}
              
              {/* Application Approved */}
              {app.status === 'approved' && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                  <p className="text-green-800 font-medium">Your application has been approved!</p>
                  <p className="text-sm text-green-700 mt-1">
                    Please check your email for the approval document and visit our office in Juba to collect your document.
                  </p>
                </div>
              )}
              
              {/* Application Rejected */}
              {app.status === 'rejected' && app.rejection_reason && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
                  <p className="text-red-800 font-medium">Rejection Reason:</p>
                  <p className="text-sm text-red-700 mt-1">{app.rejection_reason}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
