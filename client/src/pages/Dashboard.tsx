import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from '../hooks/useTranslation';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { t } = useTranslation();

  const services = [
    {
      title: 'e-Passport First-Time',
      description: 'Apply for your first passport',
      link: '/apply/passport-first',
      color: 'border-primary',
    },
    {
      title: 'e-Passport Replacement',
      description: 'Replace your passport',
      link: '/apply/passport-replacement',
      color: 'border-secondary',
    },
    {
      title: 'National ID First-Time',
      description: 'Apply for your first National ID',
      link: '/apply/nationalid-first',
      color: 'border-accent',
    },
    {
      title: 'National ID Replacement',
      description: 'Replace your National ID',
      link: '/apply/nationalid-replacement',
      color: 'border-primary',
    },
    {
      title: 'National ID Correction',
      description: 'Correct errors on your National ID',
      link: '/apply/nationalid-correction',
      color: 'border-secondary',
    },
    {
      title: 'Visa Application',
      description: 'Apply for entry visa to South Sudan',
      link: '/apply/visa',
      color: 'border-accent',
    },
    {
      title: 'Permit Application',
      description: 'Apply for residence or work permit',
      link: '/apply/permit',
      color: 'border-primary',
    },
    {
      title: 'Emergency Travel Document',
      description: 'Get emergency travel document',
      link: '/apply/emergency-travel',
      color: 'border-secondary',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">{t('welcomeUser')}, {user?.firstName}!</h1>
        <p className="text-blue-100">{t('chooseService')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {services.map((service, index) => (
          <Link
            key={index}
            to={service.link}
            className={`bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all border-l-4 ${service.color} group`}
          >
            <h3 className="text-lg font-semibold mb-2 text-primary group-hover:text-secondary transition">{service.title}</h3>
            <p className="text-gray-600 text-sm">{service.description}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-accent">
        <h2 className="text-xl font-semibold mb-4 text-primary">{t('quickLinks')}</h2>
        <div className="space-y-2">
          <Link to="/my-applications" className="block text-primary hover:text-secondary transition">
            {t('viewMyApplications')}
          </Link>
          <Link to="/help" className="block text-primary hover:text-secondary transition">
            {t('helpSupport')}
          </Link>
          <Link to="/contact" className="block text-primary hover:text-secondary transition">
            {t('contactUs')}
          </Link>
        </div>
      </div>
    </div>
  );
}
