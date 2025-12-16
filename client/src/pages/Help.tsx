import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Help() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: 'How do I apply for a passport?',
      answer: 'To apply for a passport, first create an account or login. Then go to Dashboard and select "e-Passport First-Time Application". Fill out all required fields, upload necessary documents (photo, ID copy, signature), and submit your application. You will receive a confirmation number to track your application status.'
    },
    {
      question: 'What documents do I need for a passport application?',
      answer: 'You need: 1) A passport-sized photo with white background, 2) A copy of your National ID, 3) Your signature image. For replacement passports, you may also need your old passport (if available) and a police report (if lost or stolen).'
    },
    {
      question: 'How long does it take to process my application?',
      answer: 'Processing times vary depending on the type of application and current workload. Typically, passport applications take 2-4 weeks, while National ID applications take 1-2 weeks. You can track your application status online using your confirmation number.'
    },
    {
      question: 'How do I track my application status?',
      answer: 'After logging in, go to "My Applications" in the navigation menu. You will see all your submitted applications with their current status (Pending, In Progress, Approved, or Rejected). You can also check your email for status updates.'
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'Currently, we accept online payment through our secure payment gateway. Payment must be completed before your application can be processed. You will receive a payment confirmation via email.'
    },
    {
      question: 'Can I edit my application after submission?',
      answer: 'No, once an application is submitted, it cannot be edited. If you made an error, please contact our support team immediately at info@immigration.gov.ss or call +211 924828569. You may need to submit a new application.'
    },
    {
      question: 'Where do I collect my passport/National ID?',
      answer: 'Once your application is approved, you will receive an email with an approval document (PDF). Bring this document and your original National ID to the Immigration Head Office in Juba during office hours (Monday-Friday, 8:00 AM - 4:00 PM) to collect your document.'
    },
    {
      question: 'What if my application is rejected?',
      answer: 'If your application is rejected, you will receive an email explaining the reason. Common reasons include incomplete information, poor quality photos, or missing documents. You can submit a new application after addressing the issues mentioned in the rejection notice.'
    },
    {
      question: 'How do I replace a lost or stolen passport?',
      answer: 'Select "e-Passport Replacement" from the Dashboard. Choose "Lost" or "Stolen" as the reason, and upload a police report along with other required documents. If you have your old passport number, include it in the application.'
    },
    {
      question: 'Can I apply on behalf of someone else?',
      answer: 'For applicants below 18 years, a parent or guardian can apply on their behalf using the "Below 18" option. For adults, each person must create their own account and submit their own application.'
    },
    {
      question: 'Is my personal information secure?',
      answer: 'Yes, we use bank-level security to protect your data. All information is encrypted and stored securely. We never share your personal information with third parties without your consent.'
    },
    {
      question: 'What if I forgot my password?',
      answer: 'Click on "Forgot Password" on the login page. Enter your registered email address, and we will send you instructions to reset your password. If you don\'t receive the email, check your spam folder or contact support.'
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 text-sm font-medium">
          ← Back to Home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-3">Help & Support</h1>
          <div className="w-24 h-1 bg-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find answers to frequently asked questions about our immigration services
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <Link to="/contact" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center border-t-4 border-blue-600">
            <h3 className="font-semibold text-blue-900">Contact Us</h3>
            <p className="text-sm text-gray-600 mt-1">Get in touch with our team</p>
          </Link>
          
          <Link to="/dashboard" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center border-t-4 border-green-600">
            <h3 className="font-semibold text-blue-900">Apply Now</h3>
            <p className="text-sm text-gray-600 mt-1">Start your application</p>
          </Link>
          
          <Link to="/my-applications" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center border-t-4 border-yellow-400">
            <h3 className="font-semibold text-blue-900">Track Status</h3>
            <p className="text-sm text-gray-600 mt-1">Check your applications</p>
          </Link>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition flex justify-between items-center"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <span className="text-2xl text-blue-600">
                    {openFaq === index ? '−' : '+'}
                  </span>
                </button>
                
                {openFaq === index && (
                  <div className="px-6 py-4 bg-white border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Still Need Help */}
        <div className="mt-8 bg-blue-600 text-white p-6 sm:p-8 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-3">Still Need Help?</h3>
          <p className="mb-6">Our support team is ready to assist you</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Contact Support
            </Link>
            <a href="tel:+211924828569" className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition">
              Call: +211 924828569
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
