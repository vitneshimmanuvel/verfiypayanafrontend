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
  const [configs, setConfigs] = useState({
    points_per_referral: 10,
    points_on_conversion: 100,
    points_old_client_bonus: 50,
    cash_per_point: 10
  });

  // Loading and search
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingConfigs, setUpdatingConfigs] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState(null); // Modal details view
  
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
        fetchConfigs()
      ]);
    } catch (err) {
      console.error('Error fetching admin referral data:', err);
    } finally {
      setLoading(false);
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
                      {editingReferrerId === ref.id ? (
                        <div className="ref-admin-inline-edit">
                          <input 
                            type="number"
                            value={editingPointsValue}
                            onChange={(e) => setEditingPointsValue(e.target.value)}
                            className="ref-admin-inline-edit-input"
                          />
                          <button 
                            onClick={() => handleAdjustPoints(ref.id)}
                            className="ref-admin-inline-save-btn"
                            title="Save"
                          >
                            <FaSave size={12} />
                          </button>
                          <button 
                            onClick={() => setEditingReferrerId(null)}
                            className="ref-admin-inline-cancel-btn"
                            title="Cancel"
                          >
                            <FaTimes size={12} />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => {
                            setEditingReferrerId(ref.id);
                            setEditingPointsValue(ref.points);
                          }}
                          className="ref-admin-adjust-points-btn"
                        >
                          <FaEdit size={10} /> Adjust Points
                        </button>
                      )}
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
                
                <div className="ref-admin-questionnaire-grid">
                  <p className="ref-admin-questionnaire-item">
                    <span className="ref-admin-questionnaire-label">Interest Pathway:</span>{' '}
                    <span className="ref-admin-questionnaire-val uppercase">{selectedReferral.questionnaire?.preference || 'study'}</span>
                  </p>
                  <p className="ref-admin-questionnaire-item">
                    <span className="ref-admin-questionnaire-label">Target Destination:</span>{' '}
                    <span className="ref-admin-questionnaire-val">{selectedReferral.questionnaire?.targetCountry || 'N/A'}</span>
                  </p>
                  <p className="ref-admin-questionnaire-item">
                    <span className="ref-admin-questionnaire-label">Budget Range:</span>{' '}
                    <span className="ref-admin-questionnaire-val">{selectedReferral.questionnaire?.budget || 'N/A'}</span>
                  </p>
                  <p className="ref-admin-questionnaire-item">
                    <span className="ref-admin-questionnaire-label">Language Readiness:</span>{' '}
                    <span className="ref-admin-questionnaire-val">{selectedReferral.questionnaire?.examReady || 'N/A'}</span>
                  </p>
                </div>
                
                <div className="ref-admin-questionnaire-notes-block">
                  <p className="ref-admin-questionnaire-notes-title">Additional Remarks from Referrer:</p>
                  <p className="ref-admin-questionnaire-notes-text">
                    "{selectedReferral.questionnaire?.additionalNotes || 'None'}"
                  </p>
                </div>
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
    </div>
  );
};

export default ReferralAdminPortal;
