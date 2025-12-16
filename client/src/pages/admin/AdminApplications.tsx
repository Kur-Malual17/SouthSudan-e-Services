import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    applicationType: searchParams.get('applicationType') || '',
  });

  useEffect(() => {
    fetchApplications();
  }, [filters]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.applicationType) params.append('application_type', filters.applicationType);
      
      const response = await api.get(`/applications/?${params.toString()}`);
      console.log('Applications response:', response.data);
      
      // Handle both array and object responses
      const apps = Array.isArray(response.data) ? response.data : response.data.results || [];
      setApplications(apps);
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      toast.error(error.response?.data?.error || 'Failed to load applications');
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

  const getTypeLabel = (type: string) => {
    const labels: any = {
      'passport-first': 'Passport First-Time',
      'passport-replacement': 'Passport Replacement',
      'nationalid-first': 'National ID First-Time',
      'nationalid-replacement': 'National ID Replacement',
    };
    return labels[type] || type;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Applications</h1>
        <Link to="/admin" className="text-primary hover:underline">← Back to Dashboard</Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Filter by Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="collected">Collected</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Filter by Type</label>
            <select
              value={filters.applicationType}
              onChange={(e) => setFilters({ ...filters, applicationType: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">All Types</option>
              <option value="passport-first">Passport First-Time</option>
              <option value="passport-replacement">Passport Replacement</option>
              <option value="nationalid-first">National ID First-Time</option>
              <option value="nationalid-replacement">National ID Replacement</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ status: '', applicationType: '' })}
              className="w-full px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : applications.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600">No applications found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Confirmation #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app: any) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{app.confirmation_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {app.first_name} {app.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{getTypeLabel(app.application_type)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                      {app.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(app.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link to={`/admin/applications/${app.id}`} className="text-primary hover:underline">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
