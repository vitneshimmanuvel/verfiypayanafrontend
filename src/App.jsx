import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import Navbartop from './components/Navbartop'
import HomePage from './components/HomePage'
import LanguageCourse from './components/LanguageCourse'
import Footer from './components/Footer'
import FooterBanner from './components/FooterBanner'
import WhatsAppButton from './components/WhatsAppButton'
import PrivacyPolicy from './components/PrivacyPolicy'
import ReferralPortal from './components/ReferralPortal'

// Admin Panel Imports
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.includes('payanaadmin');

  // Scroll to top when route changes
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <div className={isAdminRoute ? "w-full min-h-screen bg-gray-50" : "total"}>
      {!isAdminRoute && <Navbartop />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/language/:lang" element={<LanguageCourse />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/referral" element={<ReferralPortal />} />
        
        {/* Admin Login Routes */}
        <Route path="/payanaoverseas/payanaadmin/login" element={<AdminLogin />} />
        <Route path="/payanaoversas/payanaadmin/login" element={<AdminLogin />} />
        
        {/* Admin Dashboard Routes */}
        <Route path="/payanaoverseas/payanaadmin/dashboard" element={<AdminDashboard />} />
        <Route path="/payanaoversas/payanaadmin/dashboard" element={<AdminDashboard />} />

        {/* Profile Assessment Routes */}
        <Route path="/workprofile" element={<HomePage />} />
        <Route path="/work-profile" element={<HomePage />} />
        <Route path="/studyprofile" element={<HomePage />} />
        <Route path="/study-profile" element={<HomePage />} />
      </Routes>

      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <FooterBanner/>}
      {!isAdminRoute && <WhatsAppButton />}
    </div>
  )
}

export default App
