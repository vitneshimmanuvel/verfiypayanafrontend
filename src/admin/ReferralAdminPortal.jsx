import React, { useState, useEffect } from 'react';
import { 
  FaCoins, FaCog, FaUsers, FaTrophy, FaSyncAlt, FaSearch, 
  FaUserFriends, FaEdit, FaSave, FaTimes, FaCheckCircle, FaTrash 
} from 'react-icons/fa';
import './ReferralAdminPortal.css';

const ReferralAdminPortal = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  // Tab control
  const [activeTab, setActiveTab] = useState('referrals'); // 'referrals', 'referrers', 'configs'

  // Data states
  const [referrals, setReferrals] = useState([]);
  const [referrers, setReferrers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [configs, setConfigs] = useState({
    points_per_referral: 10,
    points_on_conversion: 100,
    points_old_client_bonus: 50,
    cash_per_point: 10,
    points_on_registration: 20,
    points_on_login: 5
  });

  // Loading and search
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingConfigs, setUpdatingConfigs] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState(null); // Modal details view
  
  // Custom Question Modal State
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [qText, setQText] = useState('');
  const [qType, setQType] = useState('text');
  const [qPoints, setQPoints] = useState(10);
  const [qVerified, setQVerified] = useState(false);

  // Referrer User Management Modal State
  const [showReferrerModal, setShowReferrerModal] = useState(false);
  const [editingReferrer, setEditingReferrer] = useState(null);
  const [refName, setRefName] = useState('');
  const [refEmail, setRefEmail] = useState('');
  const [refPhone, setRefPhone] = useState('');
  const [refIsOldClient, setRefIsOldClient] = useState(false);
  const [refPoints, setRefPoints] = useState(0);

  // Inline edit state for points adjustment
  const [editingReferrerId, setEditingReferrerId] = useState(null);
  const [editingPointsValue, setEditingPointsValue] = useState(0);

  // Status update notes
  const [statusNotes, setStatusNotes] = useState('');
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchReferrals(),
        fetchReferrers(),
        fetchConfigs(),
        fetchQuestions()
      ]);
    } catch (err) {
      console.error('Error fetching admin referral data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await fetch(`${API_URL}/referral/questions`);
      const data = await res.json();
      if (data.success) {
        setQuestions(data.data);
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
    }
  };

  const fetchReferrals = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/referrals`);
      const data = await res.json();
      if (data.success) {
        setReferrals(data.data);
      }
    } catch (err) {
      console.error('Error fetching referrals:', err);
    }
  };

  const fetchReferrers = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/referrers`);
      const data = await res.json();
      if (data.success) {
        setReferrers(data.data);
      }
    } catch (err) {
      console.error('Error fetching referrers:', err);
    }
  };

  const fetchConfigs = async () => {
    try {
      const res = await fetch(`${API_URL}/referral/config`);
      const data = await res.json();
      if (data.success) {
        setConfigs(data.data);
      }
    } catch (err) {
      console.error('Error fetching configs:', err);
    }
  };

  const handleUpdateStatus = async (referralId, newStatus) => {
    setUpdatingStatusId(referralId);
    try {
      const res = await fetch(`${API_URL}/admin/referrals/${referralId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, notes: statusNotes })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        setSelectedReferral(null);
        await Promise.all([fetchReferrals(), fetchReferrers()]);
      } else {
        alert('Error: ' + data.message);
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    } finally {
      setUpdatingStatusId(null);
      setStatusNotes('');
    }
  };

  const handleAdjustPoints = async (referrerId) => {
    try {
      const res = await fetch(`${API_URL}/admin/referrers/${referrerId}/points`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points: Number(editingPointsValue) })
      });
      const data = await res.json();
      if (data.success) {
        alert('Points adjusted successfully!');
        setEditingReferrerId(null);
        fetchReferrers();
      } else {
        alert('Error: ' + data.message);
      }
    } catch (err) {
      console.error('Error adjusting points:', err);
      alert('Failed to adjust points');
    }
  };

  const handleSaveConfigs = async (e) => {
    e.preventDefault();
    setUpdatingConfigs(true);
    try {
      const res = await fetch(`${API_URL}/admin/referral/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ configs })
      });
      const data = await res.json();
      if (data.success) {
        alert('Configurations saved successfully!');
        fetchConfigs();
      } else {
        alert('Error: ' + data.message);
      }
    } catch (err) {
      console.error('Error saving configs:', err);
      alert('Failed to save configuration settings');
    } finally {
      setUpdatingConfigs(false);
    }
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    try {
      const url = editingQuestion 
        ? `${API_URL}/admin/questions/${editingQuestion.id}`
        : `${API_URL}/admin/questions`;
      const method = editingQuestion ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_text: qText,
          question_type: qType,
          points: Number(qPoints),
          verified_by_admin: qVerified
        })
      });
      
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        setShowQuestionModal(false);
        setEditingQuestion(null);
        setQText('');
        setQType('text');
        setQPoints(10);
        setQVerified(false);
        fetchQuestions();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error('Error saving question:', err);
      alert('Failed to save question');
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      const res = await fetch(`${API_URL}/admin/questions/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchQuestions();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error('Error deleting question:', err);
      alert('Failed to delete question');
    }
  };

  const handleVerifyAnswer = async (referralId, questionId, status) => {
    try {
      const res = await fetch(`${API_URL}/admin/referrals/${referralId}/verify-answer`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, status })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        
        // Match also referrer details in results (since API returns referral without joins, we merge)
        const match = data.data;
        const joinedMatch = {
          ...selectedReferral,
          questionnaire: match.questionnaire,
          points_awarded: match.points_awarded
        };
        setSelectedReferral(joinedMatch);
        
        // Refresh lists
        fetchReferrals();
        fetchReferrers();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error('Error verifying question answer:', err);
      alert('Failed to verify question answer');
    }
  };

  const handleSaveReferrer = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/admin/referrers/${editingReferrer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: refName,
          email: refEmail,
          phone: refPhone,
          is_old_client: refIsOldClient,
          points: Number(refPoints)
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        setShowReferrerModal(false);
        setEditingReferrer(null);
        fetchReferrers();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error('Error updating referrer details:', err);
      alert('Failed to save referrer details');
    }
  };

  const handleDeleteReferrer = async (id) => {
    if (!window.confirm('WARNING: Deleting this referrer will permanently delete all their referrals and points. Proceed?')) return;
    try {
      const res = await fetch(`${API_URL}/admin/referrers/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        setShowReferrerModal(false);
        setEditingReferrer(null);
        fetchReferrers();
        fetchReferrals();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error('Error deleting referrer:', err);
      alert('Failed to delete referrer');
    }
  };

  const handleConfigChange = (key, val) => {
    setConfigs(prev => ({
      ...prev,
      [key]: isNaN(val) ? val : Number(val)
    }));
  };

  // Filters
  const filteredReferrals = referrals.filter(ref => 
    ref.referred_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ref.referred_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ref.referrer_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredReferrers = referrers.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="ref-admin-loading">
        <FaSyncAlt className="ref-admin-loading-spinner" />
        <p className="ref-admin-loading-text">Loading Referral Portal Admin panel...</p>
      </div>
    );
  }

  return (
    <div className="ref-admin-container">
      {/* Portal Header */}
      <div className="ref-admin-header">
        <div>
          <h1 className="ref-admin-header-title">
            🤝 Referral &amp; Rewards Program
          </h1>
          <p className="ref-admin-header-desc">
            Configure rewards conversion ratios, adjust points, and approve candidate status.
          </p>
        </div>
        
        <button 
          onClick={fetchData}
          className="ref-admin-refresh-btn"
        >
          <FaSyncAlt /> Refresh Data
        </button>
      </div>

      {/* Tabs */}
      <div className="ref-admin-tabs">
        <button 
          onClick={() => { setActiveTab('referrals'); setSearchQuery(''); }}
          className={`ref-admin-tab-btn ${activeTab === 'referrals' ? 'active' : ''}`}
        >
          <FaUserFriends /> Referred Leads ({referrals.length})
        </button>

        <button 
          onClick={() => { setActiveTab('referrers'); setSearchQuery(''); }}
          className={`ref-admin-tab-btn ${activeTab === 'referrers' ? 'active' : ''}`}
        >
          <FaTrophy /> Leaderboard / Referrers ({referrers.length})
        </button>

        <button 
          onClick={() => { setActiveTab('configs'); }}
          className={`ref-admin-tab-btn ${activeTab === 'configs' ? 'active' : ''}`}
        >
          <FaCog /> Configuration Settings
        </button>
      </div>

      {/* SEARCH BAR (for referrals & referrers) */}
      {activeTab !== 'configs' && (
        <div className="ref-admin-search-wrapper">
          <span className="ref-admin-search-icon">
            <FaSearch size={14} />
          </span>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'referrals' ? "Search by friend name, email or referrer..." : "Search by referrer name or email..."}
            className="ref-admin-search-input"
          />
        </div>
      )}

      {/* REFERRALS TAB CONTENT */}
      {activeTab === 'referrals' && (
        <div className="ref-admin-table-card">
          <div className="ref-admin-table-responsive">
            <table className="ref-admin-table">
              <thead className="ref-admin-thead">
                <tr>
                  <th className="ref-admin-th">Candidate Details</th>
                  <th className="ref-admin-th">Referrer Detail</th>
                  <th className="ref-admin-th">Assess Pathway</th>
                  <th className="ref-admin-th">Date</th>
                  <th className="ref-admin-th">Awarded Points</th>
                  <th className="ref-admin-th">Status</th>
                  <th className="ref-admin-th">Actions</th>
                </tr>
              </thead>
              <tbody className="ref-admin-tbody">
                {filteredReferrals.map((ref) => {
                  const q = ref.questionnaire || {};
                  return (
                    <tr key={ref.id} className="ref-admin-tr">
                      <td className="ref-admin-td">
                        <p className="ref-admin-cell-name">{ref.referred_name}</p>
                        <p className="ref-admin-cell-sub">{ref.referred_email}</p>
                        <p className="ref-admin-cell-sub">{ref.referred_phone}</p>
                      </td>
                      <td className="ref-admin-td">
                        <p className="ref-admin-cell-name" style={{ fontWeight: '600' }}>{ref.referrer_name}</p>
                        <p className="ref-admin-cell-sub">{ref.referrer_email}</p>
                      </td>
                      <td className="ref-admin-td">
                        <span className="ref-admin-badge-preference">
                          {q.preference || 'study'}
                        </span>
                        <p className="ref-admin-cell-sub" style={{ marginTop: '4px' }}>To: {q.targetCountry || 'N/A'}</p>
                      </td>
                      <td className="ref-admin-td">
                        <span className="ref-admin-date-text">
                          {new Date(ref.created_at).toLocaleDateString(undefined, {
                            year: 'numeric', month: 'short', day: 'numeric'
                          })}
                        </span>
                      </td>
                      <td className="ref-admin-td">
                        <span className="ref-admin-points-display">
                          <FaCoins size={12} /> {ref.points_awarded} pts
                        </span>
                      </td>
                      <td className="ref-admin-td">
                        <span className={`ref-admin-badge-status ${ref.status}`}>
                          {ref.status}
                        </span>
                      </td>
                      <td className="ref-admin-td">
                        <button 
                          onClick={() => {
                            setSelectedReferral(ref);
                            setStatusNotes(ref.notes || '');
                          }}
                          className="ref-admin-btn-manage"
                        >
                          Manage Status
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredReferrals.length === 0 && (
            <div className="ref-admin-empty-state">
              No referred candidates match your search query.
            </div>
          )}
        </div>
      )}

      {/* REFERRERS TAB CONTENT */}
      {activeTab === 'referrers' && (
        <div className="ref-admin-table-card">
          <div className="ref-admin-table-responsive">
            <table className="ref-admin-table">
              <thead className="ref-admin-thead">
                <tr>
                  <th className="ref-admin-th">Rank</th>
                  <th className="ref-admin-th">Referrer Name</th>
                  <th className="ref-admin-th">Email / Phone</th>
                  <th className="ref-admin-th" style={{ textAlign: 'center' }}>Is Old Client</th>
                  <th className="ref-admin-th">Points Balance</th>
                  <th className="ref-admin-th">Payout Value</th>
                  <th className="ref-admin-th">Points Management</th>
                </tr>
              </thead>
              <tbody className="ref-admin-tbody">
                {filteredReferrers.map((ref, index) => (
                  <tr key={ref.id} className="ref-admin-tr">
                    <td className="ref-admin-td" style={{ fontWeight: 'bold' }}>
                      {index + 1 <= 3 ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#eab308' }}>
                          🏆 {index + 1}
                        </span>
                      ) : index + 1}
                    </td>
                    <td className="ref-admin-td" style={{ fontWeight: 'bold' }}>
                      {ref.name}
                    </td>
                    <td className="ref-admin-td">
                      <p style={{ margin: '0', color: '#334155' }}>{ref.email}</p>
                      <p className="ref-admin-cell-sub">{ref.phone}</p>
                    </td>
                    <td className="ref-admin-td" style={{ textAlign: 'center' }}>
                      <span className={`ref-admin-badge-client ${ref.is_old_client ? 'yes' : 'no'}`}>
                        {ref.is_old_client ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="ref-admin-td" style={{ fontWeight: '900', color: '#d97706' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FaCoins /> {ref.points}
                      </span>
                    </td>
                    <td className="ref-admin-td ref-admin-payout-display">
                      ₹{ref.points * configs.cash_per_point}
                    </td>
                    <td className="ref-admin-td">
                      <button 
                        onClick={() => {
                          setEditingReferrer(ref);
                          setRefName(ref.name);
                          setRefEmail(ref.email);
                          setRefPhone(ref.phone);
                          setRefIsOldClient(ref.is_old_client);
                          setRefPoints(ref.points);
                          setShowReferrerModal(true);
                        }}
                        className="ref-admin-btn-manage"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', fontSize: '12px' }}
                      >
                        <FaEdit size={10} /> Manage User
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredReferrers.length === 0 && (
            <div className="ref-admin-empty-state">
              No referrers match your search query.
            </div>
          )}
        </div>
      )}

      {/* CONFIGURATIONS TAB CONTENT */}
      {activeTab === 'configs' && (
        <div className="ref-admin-configs-container">
          <div className="ref-admin-configs-left">
            <form onSubmit={handleSaveConfigs} className="ref-admin-config-form">
            <h2 className="ref-admin-config-title">
              ⚙️ Point Configurations &amp; Multipliers
            </h2>

            <div className="ref-admin-config-grid">
              <div className="ref-admin-config-group">
                <label className="ref-admin-config-label">
                  Submission Point Reward
                </label>
                <input 
                  type="number"
                  value={configs.points_per_referral}
                  onChange={(e) => handleConfigChange('points_per_referral', e.target.value)}
                  min="0"
                  required
                  className="ref-admin-config-input"
                />
                <p className="ref-admin-config-help">Points awarded instantly when a referrer submits a friend's profile.</p>
              </div>

              <div className="ref-admin-config-group">
                <label className="ref-admin-config-label">
                  Conversion Point Bonus
                </label>
                <input 
                  type="number"
                  value={configs.points_on_conversion}
                  onChange={(e) => handleConfigChange('points_on_conversion', e.target.value)}
                  min="0"
                  required
                  className="ref-admin-config-input"
                />
                <p className="ref-admin-config-help">Bonus points awarded when admin tags referral status as "converted".</p>
              </div>

              <div className="ref-admin-config-group">
                <label className="ref-admin-config-label">
                  Old Client Bonus Points
                </label>
                <input 
                  type="number"
                  value={configs.points_old_client_bonus}
                  onChange={(e) => handleConfigChange('points_old_client_bonus', e.target.value)}
                  min="0"
                  required
                  className="ref-admin-config-input"
                />
                <p className="ref-admin-config-help">Initial registration points gifted to loyal past/existing clients.</p>
              </div>

              <div className="ref-admin-config-group">
                <label className="ref-admin-config-label">
                  Registration Reward Points
                </label>
                <input 
                  type="number"
                  value={configs.points_on_registration || 0}
                  onChange={(e) => handleConfigChange('points_on_registration', e.target.value)}
                  min="0"
                  required
                  className="ref-admin-config-input"
                />
                <p className="ref-admin-config-help">Points awarded immediately when any referrer signs up/creates an account.</p>
              </div>

              <div className="ref-admin-config-group">
                <label className="ref-admin-config-label">
                  Login Reward Points
                </label>
                <input 
                  type="number"
                  value={configs.points_on_login || 0}
                  onChange={(e) => handleConfigChange('points_on_login', e.target.value)}
                  min="0"
                  required
                  className="ref-admin-config-input"
                />
                <p className="ref-admin-config-help">Points awarded to referrers every time they log in to the portal.</p>
              </div>

              <div className="ref-admin-config-group">
                <label className="ref-admin-config-label">
                  Cash Value Per Point (Rupees)
                </label>
                <input 
                  type="number"
                  value={configs.cash_per_point}
                  onChange={(e) => handleConfigChange('cash_per_point', e.target.value)}
                  min="1"
                  required
                  className="ref-admin-config-input"
                />
                <p className="ref-admin-config-help">Conversion rate: 1 Point = X Rupees. Payout calculations use this rate.</p>
              </div>

              <div className="ref-admin-config-group">
                <label className="ref-admin-config-label">
                  Calculator Default Submissions
                </label>
                <input 
                  type="number"
                  value={configs.calc_default_submissions !== undefined ? configs.calc_default_submissions : 5}
                  onChange={(e) => handleConfigChange('calc_default_submissions', e.target.value)}
                  min="1"
                  required
                  className="ref-admin-config-input"
                />
                <p className="ref-admin-config-help">Initial submissions slider value for estimating payout.</p>
              </div>

              <div className="ref-admin-config-group">
                <label className="ref-admin-config-label">
                  Calculator Default Conversions
                </label>
                <input 
                  type="number"
                  value={configs.calc_default_conversions !== undefined ? configs.calc_default_conversions : 2}
                  onChange={(e) => handleConfigChange('calc_default_conversions', e.target.value)}
                  min="0"
                  required
                  className="ref-admin-config-input"
                />
                <p className="ref-admin-config-help">Initial converted clients slider value for estimating payout.</p>
              </div>

              <div className="ref-admin-config-group">
                <label className="ref-admin-config-label">
                  Calculator Header Title
                </label>
                <input 
                  type="text"
                  value={configs.calc_title || 'Reward Calculator'}
                  onChange={(e) => handleConfigChange('calc_title', e.target.value)}
                  required
                  className="ref-admin-config-input"
                />
                <p className="ref-admin-config-help">Title text displayed on top of the Reward Calculator card.</p>
              </div>

              <div className="ref-admin-config-group">
                <label className="ref-admin-config-label">
                  Calculator Description Text
                </label>
                <textarea 
                  value={configs.calc_description || 'Estimate your earnings based on referral configurations.'}
                  onChange={(e) => handleConfigChange('calc_description', e.target.value)}
                  required
                  rows="3"
                  className="ref-admin-textarea"
                  style={{ minHeight: '38px', paddingTop: '8px' }}
                />
                <p className="ref-admin-config-help">Brief instructions displayed below the calculator title.</p>
              </div>
            </div>

            <div className="ref-admin-config-footer">
              <button 
                type="submit"
                disabled={updatingConfigs}
                className="ref-admin-submit-btn"
              >
                {updatingConfigs ? 'Saving...' : 'Save Configurations'}
              </button>
            </div>
          </form>
        </div>

          {/* Dynamic Questions Manager */}
          <div className="ref-admin-questions-manager" style={{ marginTop: '30px', padding: '20px', borderRadius: '12px', border: '1px solid rgba(0, 0, 0, 0.08)', backgroundColor: '#fff', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>
                📝 Dynamic Assessment Questions
              </h3>
              <button 
                type="button"
                onClick={() => {
                  setEditingQuestion(null);
                  setQText('');
                  setQType('text');
                  setQPoints(10);
                  setQVerified(false);
                  setShowQuestionModal(true);
                }}
                className="ref-admin-submit-btn"
                style={{ padding: '6px 14px', fontSize: '12px', margin: 0 }}
              >
                + Add New Question
              </button>
            </div>

            <div className="ref-admin-table-responsive">
              <table className="ref-admin-table">
                <thead className="ref-admin-thead">
                  <tr>
                    <th className="ref-admin-th">Question Text</th>
                    <th className="ref-admin-th">Input Type</th>
                    <th className="ref-admin-th" style={{ textAlign: 'center' }}>Points Value</th>
                    <th className="ref-admin-th" style={{ textAlign: 'center' }}>Admin Verification</th>
                    <th className="ref-admin-th" style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody className="ref-admin-tbody">
                  {questions.map((q) => (
                    <tr key={q.id} className="ref-admin-tr">
                      <td className="ref-admin-td" style={{ fontWeight: '600', color: '#0f172a' }}>
                        {q.question_text}
                      </td>
                      <td className="ref-admin-td" style={{ textTransform: 'capitalize' }}>
                        {q.question_type === 'boolean' ? 'Yes / No' : q.question_type}
                      </td>
                      <td className="ref-admin-td" style={{ textAlign: 'center', fontWeight: 'bold', color: '#b45309' }}>
                        {q.points} pts
                      </td>
                      <td className="ref-admin-td" style={{ textAlign: 'center' }}>
                        <span className={`ref-admin-badge-client ${q.verified_by_admin ? 'yes' : 'no'}`}>
                          {q.verified_by_admin ? 'Required' : 'None'}
                        </span>
                      </td>
                      <td className="ref-admin-td" style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button 
                            onClick={() => {
                              setEditingQuestion(q);
                              setQText(q.question_text);
                              setQType(q.question_type);
                              setQPoints(q.points);
                              setQVerified(q.verified_by_admin);
                              setShowQuestionModal(true);
                            }}
                            className="ref-admin-adjust-points-btn"
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                          >
                            <FaEdit size={10} /> Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="ref-admin-inline-cancel-btn"
                            style={{ padding: '4px 8px', fontSize: '11px', color: '#dc2626', backgroundColor: '#fee2e2', borderRadius: '4px' }}
                          >
                            <FaTrash size={10} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {questions.length === 0 && (
                    <tr>
                      <td colSpan="5" className="ref-admin-empty-state">
                        No questions defined. Add a question to start customizing the questionnaire.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED MANAGE STATUS MODAL */}
      {selectedReferral && (
        <div className="ref-admin-modal-overlay">
          <div className="ref-admin-modal-card">
            <div className="ref-admin-modal-header">
              <h3 className="ref-admin-modal-title">
                Manage Referral: {selectedReferral.referred_name}
              </h3>
              <button 
                onClick={() => setSelectedReferral(null)}
                className="ref-admin-modal-close"
              >
                <FaTimes size={18} />
              </button>
            </div>

            <div className="ref-admin-modal-body">
              {/* Questionnaire Details Display */}
              <div className="ref-admin-questionnaire-card">
                <h4 className="ref-admin-questionnaire-title">Client Assessment Questionnaire</h4>
                
                {(() => {
                  let qList = [];
                  let isOldStyle = false;
                  try {
                    qList = typeof selectedReferral.questionnaire === 'string' ? JSON.parse(selectedReferral.questionnaire) : selectedReferral.questionnaire;
                    if (!Array.isArray(qList)) {
                      isOldStyle = true;
                    }
                  } catch (e) {
                    isOldStyle = true;
                  }

                  if (isOldStyle) {
                    return (
                      <div className="ref-admin-questionnaire-grid">
                        <p className="ref-admin-questionnaire-item">
                          <span className="ref-admin-questionnaire-label">Interest Pathway:</span>{' '}
                          <span className="ref-admin-questionnaire-val uppercase">{qList.preference || 'study'}</span>
                        </p>
                        <p className="ref-admin-questionnaire-item">
                          <span className="ref-admin-questionnaire-label">Target Destination:</span>{' '}
                          <span className="ref-admin-questionnaire-val">{qList.targetCountry || 'N/A'}</span>
                        </p>
                        <p className="ref-admin-questionnaire-item">
                          <span className="ref-admin-questionnaire-label">Budget Range:</span>{' '}
                          <span className="ref-admin-questionnaire-val">{qList.budget || 'N/A'}</span>
                        </p>
                        <p className="ref-admin-questionnaire-item">
                          <span className="ref-admin-questionnaire-label">Language Readiness:</span>{' '}
                          <span className="ref-admin-questionnaire-val">{qList.examReady || 'N/A'}</span>
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="ref-admin-dynamic-qlist" style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left', padding: '10px 0' }}>
                      {qList.map((item) => (
                        <div key={item.questionId} className="ref-admin-dynamic-qitem" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', color: '#475569', fontWeight: 'bold' }}>{item.questionText}</span>
                            <span style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', color: '#b45309', fontWeight: 'bold' }}>
                              <FaCoins size={10} /> {item.points} pts
                            </span>
                          </div>
                          <p style={{ margin: '6px 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                            {item.answer || 'N/A'}
                          </p>
                          {item.verifiedByAdmin ? (
                            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                              <span style={{ 
                                fontSize: '10px', 
                                padding: '2px 8px', 
                                borderRadius: '4px', 
                                fontWeight: 'bold',
                                backgroundColor: item.status === 'verified' ? '#d1fae5' : item.status === 'rejected' ? '#fee2e2' : '#ffedd5',
                                color: item.status === 'verified' ? '#065f46' : item.status === 'rejected' ? '#991b1b' : '#9a3412'
                              }}>
                                Status: {item.status === 'verified' ? 'Verified' : item.status === 'rejected' ? 'Rejected' : 'Pending Verification'}
                              </span>
                              {item.status === 'pending' && (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <button
                                    onClick={() => handleVerifyAnswer(selectedReferral.id, item.questionId, 'verified')}
                                    style={{ fontSize: '11px', backgroundColor: '#10b981', color: '#fff', padding: '4px 10px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                                  >
                                    Verify &amp; Approve
                                  </button>
                                  <button
                                    onClick={() => handleVerifyAnswer(selectedReferral.id, item.questionId, 'rejected')}
                                    style={{ fontSize: '11px', backgroundColor: '#ef4444', color: '#fff', padding: '4px 10px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold', backgroundColor: '#e0f2fe', color: '#0369a1' }}>
                              Status: Instantly Verified
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {selectedReferral.questionnaire?.additionalNotes && (
                  <div className="ref-admin-questionnaire-notes-block">
                    <p className="ref-admin-questionnaire-notes-title">Additional Remarks from Referrer:</p>
                    <p className="ref-admin-questionnaire-notes-text">
                      "{selectedReferral.questionnaire?.additionalNotes || 'None'}"
                    </p>
                  </div>
                )}
              </div>

              {/* Status Update Form */}
              <div className="ref-admin-remarks-group">
                <label className="ref-admin-config-label" style={{ fontSize: '10px' }}>
                  Add Internal Remarks / Follow-up Notes
                </label>
                <textarea 
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="e.g. Emailed candidate. Booked initial meeting."
                  rows="3"
                  className="ref-admin-textarea"
                />
              </div>

              {/* Action Buttons */}
              <div className="ref-admin-modal-footer">
                <button
                  onClick={() => handleUpdateStatus(selectedReferral.id, 'pending')}
                  disabled={updatingStatusId !== null}
                  className="ref-admin-btn-pending"
                >
                  Mark Pending
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedReferral.id, 'rejected')}
                  disabled={updatingStatusId !== null}
                  className="ref-admin-btn-rejected"
                >
                  Mark Rejected
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedReferral.id, 'converted')}
                  disabled={updatingStatusId !== null}
                  className="ref-admin-btn-converted"
                >
                  <FaCheckCircle /> Mark Converted Client (+{configs.points_on_conversion} pts)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT QUESTION MODAL */}
      {showQuestionModal && (
        <div className="ref-admin-modal-overlay">
          <div className="ref-admin-modal-card" style={{ maxWidth: '500px' }}>
            <div className="ref-admin-modal-header">
              <h3 className="ref-admin-modal-title">
                {editingQuestion ? 'Edit Question' : 'Add New Question'}
              </h3>
              <button 
                onClick={() => { setShowQuestionModal(false); setEditingQuestion(null); }}
                className="ref-admin-modal-close"
              >
                <FaTimes size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="ref-admin-modal-body" style={{ textAlign: 'left' }}>
              <div className="ref-admin-config-group" style={{ marginBottom: '16px' }}>
                <label className="ref-admin-config-label">Question Text *</label>
                <input 
                  type="text"
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  placeholder="e.g. When do they plan to travel?"
                  required
                  className="ref-admin-config-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div className="ref-admin-config-group" style={{ marginBottom: '16px' }}>
                <label className="ref-admin-config-label">Input Type *</label>
                <select 
                  value={qType}
                  onChange={(e) => setQType(e.target.value)}
                  className="ref-admin-config-input"
                  style={{ width: '100%', height: '40px' }}
                >
                  <option value="text">Text Input</option>
                  <option value="number">Number Only</option>
                  <option value="date">Date Input</option>
                  <option value="boolean">Yes / No Option</option>
                </select>
              </div>

              <div className="ref-admin-config-group" style={{ marginBottom: '16px' }}>
                <label className="ref-admin-config-label">Points Awarded *</label>
                <input 
                  type="number"
                  value={qPoints}
                  onChange={(e) => setQPoints(e.target.value)}
                  min="0"
                  required
                  className="ref-admin-config-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div className="checkbox-wrapper" style={{ margin: '20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="checkbox"
                  id="verified-check"
                  checked={qVerified}
                  onChange={(e) => setQVerified(e.target.checked)}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <label htmlFor="verified-check" style={{ fontSize: '13px', color: '#334155', fontWeight: '600', cursor: 'pointer' }}>
                  Requires Admin Verification (Points placed on hold)
                </label>
              </div>

              <div className="ref-admin-modal-footer" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '15px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => { setShowQuestionModal(false); setEditingQuestion(null); }}
                  className="ref-admin-inline-cancel-btn"
                  style={{ padding: '8px 16px', borderRadius: '6px', fontSize: '13px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ref-admin-submit-btn"
                  style={{ padding: '8px 16px', borderRadius: '6px', fontSize: '13px', margin: 0 }}
                >
                  {editingQuestion ? 'Save Changes' : 'Create Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT REFERRER MODAL */}
      {showReferrerModal && editingReferrer && (
        <div className="ref-admin-modal-overlay">
          <div className="ref-admin-modal-card" style={{ maxWidth: '500px' }}>
            <div className="ref-admin-modal-header">
              <h3 className="ref-admin-modal-title">
                Manage Referrer Account: {editingReferrer.name}
              </h3>
              <button 
                onClick={() => { setShowReferrerModal(false); setEditingReferrer(null); }}
                className="ref-admin-modal-close"
              >
                <FaTimes size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveReferrer} className="ref-admin-modal-body" style={{ textAlign: 'left' }}>
              <div className="ref-admin-config-group" style={{ marginBottom: '14px' }}>
                <label className="ref-admin-config-label">Referrer Full Name *</label>
                <input 
                  type="text"
                  value={refName}
                  onChange={(e) => setRefName(e.target.value)}
                  required
                  className="ref-admin-config-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div className="ref-admin-config-group" style={{ marginBottom: '14px' }}>
                <label className="ref-admin-config-label">Email Address *</label>
                <input 
                  type="email"
                  value={refEmail}
                  onChange={(e) => setRefEmail(e.target.value)}
                  required
                  className="ref-admin-config-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div className="ref-admin-config-group" style={{ marginBottom: '14px' }}>
                <label className="ref-admin-config-label">Phone Number *</label>
                <input 
                  type="text"
                  value={refPhone}
                  onChange={(e) => setRefPhone(e.target.value)}
                  required
                  className="ref-admin-config-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div className="ref-admin-config-group" style={{ marginBottom: '14px' }}>
                <label className="ref-admin-config-label">Points Balance *</label>
                <input 
                  type="number"
                  value={refPoints}
                  onChange={(e) => setRefPoints(e.target.value)}
                  required
                  className="ref-admin-config-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div className="checkbox-wrapper" style={{ margin: '14px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="checkbox"
                  id="ref-client-check"
                  checked={refIsOldClient}
                  onChange={(e) => setRefIsOldClient(e.target.checked)}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <label htmlFor="ref-client-check" style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: '600', cursor: 'pointer' }}>
                  Is Old/Existing Client of Payana
                </label>
              </div>

              <div className="ref-admin-modal-footer" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => handleDeleteReferrer(editingReferrer.id)}
                  className="ref-admin-inline-cancel-btn"
                  style={{ padding: '8px 16px', borderRadius: '6px', fontSize: '13px', color: '#fff', backgroundColor: '#dc2626', border: 'none' }}
                >
                  Delete Referrer Profile
                </button>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => { setShowReferrerModal(false); setEditingReferrer(null); }}
                    className="ref-admin-inline-cancel-btn"
                    style={{ padding: '8px 16px', borderRadius: '6px', fontSize: '13px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ref-admin-submit-btn"
                    style={{ padding: '8px 16px', borderRadius: '6px', fontSize: '13px', margin: 0 }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralAdminPortal;
