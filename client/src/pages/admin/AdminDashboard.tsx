import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await api.get('/admin/statistics/');
      setStats(response.data.statistics);
    } catch (error) {
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-600 text-sm mb-1">Total Applications</div>
          <div className="text-3xl font-bold text-primary">{stats?.total || 0}</div>
        </div>
        <div className="bg-yellow-50 p-6 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="text-gray-600 text-sm mb-1">Pending</div>
          <div className="text-3xl font-bold text-yellow-600">{stats?.by_status?.pending || 0}</div>
        </div>
        <div className="bg-green-50 p-6 rounded-lg shadow border-l-4 border-green-500">
          <div className="text-gray-600 text-sm mb-1">Approved</div>
          <div className="text-3xl font-bold text-green-600">{stats?.by_status?.approved || 0}</div>
        </div>
        <div className="bg-red-50 p-6 rounded-lg shadow border-l-4 border-red-500">
          <div className="text-gray-600 text-sm mb-1">Rejected</div>
          <div className="text-3xl font-bold text-red-600">{stats?.by_status?.rejected || 0}</div>
        </div>
      </div>

      {/* Application Types */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Applications by Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded">
            <div className="text-sm text-gray-600">Passport First-Time</div>
            <div className="text-2xl font-bold text-blue-600">{stats?.by_type?.['passport-first'] || 0}</div>
          </div>
          <div className="p-4 bg-green-50 rounded">
            <div className="text-sm text-gray-600">Passport Replacement</div>
            <div className="text-2xl font-bold text-green-600">{stats?.by_type?.['passport-replacement'] || 0}</div>
          </div>
          <div className="p-4 bg-purple-50 rounded">
            <div className="text-sm text-gray-600">National ID First-Time</div>
            <div className="text-2xl font-bold text-purple-600">{stats?.by_type?.['nationalid-first'] || 0}</div>
          </div>
          <div className="p-4 bg-orange-50 rounded">
            <div className="text-sm text-gray-600">National ID Replacement</div>
            <div className="text-2xl font-bold text-orange-600">{stats?.by_type?.['nationalid-replacement'] || 0}</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/admin/applications?status=pending" className="p-4 border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition text-center">
            <div className="text-2xl mb-2">📋</div>
            <div className="font-semibold">Review Pending</div>
          </Link>
          <Link to="/admin/applications" className="p-4 border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition text-center">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-semibold">All Applications</div>
          </Link>
          <button className="p-4 border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition">
            <div className="text-2xl mb-2">📈</div>
            <div className="font-semibold">Generate Report</div>
          </button>
        </div>
      </div>
    </div>
  );
}
