import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [processingCard, setProcessingCard] = useState(false);
  const [application, setApplication] = useState<any>(null);
  const [fetchingApp, setFetchingApp] = useState(true);
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (id) {
      fetchApplication();
    }
  }, [id]);

  const fetchApplication = async () => {
    try {
      const response = await api.get(`/applications/${id}/`);
      setApplication(response.data);
    } catch (error) {
      console.error('Failed to fetch application:', error);
      toast.error('Failed to load application details');
    } finally {
      setFetchingApp(false);
    }
  };

  const getPaymentAmount = (type: string) => {
    // Amounts in GHS (Ghanaian Cedi)
    const amounts: Record<string, number> = {
      'passport-first': 500,
      'passport-replacement': 300,
      'nationalid-first': 200,
      'nationalid-replacement': 150,
    };
    return amounts[type] || 500;
  };

  const getApplicationTypeName = (type: string) => {
    const names: Record<string, string> = {
      'passport-first': 'e-Passport First-Time',
      'passport-replacement': 'e-Passport Replacement',
      'nationalid-first': 'National ID First-Time',
      'nationalid-replacement': 'National ID Replacement',
    };
    return names[type] || type;
  };

  if (fetchingApp) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Application not found</p>
          <button
            onClick={() => navigate('/my-applications')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  const amount = getPaymentAmount(application.application_type);

  const handleCardPayment = async () => {
    if (!id) {
      toast.error('Application ID not found');
      return;
    }

    setProcessingCard(true);
    try {
      const response = await api.post('/payment/initialize/', {
        application_id: id,
        callback_url: `${window.location.origin}/payment/verify`
      });

      if (response.data.success) {
        // Redirect to Paystack
        window.location.href = response.data.authorization_url;
      } else {
        toast.error(response.data.error || 'Payment initialization failed');
      }
    } catch (error: any) {
      console.error('Card payment error:', error);
      toast.error(error.response?.data?.error || 'Failed to initialize card payment');
    } finally {
      setProcessingCard(false);
    }
  };

  const onSubmit = async (data: any) => {
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('payment_method', paymentMethod);
      formData.append('payment_reference', data.payment_reference);
      
      if (data.payment_proof?.[0]) {
        formData.append('payment_proof', data.payment_proof[0]);
      }

      await api.patch(`/applications/${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Payment information submitted successfully! Awaiting verification.');
      navigate('/my-applications');
    } catch (error: any) {
      console.error('Payment submission error:', error);
      toast.error(error.response?.data?.error || 'Failed to submit payment information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">Make Payment</h1>
          <p className="text-gray-600">Choose your preferred payment method to complete your application</p>
        </div>

        {/* Amount Card */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 rounded-2xl shadow-2xl p-8 mb-6 text-white">
          <div className="max-w-3xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <p className="text-blue-100 text-sm mb-1">Application Details</p>
                <h2 className="text-2xl font-bold mb-2">{getApplicationTypeName(application.application_type)}</h2>
                <div className="flex items-center text-sm text-blue-100">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Confirmation: {application.confirmation_number}
                </div>
                <div className="flex items-center text-sm text-blue-100 mt-1">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  {application.first_name} {application.last_name}
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-blue-100 text-sm mb-2">Amount to Pay</p>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 inline-block">
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold">GHS {amount}</span>
                  </div>
                  <p className="text-xs text-blue-100 mt-2">Ghanaian Cedi</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Info Banner */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
            <div className="flex items-center text-gray-700">
              <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm">
                Select your preferred payment method and follow the instructions to complete your payment securely.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Payment Method Selection */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Methods</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
                  {/* Mobile Money */}
                  <div
                    onClick={() => setPaymentMethod('momo')}
                    className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                      paymentMethod === 'momo' 
                        ? 'border-green-500 bg-green-50 shadow-lg scale-105' 
                        : 'border-gray-200 hover:border-green-300 hover:shadow-md'
                    }`}
                  >
                    {paymentMethod === 'momo' && (
                      <div className="absolute top-3 right-3">
                        <div className="bg-green-500 text-white rounded-full p-1">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="font-bold text-lg text-gray-800 mb-2">Mobile Money</h3>
                      <p className="text-sm text-gray-600 mb-3">MTN / Airtel Money</p>
                      <div className="flex items-center justify-center text-xs text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Instant
                      </div>
                    </div>
                  </div>

                  {/* Credit/Debit Card */}
                  <div
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                      paymentMethod === 'credit_card' 
                        ? 'border-blue-500 bg-blue-50 shadow-lg scale-105' 
                        : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                    }`}
                  >
                    {paymentMethod === 'credit_card' && (
                      <div className="absolute top-3 right-3">
                        <div className="bg-blue-500 text-white rounded-full p-1">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <h3 className="font-bold text-lg text-gray-800 mb-2">Card Payment</h3>
                      <p className="text-sm text-gray-600 mb-3">Visa, Mastercard, Verve</p>
                      <div className="flex items-center justify-center text-xs text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Secure
                      </div>
                    </div>
                  </div>

                  {/* Bank Transfer */}
                  <div
                    onClick={() => setPaymentMethod('bank')}
                    className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                      paymentMethod === 'bank' 
                        ? 'border-purple-500 bg-purple-50 shadow-lg scale-105' 
                        : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                    }`}
                  >
                    {paymentMethod === 'bank' && (
                      <div className="absolute top-3 right-3">
                        <div className="bg-purple-500 text-white rounded-full p-1">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                        </svg>
                      </div>
                      <h3 className="font-bold text-lg text-gray-800 mb-2">Bank Transfer</h3>
                      <p className="text-sm text-gray-600 mb-3">Direct bank deposit</p>
                      <div className="flex items-center justify-center text-xs text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        1-2 days
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Instructions */}
              {paymentMethod === 'momo' && (
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                  <h3 className="font-bold text-lg text-green-900 mb-4">Mobile Money Instructions</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                        <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
                        MTN Mobile Money
                      </h4>
                      <ol className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">•</span>
                          <span>Dial <strong>*165#</strong></span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">•</span>
                          <span>Pay 15000 SSP</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">•</span>
                          <span>Select "Send Money"</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">•</span>
                          <span>Enter: <strong>0921234567</strong></span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">•</span>
                          <span>Enter amount and confirm</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">•</span>
                          <span>Save the transaction reference</span>
                        </li>
                      </ol>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                        <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
                        Airtel Money
                      </h4>
                      <ol className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">•</span>
                          <span>Dial <strong>*185#</strong></span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">•</span>
                          <span>Pay 15000 SSP</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">•</span>
                          <span>Select "Send Money"</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">•</span>
                          <span>Enter: <strong>0971234567</strong></span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">•</span>
                          <span>Enter amount and confirm</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">•</span>
                          <span>Save the transaction reference</span>
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'credit_card' && (
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-xl text-blue-900 mb-2">Secure Card Payment</h3>
                    <p className="text-gray-700 mb-6">
                      You will be redirected to Paystack's secure payment page to complete your transaction safely.
                    </p>
                    <button
                      type="button"
                      onClick={handleCardPayment}
                      disabled={processingCard}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl hover:shadow-xl transition-all disabled:opacity-50 font-bold text-lg flex items-center justify-center"
                    >
                      {processingCard ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Pay with Card Now
                        </>
                      )}
                    </button>
                    <p className="text-xs text-gray-500 mt-3">
                      Powered by Paystack - PCI DSS Compliant
                    </p>
                  </div>
                </div>
              )}

              {paymentMethod === 'bank' && (
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <h3 className="font-bold text-lg text-purple-900 mb-4">Bank Transfer Details</h3>
                  <div className="bg-white rounded-lg p-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <div className="bg-purple-100 rounded-lg p-2 mr-3">
                          <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Bank Name</p>
                          <p className="font-semibold text-gray-800">Bank of South Sudan</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-purple-100 rounded-lg p-2 mr-3">
                          <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Account Name</p>
                          <p className="font-semibold text-gray-800">Immigration Services</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-purple-100 rounded-lg p-2 mr-3">
                          <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Account Number</p>
                          <p className="font-semibold text-gray-800 text-lg">1234567890</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-purple-100 rounded-lg p-2 mr-3">
                          <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Amount</p>
                          <p className="font-semibold text-gray-800 text-lg">15000</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-purple-100 rounded-lg p-2 mr-3">
                          <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Branch</p>
                          <p className="font-semibold text-gray-800">Juba Main Branch</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        <strong>Important:</strong> Use your application confirmation number as the payment reference
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Fields for Mobile Money and Bank Transfer */}
              {paymentMethod && paymentMethod !== 'credit_card' && (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-lg text-gray-800 mb-4">Complete Your Payment</h3>
                    
                    {/* Transaction Reference */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Transaction Reference Number *
                      </label>
                      <input
                        {...register('payment_reference', { required: 'Transaction reference is required' })}
                        placeholder="Enter your transaction reference (e.g., MTN-123456789)"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                      {errors.payment_reference && (
                        <p className="text-red-600 text-sm mt-1 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.payment_reference.message as string}
                        </p>
                      )}
                    </div>

                    {/* Payment Proof Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Payment Receipt/Screenshot *
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <input
                          type="file"
                          {...register('payment_proof', { required: 'Payment proof is required' })}
                          accept="image/*,application/pdf"
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          JPG, PNG, or PDF (Max 5MB)
                        </p>
                      </div>
                      {errors.payment_proof && (
                        <p className="text-red-600 text-sm mt-1 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.payment_proof.message as string}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 rounded-xl hover:shadow-xl transition-all disabled:opacity-50 font-bold text-lg flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Submit Payment Information
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Footer Note */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                <div className="flex">
                  <svg className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Important Information</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      After submitting your payment information, our team will verify it within 24 hours. 
                      You will receive an email notification once verified.
                    </p>
                  </div>
                </div>
              </div>

              {/* Cancel Button */}
              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/my-applications')}
                  className="text-gray-600 hover:text-gray-800 font-medium transition"
                >
                  ← Back to My Applications
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
