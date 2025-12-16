import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useLanguageStore } from '../store/languageStore';
import { useTranslation } from '../hooks/useTranslation';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguageStore();
  const { t } = useTranslation();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Announcement Bar - Irembo Style */}
      <div className={`fixed top-0 left-0 right-0 z-50 bg-yellow-400 text-gray-900 py-3 px-4 text-center text-xs sm:text-sm font-medium shadow-sm ${language === 'ar' ? 'rtl' : 'ltr'}`}>
        <span className="flex items-center justify-center">
          <svg className={`w-4 h-4 ${language === 'ar' ? 'ml-2' : 'mr-2'} flex-shrink-0 hidden sm:block`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
          </svg>
          <span className="leading-tight">{t('welcomeMessage')}</span>
        </span>
      </div>

      {/* Main Navigation Bar - Irembo Style */}
      <nav className="fixed top-[52px] left-0 right-0 z-40 bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo - Irembo Style */}
            <div className="flex items-center flex-shrink-0">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg p-1.5 shadow-md flex-shrink-0">
                  <svg viewBox="0 0 900 600" className="w-full h-full">
                    <rect width="900" height="600" fill="#078930"/>
                    <rect width="900" height="400" fill="#DA121A"/>
                    <rect width="900" height="200" fill="#000000"/>
                    <rect width="900" height="40" y="200" fill="#FFFFFF"/>
                    <rect width="900" height="40" y="360" fill="#FFFFFF"/>
                    <path d="M 0,0 L 0,600 L 400,300 Z" fill="#0F47AF"/>
                    <path d="M 133,300 L 148,340 L 190,340 L 156,365 L 171,405 L 133,380 L 95,405 L 110,365 L 76,340 L 118,340 Z" fill="#FCDD09"/>
                  </svg>
                </div>
                <div className="hidden sm:block">
                  <div className="text-lg font-bold tracking-tight">{t('immigrationPortal')}</div>
                  <div className="text-xs font-light opacity-90">{t('govPortal')}</div>
                </div>
              </Link>
            </div>
            
            {/* Desktop Navigation - Irembo Style */}
            <div className={`hidden md:flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-1`}>
              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-2 px-3 py-2 rounded hover:bg-blue-700 transition text-sm font-medium"
                title={language === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span>{language === 'en' ? 'العربية' : 'English'}</span>
              </button>
              {user ? (
                <>
                  <Link to="/help" className={`flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-1 px-3 py-2 rounded hover:bg-blue-700 transition text-sm`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span>{t('supportCenter')}</span>
                  </Link>
                  {['admin', 'officer', 'supervisor'].includes(user.role) ? (
                    <Link to="/admin" className={`flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-1 px-3 py-2 rounded hover:bg-blue-700 transition text-sm`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span>{t('adminDashboard')}</span>
                    </Link>
                  ) : (
                    <Link to="/my-applications" className={`flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-1 px-3 py-2 rounded hover:bg-blue-700 transition text-sm`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span>{t('myApplications')}</span>
                    </Link>
                  )}
                  <div className="h-6 w-px bg-white/30 mx-2"></div>
                  <Link to={['admin', 'officer', 'supervisor'].includes(user.role) ? "/admin" : "/dashboard"} className={`flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-1 px-3 py-2 rounded hover:bg-blue-700 transition text-sm`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{user.firstName} ({user.role})</span>
                  </Link>
                  <button onClick={logout} className={`flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-1 px-3 py-2 rounded hover:bg-blue-700 transition text-sm`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>{t('logOut')}</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/help" className={`flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-1 px-3 py-2 rounded hover:bg-blue-700 transition text-sm`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span>{t('supportCenter')}</span>
                  </Link>
                  <div className="h-6 w-px bg-white/30 mx-2"></div>
                  <Link to="/register" className={`flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-1 px-3 py-2 rounded hover:bg-blue-700 transition text-sm`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span>{t('signUp')}</span>
                  </Link>
                  <Link to="/login" className={`flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-1 px-4 py-2 bg-white text-blue-600 rounded hover:bg-gray-100 transition text-sm font-semibold`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>{t('logIn')}</span>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-white/20">
              <div className="flex flex-col space-y-3 pt-4">
                {/* Language Switcher Mobile */}
                <button
                  onClick={toggleLanguage}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-white/10 rounded hover:bg-white/20 transition text-sm font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <span>{language === 'en' ? 'العربية' : 'English'}</span>
                </button>
                
                {user ? (
                  <>
                    <Link to="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-yellow-300 transition text-sm py-2">{t('home')}</Link>
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="hover:text-yellow-300 transition text-sm py-2">{t('dashboard')}</Link>
                    <Link to="/my-applications" onClick={() => setMobileMenuOpen(false)} className="hover:text-yellow-300 transition text-sm py-2">{t('myApplications')}</Link>
                    <Link to="/help" onClick={() => setMobileMenuOpen(false)} className="hover:text-yellow-300 transition text-sm py-2">{t('helpSupport')}</Link>
                    <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-yellow-300 transition text-sm py-2">{t('contactUs')}</Link>
                    {['admin', 'officer', 'supervisor'].includes(user.role) && (
                      <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="hover:text-yellow-300 transition text-sm py-2">{t('adminDashboard')}</Link>
                    )}
                    <div className="text-sm bg-white/10 px-3 py-2 rounded">{t('user')}: {user.firstName} {user.lastName}</div>
                    <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="bg-gradient-to-r from-green-600 to-teal-600 px-4 py-2 rounded hover:from-green-700 hover:to-teal-700 transition text-sm text-left">
                      {t('logout')}
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/help" onClick={() => setMobileMenuOpen(false)} className="hover:text-yellow-300 transition text-sm py-2">{t('helpSupport')}</Link>
                    <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-yellow-300 transition text-sm py-2">{t('contactUs')}</Link>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="hover:text-yellow-300 transition text-sm py-2">{t('login')}</Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition font-semibold text-sm text-center">
                      {t('register')}
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
      
      {/* Add padding to prevent content from going under fixed navbar (announcement bar 52px + nav 64px = 116px) */}
      <div className="h-[116px]"></div>
      
      <main>
        <Outlet />
      </main>
      
      {/* Responsive Footer */}
      <footer className={`bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white mt-12 border-t-4 border-yellow-400 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <h3 className="font-semibold mb-2 text-yellow-400 text-sm sm:text-base">{t('contactUsFooter')}</h3>
              <p className="text-xs sm:text-sm">{t('phone')}: +211 924828569</p>
              <p className="text-xs sm:text-sm">{t('email')}: info@immigration.gov.ss</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-yellow-400 text-sm sm:text-base">{t('officeHoursFooter')}</h3>
              <p className="text-xs sm:text-sm">{t('mondayFriday')}</p>
              <p className="text-xs sm:text-sm">{t('workingHours')}</p>
            </div>
            <div className="sm:col-span-2 md:col-span-1">
              <h3 className="font-semibold mb-2 text-yellow-400 text-sm sm:text-base">{t('location')}</h3>
              <p className="text-xs sm:text-sm">{t('immigrationOffice')}</p>
              <p className="text-xs sm:text-sm">{t('jubaLocation')}</p>
            </div>
          </div>
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-700 text-center text-xs sm:text-sm">
            <p>&copy; {new Date().getFullYear()} {t('copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
