import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminLeads = () => {
  const [studyLeads, setStudyLeads] = useState([]);
  const [workLeads, setWorkLeads] = useState([]);
  const [investLeads, setInvestLeads] = useState([]);
  const [langLeads, setLangLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('study');
  const [refreshInterval, setRefreshInterval] = useState(null);

  // Fetch all leads data
  const fetchLeads = async () => {
    try {
      setLoading(true);
      
      // Fetch study leads
      const studyRes = await fetch(`${API_URL}/admin/leads/study`);
      const studyData = await studyRes.json();
      
      // Fetch work leads
      const workRes = await fetch(`${API_URL}/admin/leads/work`);
      const workData = await workRes.json();
      
      // Fetch invest leads
      const investRes = await fetch(`${API_URL}/admin/leads/invest`);
      const investData = await investRes.json();

      // Fetch language leads
      const langRes = await fetch(`${API_URL}/admin/leads/language`);
      const langData = await langRes.json();

      setStudyLeads(studyData.success ? studyData.data : []);
      setWorkLeads(workData.success ? workData.data : []);
      setInvestLeads(investData.success ? investData.data : []);
      setLangLeads(langData.success ? langData.data : []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch leads data');
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    fetchLeads();
    
    const interval = setInterval(() => {
      fetchLeads();
    }, 30000);

    setRefreshInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  // Manual refresh
  const handleRefresh = () => {
    fetchLeads();
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Export to CSV
  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(val => 
        typeof val === 'string' && val.includes(',') ? `"${val}"` : val
      ).join(',')
    );
    
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading && studyLeads.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading leads data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Leads Dashboard</h1>
              <p className="text-gray-600 mt-1">Monitor all study, work, and investment leads</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition disabled:opacity-50"
            >
              <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Study Leads</p>
                  <p className="text-3xl font-bold">{studyLeads.length}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Work Leads</p>
                  <p className="text-3xl font-bold">{workLeads.length}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Investment Leads</p>
                  <p className="text-3xl font-bold">{investLeads.length}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm">Language Leads</p>
                  <p className="text-3xl font-bold">{langLeads.length}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('study')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition ${
                  activeTab === 'study'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Study Abroad ({studyLeads.length})
              </button>
              <button
                onClick={() => setActiveTab('work')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition ${
                  activeTab === 'work'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Work Abroad ({workLeads.length})
              </button>
              <button
                onClick={() => setActiveTab('invest')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition ${
                  activeTab === 'invest'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Investment ({investLeads.length})
              </button>
              <button
                onClick={() => setActiveTab('language')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition ${
                  activeTab === 'language'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Language Course ({langLeads.length})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {/* Study Leads Table */}
            {activeTab === 'study' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Study Abroad Leads</h2>
                  <button
                    onClick={() => exportToCSV(studyLeads, 'study_leads')}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export CSV
                  </button>
                </div>
                
                {studyLeads.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No study leads found</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qualification</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">CGPA</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Budget</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loan</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {studyLeads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">{lead.id}</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{lead.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{lead.email}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{lead.phone}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{lead.country}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{lead.qualification}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{lead.cgpa}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{lead.budget}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                lead.needs_loan ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {lead.needs_loan ? 'Yes' : 'No'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{formatDate(lead.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Work Leads Table */}
            {activeTab === 'work' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Work Abroad Leads</h2>
                  <button
                    onClick={() => exportToCSV(workLeads, 'work_leads')}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export CSV
                  </button>
                </div>

                {workLeads.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No work leads found</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Occupation</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Education</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {workLeads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">{lead.id}</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{lead.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{lead.email}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{lead.phone}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{lead.occupation}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{lead.education}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{lead.experience}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{formatDate(lead.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Investment Leads Table */}
            {activeTab === 'invest' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Investment Leads</h2>
                  <button
                    onClick={() => exportToCSV(investLeads, 'investment_leads')}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export CSV
                  </button>
                </div>

                {investLeads.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No investment leads found</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {investLeads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">{lead.id}</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{lead.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{lead.email}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{lead.country}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{formatDate(lead.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Language Leads Table */}
            {activeTab === 'language' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Language Class Leads</h2>
                  <button
                    onClick={() => exportToCSV(langLeads, 'language_leads')}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export CSV
                  </button>
                </div>

                {langLeads.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No language leads found</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Language</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {langLeads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">{lead.id}</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{lead.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{lead.email}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{lead.phone}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{lead.language}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{lead.level_finished || 'None'}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{lead.purpose}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{formatDate(lead.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLeads;
