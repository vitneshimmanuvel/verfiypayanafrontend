import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUsers, FaNewspaper, FaComments, FaAdversal, FaCoins } from 'react-icons/fa';

import AdminLeads from './AdminLeads';
import NewsAdminPortal from './NewsAdminPortal';
import TestimonialAdminPortal from './TestimonialAdminPortal';
import AdAdminPortal from './AdAdminPortal';
import ReferralAdminPortal from './ReferralAdminPortal';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('leads');
  const navigate = useNavigate();

  // Secure route checkks
  useEffect(() => {
    const isAuth = sessionStorage.getItem('payana_admin_auth');
    if (isAuth !== 'true') {
      navigate('/payanaoverseas/payanaadmin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('payana_admin_auth');
    navigate('/payanaoverseas/payanaadmin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans relative">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm">
                  P
                </div>
                <span className="font-bold text-xl tracking-tight text-gray-900 hidden sm:block">Payana Admin</span>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-1 sm:items-center">
                <button
                  onClick={() => setActiveTab('leads')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'leads' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <FaUsers />
                  Leads
                </button>
                <button
                  onClick={() => setActiveTab('news')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'news' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <FaNewspaper />
                  News
                </button>
                <button
                  onClick={() => setActiveTab('testimonials')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'testimonials' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <FaComments />
                  Testimonials
                </button>
                <button
                  onClick={() => setActiveTab('ads')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'ads' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <FaAdversal />
                  Ads
                </button>
                <button
                  onClick={() => setActiveTab('referrals')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'referrals' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <FaCoins />
                  Referrals
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none transition-colors"
              >
                <FaSignOutAlt />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          <div className="sm:hidden flex overflow-x-auto py-3 space-x-2 no-scrollbar border-t border-gray-100">
             <button
                onClick={() => setActiveTab('leads')}
                className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeTab === 'leads' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <FaUsers size={12} />
                Leads
              </button>
              <button
                onClick={() => setActiveTab('news')}
                className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeTab === 'news' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <FaNewspaper size={12} />
                News
              </button>
              <button
                onClick={() => setActiveTab('testimonials')}
                className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeTab === 'testimonials' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <FaComments size={12} />
                Testimonials
              </button>
              <button
                onClick={() => setActiveTab('ads')}
                className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeTab === 'ads' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <FaAdversal size={12} />
                Ads
              </button>
              <button
                onClick={() => setActiveTab('referrals')}
                className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeTab === 'referrals' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <FaCoins size={12} />
                Referrals
              </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="w-full h-[calc(100vh-64px)] overflow-y-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'leads' && <AdminLeads />}
        {activeTab === 'news' && <NewsAdminPortal />}
        {activeTab === 'testimonials' && <TestimonialAdminPortal />}
        {activeTab === 'ads' && <AdAdminPortal />}
        {activeTab === 'referrals' && <ReferralAdminPortal />}
      </main>
    </div>
  );
};

export default AdminDashboard;
