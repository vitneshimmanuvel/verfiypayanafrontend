import React, { useState, useEffect } from 'react';
import { 
  FaCoins, FaHandHoldingUsd, FaUserFriends, FaArrowRight, FaArrowLeft, 
  FaCheckCircle, FaSpinner, FaSignOutAlt, FaGlobe, FaAward, FaTrophy, 
  FaChevronRight, FaLock, FaUser, FaEnvelope, FaPhone, FaArrowAltCircleUp 
} from 'react-icons/fa';
import './ReferralPortal.css';

const ReferralPortal = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const isConfigEnabled = (val) => val === undefined || val === 'true' || val === 1 || val === true || val === '1';
  
  // Auth state
  const [referrer, setReferrer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Auth Form Inputs
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [isOldClient, setIsOldClient] = useState(false);
  const [authError, setAuthError] = useState('');

  // Referral portal data
  const [profileData, setProfileData] = useState({ profile: null, referrals: [] });
  const [configs, setConfigs] = useState({
    points_per_referral: 10,
    points_on_conversion: 100,
    points_old_client_bonus: 50,
    cash_per_point: 10,
    points_on_registration: 20,
    points_on_login: 5,
    calc_default_submissions: 5,
    calc_default_conversions: 2,
    calc_title: 'Reward Calculator',
    calc_description: 'Estimate your earnings based on referral configurations.'
  });

  // Calculator state
  const [calcSubmissions, setCalcSubmissions] = useState(5);
  const [calcConversions, setCalcConversions] = useState(2);

  // Questionnaire form state
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [questionnaireStep, setQuestionnaireStep] = useState(1);
  const [submittingReferral, setSubmittingReferral] = useState(false);
  const [referralSuccess, setReferralSuccess] = useState(false);
  const [celebrationPoints, setCelebrationPoints] = useState(0);

  // Questionnaire Inputs
  const [refFriendName, setRefFriendName] = useState('');
  const [refFriendEmail, setRefFriendEmail] = useState('');
  const [refFriendPhone, setRefFriendPhone] = useState('');
  const [refRelationship, setRefRelationship] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [questionnaireError, setQuestionnaireError] = useState('');

  // Dynamic Questions states
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // { [questionId]: value }
  const [expandedReferralId, setExpandedReferralId] = useState(null);

  // Profile questionnaire & step states
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' or 'profile'
  const [regStep, setRegStep] = useState(1); // 1: basic info, 2: questionnaire
  const [regAnswers, setRegAnswers] = useState({});
  const [profileAnswers, setProfileAnswers] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileErrorMsg, setProfileErrorMsg] = useState('');

  // Load configs on mount
  useEffect(() => {
    fetchConfigs();
    fetchQuestions();
    // Check if user is logged in
    const storedReferrer = localStorage.getItem('payana_referrer_profile');
    if (storedReferrer) {
      const parsed = JSON.parse(storedReferrer);
      setReferrer(parsed);
      fetchProfile(parsed.email);
    }
  }, []);

  // Synchronize calculator slider defaults when configs load
  useEffect(() => {
    if (configs) {
      if (configs.calc_default_submissions !== undefined) {
        setCalcSubmissions(Number(configs.calc_default_submissions));
      }
      if (configs.calc_default_conversions !== undefined) {
        setCalcConversions(Number(configs.calc_default_conversions));
      }
    }
  }, [configs]);

  // Sync profileAnswers with loaded profile's questionnaire
  useEffect(() => {
    if (profileData && profileData.profile) {
      let qList = [];
      try {
        qList = typeof profileData.profile.questionnaire === 'string' 
          ? JSON.parse(profileData.profile.questionnaire) 
          : (profileData.profile.questionnaire || []);
      } catch (e) {
        qList = [];
      }
      
      const answersMap = {};
      if (Array.isArray(qList)) {
        qList.forEach(item => {
          answersMap[item.questionId] = item.answer;
        });
      }
      
      // Merge with active questions (handling newly added questions)
      questions.forEach(q => {
        if (answersMap[q.id] === undefined) {
          answersMap[q.id] = q.question_type === 'boolean' ? 'No' : '';
        }
      });

      setProfileAnswers(answersMap);
    }
  }, [profileData, questions]);

  const fetchConfigs = async () => {
    try {
      const res = await fetch(`${API_URL}/referral/config`);
      const data = await res.json();
      if (data.success) {
        setConfigs(data.data);
      }
    } catch (err) {
      console.error('Error fetching config:', err);
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await fetch(`${API_URL}/referral/questions`);
      const data = await res.json();
      if (data.success) {
        setQuestions(data.data);
        const initialAnswers = {};
        const initialRegAnswers = {};
        data.data.forEach(q => {
          if (q.question_type === 'boolean') {
            initialAnswers[q.id] = 'No';
            initialRegAnswers[q.id] = 'No';
          } else {
            initialAnswers[q.id] = '';
            initialRegAnswers[q.id] = '';
          }
        });
        setAnswers(initialAnswers);
        setRegAnswers(initialRegAnswers);
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
    }
  };

  const fetchProfile = async (email) => {
    try {
      const res = await fetch(`${API_URL}/referrer/profile/${email}`);
      const data = await res.json();
      if (data.success) {
        setProfileData(data.data);
        // Sync local storage in case points changed
        localStorage.setItem('payana_referrer_profile', JSON.stringify(data.data.profile));
        setReferrer(data.data.profile);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const handleRegistrationNext = (e) => {
    e.preventDefault();
    const needName = true;
    const needEmail = isConfigEnabled(configs.reg_enable_email);
    const needPhone = isConfigEnabled(configs.reg_enable_phone);

    if (
      (needName && !authName) ||
      (needEmail && !authEmail) ||
      (needPhone && !authPhone)
    ) {
      setAuthError('Please fill out all visible fields.');
      return;
    }

    setAuthError('');

    const regQuestions = questions.filter(q => q.show_in_register);
    if (regQuestions.length === 0) {
      // Direct registration
      handleAuthSubmit(null, true);
    } else {
      setRegStep(2);
    }
  };

  const handleAuthSubmit = async (e, skipQuestionnaire = false) => {
    if (e) e.preventDefault();
    setAuthError('');
    setLoading(true);

    const needEmail = isConfigEnabled(configs.reg_enable_email);
    const needPhone = isConfigEnabled(configs.reg_enable_phone);
    const needOldClient = isConfigEnabled(configs.reg_enable_old_client);

    const cleanEmail = needEmail ? authEmail.trim().toLowerCase() : `${(authPhone || 'user').trim()}@payana.com`;
    const cleanPhone = needPhone ? authPhone.trim() : '0000000000';

    try {
      const endpoint = authMode === 'login' ? '/referrer/login' : '/referrer/register';
      let body;
      
      if (authMode === 'login') {
        body = { email: cleanEmail, phone: cleanPhone };
      } else {
        const regQuestions = questions.filter(q => q.show_in_register);
        const questionnairePayload = (skipQuestionnaire || regQuestions.length === 0)
          ? regQuestions.map(q => ({
              questionId: q.id,
              questionText: q.question_text,
              questionType: q.question_type,
              answer: '',
              points: q.points,
              verifiedByAdmin: q.verified_by_admin
            }))
          : regQuestions.map(q => ({
              questionId: q.id,
              questionText: q.question_text,
              questionType: q.question_type,
              answer: String(regAnswers[q.id] !== undefined ? regAnswers[q.id] : ''),
              points: q.points,
              verifiedByAdmin: q.verified_by_admin
            }));

        body = { 
          name: authName, 
          email: cleanEmail, 
          phone: cleanPhone, 
          isOldClient: needOldClient ? isOldClient : false,
          questionnaire: questionnairePayload
        };
      }

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        localStorage.setItem('payana_referrer_profile', JSON.stringify(data.data));
        setReferrer(data.data);
        fetchProfile(data.data.email);
        setShowAuthModal(false);
        // Reset inputs
        setAuthName('');
        setAuthEmail('');
        setAuthPhone('');
        setIsOldClient(false);
        setRegStep(1);
      } else {
        setAuthError(data.message || 'Authentication failed. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      setAuthError('Network error. Please try again later.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('payana_referrer_profile');
    setReferrer(null);
    setProfileData({ profile: null, referrals: [] });
    setActiveTab('dashboard');
  };

  const handleProfileUpdateSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccessMsg('');
    setProfileErrorMsg('');

    const questionnairePayload = questions.map(q => ({
      questionId: q.id,
      questionText: q.question_text,
      questionType: q.question_type,
      answer: String(profileAnswers[q.id] !== undefined ? profileAnswers[q.id] : ''),
      points: q.points,
      verifiedByAdmin: q.verified_by_admin
    }));

    try {
      const res = await fetch(`${API_URL}/referrer/profile/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: referrer.email,
          questionnaire: questionnairePayload
        })
      });

      const data = await res.json();
      setSavingProfile(false);

      if (data.success) {
        setProfileSuccessMsg('Profile assessment updated successfully!');
        fetchProfile(referrer.email);
        setTimeout(() => setProfileSuccessMsg(''), 4000);
      } else {
        setProfileErrorMsg(data.message || 'Failed to update profile.');
      }
    } catch (err) {
      setSavingProfile(false);
      setProfileErrorMsg('Network error. Please try again.');
    }
  };

  const handleReferralSubmit = async (e) => {
    e.preventDefault();
    setQuestionnaireError('');

    const needEmail = isConfigEnabled(configs.reg_enable_email);
    const needPhone = isConfigEnabled(configs.reg_enable_phone);

    if (!referrer) {
      if (!guestName || (needPhone && !guestPhone) || (needEmail && !guestEmail)) {
        setQuestionnaireError('Please fill out all visible referrer details');
        return;
      }
    }
    if (!refFriendName || (needEmail && !refFriendEmail) || !refFriendPhone || !refRelationship) {
      setQuestionnaireError('Please fill out all visible referral details and relationship');
      return;
    }

    setSubmittingReferral(true);

    const leadQuestions = questions.filter(q => q.show_in_referral !== false);
    const questionnairePayload = leadQuestions.map(q => ({
      questionId: q.id,
      questionText: q.question_text,
      questionType: q.question_type,
      answer: String(answers[q.id] !== undefined ? answers[q.id] : ''),
      points: q.points,
      verifiedByAdmin: q.verified_by_admin
    }));

    try {
      const res = await fetch(`${API_URL}/referrer/submit-referral`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referrerId: referrer ? referrer.id : null,
          referrerName: referrer ? null : guestName,
          referrerPhone: referrer ? null : guestPhone,
          referrerEmail: referrer ? null : guestEmail,
          referredName: refFriendName,
          referredEmail: needEmail ? refFriendEmail : `referred-${refFriendPhone.trim()}@payana.com`,
          referredPhone: refFriendPhone,
          relationship: refRelationship,
          questionnaire: questionnairePayload
        })
      });

      const data = await res.json();
      setSubmittingReferral(false);

      if (data.success) {
        // Calculate immediate points awarded
        let immediatePoints = Number(configs.points_per_referral) || 0;
        leadQuestions.forEach(q => {
          if (!q.verified_by_admin) {
            immediatePoints += Number(q.points) || 0;
          }
        });

        setCelebrationPoints(immediatePoints);
        setReferralSuccess(true);
        if (referrer) {
          fetchProfile(referrer.email);
        }
        
        // Reset questionnaire inputs
        setRefFriendName('');
        setRefFriendEmail('');
        setRefFriendPhone('');
        setRefRelationship('');
        setGuestName('');
        setGuestEmail('');
        setGuestPhone('');
        
        const resetAnswers = {};
        questions.forEach(q => {
          if (q.question_type === 'boolean') resetAnswers[q.id] = 'No';
          else resetAnswers[q.id] = '';
        });
        setAnswers(resetAnswers);
        setQuestionnaireStep(1);
      } else {
        setQuestionnaireError(data.message || 'Error submitting referral. Please try again.');
      }
    } catch (err) {
      setSubmittingReferral(false);
      setQuestionnaireError('Network error. Please try again later.');
    }
  };

  const renderReferralsTable = (referralsList) => {
    if (referralsList.length === 0) {
      return (
        <div className="empty-state" style={{ padding: '20px', minHeight: 'auto' }}>
          <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>No submissions in this category.</p>
        </div>
      );
    }

    return (
      <div className="table-responsive" style={{ marginBottom: '20px' }}>
        <table className="referral-table">
          <thead>
            <tr className="table-header-row">
              <th>Friend Details</th>
              <th>Interest Profile</th>
              <th>Points Received</th>
              <th>Status</th>
              <th>Admin Remarks</th>
            </tr>
          </thead>
          <tbody>
            {referralsList.map((ref) => {
              let qList = [];
              let isOldStyle = false;
              try {
                qList = typeof ref.questionnaire === 'string' ? JSON.parse(ref.questionnaire) : ref.questionnaire;
                if (!Array.isArray(qList)) {
                  isOldStyle = true;
                }
              } catch (e) {
                isOldStyle = true;
              }

              return (
                <React.Fragment key={ref.id}>
                  <tr className="table-body-row">
                    <td>
                      <p className="referred-name">{ref.referred_name}</p>
                      <p className="referred-email">{ref.referred_email}</p>
                      <p className="referred-phone">{ref.referred_phone}</p>
                    </td>
                    <td>
                      {isOldStyle ? (
                        <div className="referred-interest-cell">
                          <p><span className="cell-label">Pathway:</span> <span className="font-semibold text-gradient uppercase">{qList.preference || 'N/A'}</span></p>
                          <p><span className="cell-label">Destination:</span> <span className="font-semibold">{qList.targetCountry || 'N/A'}</span></p>
                          <p><span className="cell-label">Budget:</span> <span className="font-semibold">{qList.budget || 'N/A'}</span></p>
                        </div>
                      ) : (
                        <div className="referred-interest-cell">
                          {Array.isArray(qList) && qList.slice(0, 2).map((item, idx) => (
                            <p key={idx}>
                              <span className="cell-label">{item.questionText}:</span>{' '}
                              <span className="font-semibold">{item.answer}</span>
                            </p>
                          ))}
                          {Array.isArray(qList) && qList.length > 2 && (
                            <button 
                              onClick={() => setExpandedReferralId(expandedReferralId === ref.id ? null : ref.id)}
                              className="text-xs font-medium underline mt-1"
                              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#a5b4fc' }}
                            >
                              {expandedReferralId === ref.id ? 'Hide Details' : `View All ${qList.length} Answers`}
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="points-awarded">
                        <FaCoins size={12} /> {ref.points_awarded || 0} pts
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge status-${ref.status}`} data-label="Status">
                        {ref.status}
                      </span>
                    </td>
                    <td className="remarks-cell">
                      {ref.notes || 'No notes yet'}
                    </td>
                  </tr>
                  {!isOldStyle && expandedReferralId === ref.id && (
                    <tr className="table-expanded-row" style={{ backgroundColor: 'rgba(30, 41, 59, 0.4)' }}>
                      <td colSpan={5} style={{ padding: '15px 20px' }}>
                        <div className="expanded-answers-container" style={{ textAlign: 'left' }}>
                          <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#f8fafc', fontWeight: 'bold' }}>Questionnaire Breakdown</h4>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
                            {qList.map((item, idx) => (
                              <div key={idx} style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#94a3b8' }}>{item.questionText}</p>
                                <p style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '600', color: '#f1f5f9' }}>{item.answer}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ 
                                    fontSize: '10px', 
                                    padding: '2px 6px', 
                                    borderRadius: '4px', 
                                    fontWeight: 'bold',
                                    backgroundColor: item.status === 'verified' ? 'rgba(16, 185, 129, 0.15)' : item.status === 'rejected' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(249, 115, 22, 0.15)', 
                                    color: item.status === 'verified' ? '#34d399' : item.status === 'rejected' ? '#f87171' : '#fb923c' 
                                  }}>
                                    {item.status === 'verified' ? 'Verified' : item.status === 'rejected' ? 'Rejected' : 'Pending Verification'}
                                  </span>
                                  <span style={{ fontSize: '11px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <FaCoins size={10} /> {item.points} pts
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  // Dynamic earnings calculations
  const totalCalcPoints = (calcSubmissions * configs.points_per_referral) + (calcConversions * configs.points_on_conversion);
  const totalCalcEarnings = totalCalcPoints * configs.cash_per_point;

  return (
    <div className="referral-page">
      {/* Background Glows */}
      <div className="glow glow-1"></div>
      <div className="glow glow-2"></div>

      {/* Main container */}
      <div className="referral-container">
        
        {/* Header Section */}
        <header className="referral-header">
          <div>
            <span className="badge-premium badge-indigo">Payana Rewards Program</span>
            <h1 className="referral-title">
              Refer &amp; <span className="text-gradient">Earn Cash</span>
            </h1>
            <p className="referral-subtitle">
              Introduce your friends to their dream career or studies abroad and get rewarded with points converted directly into real money!
            </p>
          </div>
          
          <div className="referral-header-actions">
            {referrer ? (
              <div className="referrer-info-card">
                <div className="referrer-info-text">
                  <p className="referrer-label">Logged in as</p>
                  <p className="referrer-name">{referrer.name}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="btn-logout"
                  title="Logout"
                >
                  <FaSignOutAlt size={18} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                className="btn-primary"
              >
                Access Portal Dashboard
              </button>
            )}
          </div>
        </header>
        {/* Dashboard View (Logged In) */}
        {referrer ? (
          <div className="referrer-dashboard animate-fade-in">
            {/* Tabs Navigation */}
            <div className="dashboard-tabs" style={{ display: 'flex', gap: '15px', marginBottom: '25px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '10px' }}>
              <button 
                onClick={() => setActiveTab('dashboard')} 
                className={`tab-btn ${activeTab === 'dashboard' ? 'active-tab' : ''}`}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeTab === 'dashboard' ? '#6366f1' : '#94a3b8',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  padding: '8px 16px',
                  borderBottom: activeTab === 'dashboard' ? '3px solid #6366f1' : '3px solid transparent',
                  transition: 'all 0.3s ease'
                }}
              >
                📊 Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('profile')} 
                className={`tab-btn ${activeTab === 'profile' ? 'active-tab' : ''}`}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeTab === 'profile' ? '#6366f1' : '#94a3b8',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  padding: '8px 16px',
                  borderBottom: activeTab === 'profile' ? '3px solid #6366f1' : '3px solid transparent',
                  transition: 'all 0.3s ease'
                }}
              >
                👤 My Profile Assessment
              </button>
            </div>

            {activeTab === 'dashboard' && (
              <>
                {/* Referrer Stats */}
                <section className="referrer-stats-grid">
                  <div className="stat-card glass-premium">
                <div className="stat-icon-wrapper stat-icon-points">
                  <FaCoins size={24} />
                </div>
                <div>
                  <h3 className="stat-label">Points Balance</h3>
                  <p className="stat-value">
                    {profileData.profile?.points || 0}
                  </p>
                  <p className="stat-help-text text-yellow">
                    {configs.points_per_referral} points per submission
                  </p>
                </div>
              </div>

              <div className="stat-card glass-premium">
                <div className="stat-icon-wrapper stat-icon-points" style={{ background: 'rgba(249, 115, 22, 0.1)', color: '#f97316' }}>
                  <FaCoins size={24} />
                </div>
                <div>
                  <h3 className="stat-label">Points On Hold</h3>
                  <p className="stat-value" style={{ color: '#f97316' }}>
                    {profileData.profile?.points_on_hold || 0}
                  </p>
                  <p className="stat-help-text">
                    Pending verification
                  </p>
                </div>
              </div>

              <div className="stat-card glass-premium">
                <div className="stat-icon-wrapper stat-icon-earnings">
                  <FaHandHoldingUsd size={24} />
                </div>
                <div>
                  <h3 className="stat-label">Total Earnings</h3>
                  <p className="stat-value text-emerald">
                    ₹{(profileData.profile?.points || 0) * configs.cash_per_point}
                  </p>
                  <p className="stat-help-text">
                    1 Point = ₹{configs.cash_per_point} Cash
                  </p>
                </div>
              </div>

              <div className="stat-card glass-premium">
                <div className="stat-icon-wrapper stat-icon-friends">
                  <FaUserFriends size={24} />
                </div>
                <div>
                  <h3 className="stat-label">Friends Referred</h3>
                  <p className="stat-value">
                    {profileData.referrals?.length || 0}
                  </p>
                  <p className="stat-help-text">
                    Active leads under assessment
                  </p>
                </div>
              </div>

              <div className="stat-card glass-premium">
                <div className="stat-icon-wrapper stat-icon-converted">
                  <FaCheckCircle size={24} />
                </div>
                <div>
                  <h3 className="stat-label">Converted Clients</h3>
                  <p className="stat-value">
                    {profileData.referrals?.filter(r => r.status === 'converted').length || 0}
                  </p>
                  <p className="stat-help-text text-cyan">
                    +{configs.points_on_conversion} point bonus each!
                  </p>
                </div>
              </div>
            </section>

            {/* Refer Call to Action */}
            <div className="referral-cta-card">
              <div>
                <span className="badge-premium badge-indigo">Invite Friends</span>
                <h2 className="cta-title">Ready to refer another friend?</h2>
                <p className="cta-subtitle">
                  Complete our interactive assessment questionnaire about your friend to earn immediately.
                </p>
              </div>
              <button 
                onClick={() => { setShowQuestionnaire(true); setReferralSuccess(false); }}
                className="btn-accent btn-cta"
              >
                Submit New Referral <FaChevronRight size={14} />
              </button>
            </div>

            {/* Referrals List Table */}
            <section className="referral-list-section glass-premium">
              <h2 className="section-title">Your Referred Submissions</h2>
              
              {profileData.referrals?.length > 0 ? (
                <>
                  <h3 style={{ fontSize: '15px', color: '#a5b4fc', fontWeight: 'bold', margin: '25px 0 15px 0', display: 'flex', alignItems: 'center', gap: '6px', textAlign: 'left' }}>
                    ⏳ Referrals in Progress ({profileData.referrals.filter(ref => ref.status === 'pending').length})
                  </h3>
                  {renderReferralsTable(profileData.referrals.filter(ref => ref.status === 'pending'))}

                  <h3 style={{ fontSize: '15px', color: '#34d399', fontWeight: 'bold', margin: '30px 0 15px 0', display: 'flex', alignItems: 'center', gap: '6px', textAlign: 'left' }}>
                    ✅ Completed Referrals ({profileData.referrals.filter(ref => ref.status !== 'pending').length})
                  </h3>
                  {renderReferralsTable(profileData.referrals.filter(ref => ref.status !== 'pending'))}
                </>
              ) : (
                <div className="empty-state">
                  <p>You haven't referred anyone yet.</p>
                  <button 
                    onClick={() => { setShowQuestionnaire(true); setReferralSuccess(false); }}
                    className="empty-state-link"
                  >
                    Submit your first referral now!
                  </button>
                </div>
              )}
            </section>
          </>)}

          {activeTab === 'profile' && (
            <section className="profile-assessment-section glass-premium animate-fade-in" style={{ textAlign: 'left', padding: '25px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', color: '#f8fafc', margin: '0 0 5px 0' }}>👤 My Profile Assessment</h2>
                <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
                  Keep your profile information accurate to help us customize your experience. Correct or update your assessment answers below.
                </p>
              </div>

              {profileSuccessMsg && (
                <div className="form-success-message" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '12px', borderRadius: '8px', marginBottom: '15px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  {profileSuccessMsg}
                </div>
              )}

              {profileErrorMsg && (
                <div className="form-error-message" style={{ padding: '12px', borderRadius: '8px', marginBottom: '15px' }}>
                  {profileErrorMsg}
                </div>
              )}

              <form onSubmit={handleProfileUpdateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '15px' }}>
                  {questions.filter(q => q.show_in_register).map((q) => {
                    // Check if this was a "not imported" (newly added) question
                    let isNewQuestion = true;
                    if (profileData.profile && profileData.profile.questionnaire) {
                      let parsedQ = [];
                      try {
                        parsedQ = typeof profileData.profile.questionnaire === 'string'
                          ? JSON.parse(profileData.profile.questionnaire)
                          : profileData.profile.questionnaire;
                      } catch (e) {}
                      if (Array.isArray(parsedQ)) {
                        isNewQuestion = !parsedQ.some(item => item.questionId === q.id);
                      }
                    }

                    return (
                      <div key={q.id} style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', padding: '15px', borderRadius: '12px', border: isNewQuestion ? '1px dashed rgba(99, 102, 241, 0.6)' : '1px solid rgba(255, 255, 255, 0.05)', position: 'relative' }}>
                        {isNewQuestion && (
                          <span style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                            🆕 New Question
                          </span>
                        )}
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px', paddingRight: isNewQuestion ? '80px' : '0' }}>{q.question_text}</label>
                        {q.question_type === 'boolean' ? (
                          <select 
                            value={profileAnswers[q.id] || 'No'} 
                            onChange={(e) => setProfileAnswers({ ...profileAnswers, [q.id]: e.target.value })}
                            className="input-premium"
                            style={{ width: '100%', padding: '10px', backgroundColor: 'rgba(15, 23, 42, 0.8)' }}
                          >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        ) : q.question_type === 'text_long' ? (
                          <textarea 
                            value={profileAnswers[q.id] || ''} 
                            onChange={(e) => setProfileAnswers({ ...profileAnswers, [q.id]: e.target.value })}
                            placeholder="Type details..."
                            className="input-premium"
                            rows="3"
                            style={{ width: '100%', padding: '10px', backgroundColor: 'rgba(15, 23, 42, 0.8)' }}
                          />
                        ) : (
                          <input 
                            type="text" 
                            value={profileAnswers[q.id] || ''} 
                            onChange={(e) => setProfileAnswers({ ...profileAnswers, [q.id]: e.target.value })}
                            placeholder="Type answer..."
                            className="input-premium"
                            style={{ width: '100%', padding: '10px', backgroundColor: 'rgba(15, 23, 42, 0.8)' }}
                          />
                        )}
                      </div>
                    );
                  })}

                  {questions.filter(q => q.show_in_register).length === 0 && (
                    <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#94a3b8', padding: '20px' }}>
                      No profile questions defined by administrators.
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button 
                    type="submit" 
                    disabled={savingProfile || questions.filter(q => q.show_in_register).length === 0}
                    className="btn-accent"
                    style={{ padding: '12px 24px', fontSize: '15px' }}
                  >
                    {savingProfile ? <FaSpinner className="animate-spin" /> : 'Save Profile Corrections'}
                  </button>
                </div>
              </form>
            </section>
          )}
        </div>
        ) : (
          <div className="referral-landing-screen animate-fade-in">
            
            {/* Hero Split Card */}
            <section className="referral-hero-grid">
              {/* Marketing Pitch */}
              <div className="referral-hero-left glass-card">
                <div className="watermark-icon" style={{ opacity: 0.04 }}>
                  <FaCoins size={200} />
                </div>
                <div>
                  <span className="badge-premium badge-green">Fast &amp; Automated</span>
                  <h2 className="hero-card-title">
                    Introduce Friends &amp; Convert Points to <span className="text-gradient">Real Rupees</span>
                  </h2>
                  <p className="hero-card-description">
                    Do you have friends, peers, or family members looking to study in Canada, work in Germany, invest abroad, or complete language preparation courses? 
                  </p>
                  <p className="hero-card-description">
                    Refer them by filling out our smart client assessment questionnaire. You receive points immediately for your submission. Once they convert to our premium client, you receive an extra massive conversion bonus!
                  </p>

                  <div className="configs-overview-grid">
                    <div>
                      <p className="overview-value text-yellow">₹{configs.cash_per_point}</p>
                      <p className="overview-label">Value Per Point</p>
                    </div>
                    <div>
                      <p className="overview-value">+{configs.points_per_referral} pts</p>
                      <p className="overview-label">For Referring</p>
                    </div>
                    <div>
                      <p className="overview-value">+{configs.points_on_conversion} pts</p>
                      <p className="overview-label">On Client Success</p>
                    </div>
                  </div>
                </div>

                <div className="hero-actions-container" style={{ flexWrap: 'wrap', gap: '10px' }}>
                  <button 
                    onClick={() => { setAuthMode('register'); setShowAuthModal(true); }}
                    className="btn-accent btn-large"
                  >
                    Create Referrer Account
                  </button>
                  <button 
                    onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                    className="btn-secondary btn-large"
                  >
                    Log In
                  </button>
                  <button 
                    onClick={() => {
                      setGuestName('');
                      setGuestEmail('');
                      setGuestPhone('');
                      setRefFriendName('');
                      setRefFriendEmail('');
                      setRefFriendPhone('');
                      setQuestionnaireStep(1);
                      setReferralSuccess(false);
                      setShowQuestionnaire(true);
                    }}
                    className="btn-secondary btn-large"
                    style={{ border: '1px dashed #6366f1', color: '#a5b4fc', backgroundColor: 'rgba(99, 102, 241, 0.05)' }}
                  >
                    ⚡ Quick Referral
                  </button>
                </div>
              </div>

              {/* Reward Calculator */}
              <div className="referral-hero-right glass-card">
                <div>
                  <h3 className="calc-card-title">
                    <FaTrophy className="text-yellow-400" /> {configs.calc_title || 'Reward Calculator'}
                  </h3>
                  <p className="calc-card-subtitle">{configs.calc_description || 'Estimate your earnings based on referral configurations.'}</p>
                  
                  {/* Slider 1 */}
                  <div className="calc-input-group">
                    <div className="calc-labels">
                      <span>Friends Referred:</span>
                      <span className="calc-value">{calcSubmissions}</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="30" 
                      value={calcSubmissions} 
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setCalcSubmissions(val);
                        if (calcConversions > val) setCalcConversions(val);
                      }}
                      className="range-submissions" 
                    />
                  </div>

                  {/* Slider 2 */}
                  <div className="calc-input-group">
                    <div className="calc-labels">
                      <span>Converted Clients:</span>
                      <span className="calc-value text-emerald">{calcConversions}</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max={calcSubmissions} 
                      value={calcConversions} 
                      onChange={(e) => setCalcConversions(parseInt(e.target.value))}
                      className="range-conversions" 
                    />
                  </div>
                </div>

                {/* Calculation Outputs */}
                <div className="calc-outputs-divider">
                  <div className="calc-outputs-container">
                    <div>
                      <p className="overview-label">Accumulated Points</p>
                      <p className="output-value text-yellow">
                        <FaCoins size={22} /> {totalCalcPoints}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="overview-label">Real Money Reward</p>
                      <p className="output-value text-emerald highlight-text">
                        ₹{totalCalcEarnings.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Loyalty Notice */}
                  <div className="calc-bonus-card">
                    ⭐ Are you our old/existing client? Register to get a <span className="font-bold text-yellow-400">+{configs.points_old_client_bonus} points bonus</span> instantly!
                  </div>
                </div>
              </div>
            </section>

            {/* How It Works Timeline */}
            <section className="referral-guide-section glass-premium">
              <div className="guide-header">
                <span className="badge-premium badge-indigo">Quick Guide</span>
                <h3 className="guide-title">How Payana Referrals Work</h3>
                <p className="guide-subtitle">Follow these simple steps to claim your payouts.</p>
              </div>

              <div className="guide-grid">
                {/* Steps */}
                <div className="guide-step-item">
                  <div className="guide-step-number">1</div>
                  <h4 className="guide-step-title">Create Account</h4>
                  <p className="guide-step-desc">Sign up with your Name, Email, and Phone number instantly. No password required.</p>
                </div>

                <div className="guide-step-item">
                  <div className="guide-step-number">2</div>
                  <h4 className="guide-step-title">Submit Referral</h4>
                  <p className="guide-step-desc">Fill out details about their target country, education, and language goals.</p>
                </div>

                <div className="guide-step-item">
                  <div className="guide-step-number">3</div>
                  <h4 className="guide-step-title">Earn Base Points</h4>
                  <p className="guide-step-desc">Get {configs.points_per_referral} points immediately in your account for every questionnaire filled.</p>
                </div>

                <div className="guide-step-item">
                  <div className="guide-step-number">4</div>
                  <h4 className="guide-step-title">Collect Cash</h4>
                  <p className="guide-step-desc">When they enroll, earn {configs.points_on_conversion} points. Claim payouts directly in cash (1 Pt = ₹{configs.cash_per_point}).</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Auth Modal (Login/Register) */}
        {showAuthModal && (
          <div className="modal-overlay">
            <div className="modal-card auth-modal glass-premium animate-scale-up">
              
              {/* Close */}
              <button 
                onClick={() => setShowAuthModal(false)}
                className="modal-close-btn"
              >
                &times;
              </button>

              <div className="modal-header">
                <span className="modal-icon-wrapper">
                  <FaLock size={24} />
                </span>
                <h3 className="modal-title">
                  {authMode === 'login' ? 'Portal Log In' : regStep === 1 ? 'Register Referrer' : 'Profile Assessment'}
                </h3>
                <p className="modal-subtitle">
                  {authMode === 'login' 
                    ? 'Enter email and phone matching registration' 
                    : regStep === 1 
                      ? 'Become a referrer and start earning points'
                      : 'Please tell us a bit about yourself (Step 2 of 2)'
                  }
                </p>
              </div>

              {authError && (
                <div className="form-error-message">
                  {authError}
                </div>
              )}

              <form onSubmit={authMode === 'login' ? handleAuthSubmit : (regStep === 1 ? handleRegistrationNext : handleAuthSubmit)} className="form-fields">
                {authMode === 'register' && regStep === 1 && (
                  <div className="input-group animate-fade-in">
                    <label className="input-label">Your Name</label>
                    <div className="input-wrapper">
                      <span className="input-icon">
                        <FaUser size={14} />
                      </span>
                      <input 
                        type="text" 
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        placeholder="John Doe"
                        required
                        className="input-premium has-icon"
                      />
                    </div>
                  </div>
                )}

                {regStep === 1 && (
                  <>
                    {isConfigEnabled(configs.reg_enable_email) && (
                      <div className="input-group animate-fade-in">
                        <label className="input-label">Email Address</label>
                        <div className="input-wrapper">
                          <span className="input-icon">
                            <FaEnvelope size={14} />
                          </span>
                          <input 
                            type="email" 
                            value={authEmail}
                            onChange={(e) => setAuthEmail(e.target.value)}
                            placeholder="johndoe@example.com"
                            required
                            className="input-premium has-icon"
                          />
                        </div>
                      </div>
                    )}

                    {isConfigEnabled(configs.reg_enable_phone) && (
                      <div className="input-group animate-fade-in">
                        <label className="input-label">Phone Number</label>
                        <div className="input-wrapper">
                          <span className="input-icon">
                            <FaPhone size={14} />
                          </span>
                          <input 
                            type="tel" 
                            value={authPhone}
                            onChange={(e) => setAuthPhone(e.target.value)}
                            placeholder="e.g. 9876543210"
                            required
                            className="input-premium has-icon"
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}

                {authMode === 'register' && regStep === 1 && isConfigEnabled(configs.reg_enable_old_client) && (
                  <div className="checkbox-wrapper animate-fade-in">
                    <input 
                      type="checkbox"
                      id="old-client"
                      checked={isOldClient}
                      onChange={(e) => setIsOldClient(e.target.checked)}
                      className="checkbox-input"
                    />
                    <label htmlFor="old-client" className="checkbox-label">
                      I am an existing/old client of Payana Overseas Solutions (+{configs.points_old_client_bonus} pts bonus)
                    </label>
                  </div>
                )}

                {authMode === 'register' && regStep === 2 && (
                  <div className="reg-questionnaire-step animate-fade-in" style={{ maxHeight: '280px', overflowY: 'auto', paddingRight: '5px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 5px 0' }}>
                      Please answer these profile assessment questions about yourself to help us understand your study/work interest (Optional):
                    </p>
                    {questions.filter(q => q.show_in_register).map((q) => (
                      <div key={q.id} className="input-group" style={{ margin: 0 }}>
                        <label className="input-label" style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '4px' }}>{q.question_text}</label>
                        {q.question_type === 'boolean' ? (
                          <select 
                            value={regAnswers[q.id] || 'No'} 
                            onChange={(e) => setRegAnswers({ ...regAnswers, [q.id]: e.target.value })}
                            className="input-premium"
                            style={{ width: '100%', padding: '8px 12px', fontSize: '14px' }}
                          >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        ) : q.question_type === 'text_long' ? (
                          <textarea 
                            value={regAnswers[q.id] || ''} 
                            onChange={(e) => setRegAnswers({ ...regAnswers, [q.id]: e.target.value })}
                            placeholder="Type details..."
                            className="input-premium"
                            rows="2"
                            style={{ width: '100%', padding: '8px 12px', fontSize: '14px' }}
                          />
                        ) : (
                          <input 
                            type="text" 
                            value={regAnswers[q.id] || ''} 
                            onChange={(e) => setRegAnswers({ ...regAnswers, [q.id]: e.target.value })}
                            placeholder="Type answer..."
                            className="input-premium"
                            style={{ width: '100%', padding: '8px 12px', fontSize: '14px' }}
                          />
                        )}
                      </div>
                    ))}
                    {questions.filter(q => q.show_in_register).length === 0 && (
                      <p style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center' }}>No setup questions available.</p>
                    )}
                  </div>
                )}

                {authMode === 'register' && regStep === 2 ? (
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button 
                      type="button"
                      onClick={() => handleAuthSubmit(null, true)}
                      disabled={loading}
                      className="btn-primary"
                      style={{ flex: 1, padding: '12px', fontSize: '14px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      Skip &amp; Start
                    </button>
                    <button 
                      type="submit"
                      disabled={loading}
                      className="btn-accent"
                      style={{ flex: 1, padding: '12px', fontSize: '14px' }}
                    >
                      {loading ? <FaSpinner className="animate-spin" /> : 'Register &amp; Start'}
                    </button>
                  </div>
                ) : (
                  <button 
                    type="submit"
                    disabled={loading}
                    className="btn-accent btn-full"
                  >
                    {loading ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      authMode === 'login' ? 'Access Portal' : 'Continue to Assessment →'
                    )}
                  </button>
                )}
              </form>

              <div className="modal-footer">
                {authMode === 'login' ? (
                  <p>
                    Don't have an account?{' '}
                    <button 
                      onClick={() => { setAuthMode('register'); setRegStep(1); setAuthError(''); }}
                      className="empty-state-link"
                    >
                      Sign Up Here
                    </button>
                  </p>
                ) : (
                  <p>
                    Already registered?{' '}
                    <button 
                      onClick={() => { setAuthMode('login'); setRegStep(1); setAuthError(''); }}
                      className="empty-state-link"
                    >
                      Log In Here
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Questionnaire Modal (Multi-Step Form) */}
        {showQuestionnaire && (
          <div className="modal-overlay">
            <div className="modal-card questionnaire-modal glass-premium animate-scale-up">
              
              {/* Close */}
              {!submittingReferral && !referralSuccess && (
                <button 
                  onClick={() => setShowQuestionnaire(false)}
                  className="modal-close-btn"
                >
                  &times;
                </button>
              )}

              {referralSuccess ? (
                /* Success celebration view */
                <div className="celebration-view animate-scale-up">
                  <div className="congrats-icon-container">
                    <FaCheckCircle className="congrats-icon" size={72} />
                  </div>
                  
                  <h3>Successfully Submitted!</h3>
                  <p>
                    Your referral's inquiry has been saved and the admin has been notified.
                  </p>

                  <div className="points-celebration-card">
                    <p className="points-celebration-label">Points Awarded</p>
                    <p className="points-celebration-value">
                      <FaCoins size={32} /> +{celebrationPoints}
                    </p>
                    <p className="points-celebration-cash">
                      Equivalent to ₹{celebrationPoints * configs.cash_per_point} Real Cash Reward!
                    </p>
                  </div>

                  <div>
                    <button 
                      onClick={() => setShowQuestionnaire(false)}
                      className="btn-accent btn-cta"
                    >
                      Back to Dashboard
                    </button>
                  </div>
                </div>
              ) : (
                /* Interactive Step-by-Step form */
                <div>
                  {/* Step Indicators */}
                  {(() => {
                    const leadQuestions = questions.filter(q => q.show_in_referral !== false);
                    const totalSteps = leadQuestions.length === 0 ? 1 : 2;
                    return (
                      <div className="step-indicator-wrapper">
                        <div>
                          <span className="badge-premium badge-indigo">Step {questionnaireStep} of {totalSteps}</span>
                          <h3 className="modal-title" style={{ marginTop: '0.25rem' }}>
                            {questionnaireStep === 1 && "Referral Contact Information"}
                            {questionnaireStep === 2 && "Assessment Questionnaire"}
                          </h3>
                        </div>
                        
                        <div className="step-indicator-bars">
                          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                            <div 
                              key={step} 
                              className={`step-indicator-bar ${
                                step === questionnaireStep ? 'active' : step < questionnaireStep ? 'completed' : ''
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {questionnaireError && (
                    <div className="form-error-message">
                      {questionnaireError}
                    </div>
                  )}

                  <form onSubmit={handleReferralSubmit} className="form-fields">
                    
                    {/* STEP 1: Basic details */}
                    {questionnaireStep === 1 && (
                      <div className="step-form-grid animate-slide-up">
                        {!referrer && (
                          <>
                            <div style={{ gridColumn: '1 / -1', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '8px', marginBottom: '10px' }}>
                              <h4 style={{ margin: 0, fontSize: '14px', color: '#818cf8', fontWeight: 'bold' }}>👤 Your Details (Referrer)</h4>
                            </div>
                            <div className="input-group span-2-columns">
                              <label className="input-label">Your Full Name *</label>
                              <input 
                                type="text"
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                                placeholder="e.g. John Doe"
                                required={!referrer}
                                className="input-premium"
                              />
                            </div>
                            
                            {isConfigEnabled(configs.reg_enable_phone) && (
                              <div className="input-group span-2-columns">
                                <label className="input-label">Your Phone Number *</label>
                                <input 
                                  type="tel"
                                  value={guestPhone}
                                  onChange={(e) => setGuestPhone(e.target.value)}
                                  placeholder="e.g. 9876543210"
                                  required={!referrer && isConfigEnabled(configs.reg_enable_phone)}
                                  className="input-premium"
                                />
                              </div>
                            )}

                            {isConfigEnabled(configs.reg_enable_email) && (
                              <div className="input-group span-2-columns">
                                <label className="input-label">Your Email Address *</label>
                                <input 
                                  type="email"
                                  value={guestEmail}
                                  onChange={(e) => setGuestEmail(e.target.value)}
                                  placeholder="e.g. johndoe@example.com"
                                  required={!referrer && isConfigEnabled(configs.reg_enable_email)}
                                  className="input-premium"
                                />
                              </div>
                            )}

                            <div style={{ gridColumn: '1 / -1', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '8px', margin: '15px 0 10px 0' }}>
                              <h4 style={{ margin: 0, fontSize: '14px', color: '#34d399', fontWeight: 'bold' }}>🤝 Referral's Details</h4>
                            </div>
                          </>
                        )}

                        <div className="input-group span-2-columns">
                          <label className="input-label">Referral's Full Name *</label>
                          <input 
                            type="text"
                            value={refFriendName}
                            onChange={(e) => setRefFriendName(e.target.value)}
                            placeholder="e.g. Jane Smith"
                            required
                            className="input-premium"
                          />
                        </div>
                        
                        {isConfigEnabled(configs.reg_enable_email) && (
                          <div className="input-group span-2-columns">
                            <label className="input-label">Referral's Email Address *</label>
                            <input 
                              type="email"
                              value={refFriendEmail}
                              onChange={(e) => setRefFriendEmail(e.target.value)}
                              placeholder="e.g. janesmith@example.com"
                              required={isConfigEnabled(configs.reg_enable_email)}
                              className="input-premium"
                            />
                          </div>
                        )}

                        <div className="input-group span-2-columns">
                          <label className="input-label">Referral's Phone Number *</label>
                          <input 
                            type="tel"
                            value={refFriendPhone}
                            onChange={(e) => setRefFriendPhone(e.target.value)}
                            placeholder="e.g. 9876500000"
                            required
                            className="input-premium"
                          />
                        </div>

                        <div className="input-group span-2-columns">
                          <label className="input-label">Relationship to you *</label>
                          <input 
                            type="text"
                            value={refRelationship}
                            onChange={(e) => setRefRelationship(e.target.value)}
                            placeholder="e.g. Brother, Colleague, Friend"
                            required
                            className="input-premium"
                          />
                        </div>
                      </div>
                    )}

                    {/* STEP 2: Dynamic Questions */}
                    {questionnaireStep === 2 && (
                      <div className="step-form-grid animate-slide-up" style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '5px' }}>
                        {questions.filter(q => q.show_in_referral !== false).map((q) => (
                          <div key={q.id} className="input-group span-2-columns" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                            <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                              <span>{q.question_text} *</span>
                              <span style={{ 
                                fontSize: '10px', 
                                padding: '2px 6px', 
                                borderRadius: '4px', 
                                fontWeight: 'bold',
                                backgroundColor: q.verified_by_admin ? 'rgba(249, 115, 22, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                color: q.verified_by_admin ? '#fb923c' : '#34d399'
                              }}>
                                {q.verified_by_admin ? `Admin Verified (${q.points} pts - Hold)` : `Instant (${q.points} pts)`}
                              </span>
                            </label>
                            
                            {q.question_type === 'text' && (
                              <input 
                                type="text"
                                value={answers[q.id] || ''}
                                onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                                placeholder="Enter answer details"
                                className="input-premium"
                                required
                              />
                            )}
                            
                            {q.question_type === 'number' && (
                              <input 
                                type="number"
                                value={answers[q.id] || ''}
                                onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                                placeholder="Enter number value"
                                className="input-premium"
                                required
                              />
                            )}
                            
                            {q.question_type === 'date' && (
                              <input 
                                type="date"
                                value={answers[q.id] || ''}
                                onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                                className="input-premium"
                                required
                              />
                            )}
                            
                            {q.question_type === 'boolean' && (
                              <div style={{ display: 'flex', gap: '24px', marginTop: '6px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#cbd5e1' }}>
                                  <input 
                                    type="radio"
                                    name={`q-${q.id}`}
                                    value="Yes"
                                    checked={answers[q.id] === 'Yes'}
                                    onChange={() => setAnswers({ ...answers, [q.id]: 'Yes' })}
                                    style={{ accentColor: '#6366f1' }}
                                  /> Yes
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#cbd5e1' }}>
                                  <input 
                                    type="radio"
                                    name={`q-${q.id}`}
                                    value="No"
                                    checked={answers[q.id] === 'No'}
                                    onChange={() => setAnswers({ ...answers, [q.id]: 'No' })}
                                    style={{ accentColor: '#6366f1' }}
                                  /> No
                                </label>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="step-navigation-buttons" style={{ marginTop: '20px' }}>
                      {questionnaireStep > 1 ? (
                        <button
                          type="button"
                          onClick={() => setQuestionnaireStep(prev => prev - 1)}
                          className="btn-secondary"
                        >
                          <FaArrowLeft size={12} /> Back
                        </button>
                      ) : (
                        <div />
                      )}

                      {(() => {
                        const leadQuestions = questions.filter(q => q.show_in_referral !== false);
                        const totalSteps = leadQuestions.length === 0 ? 1 : 2;
                        const needEmail = isConfigEnabled(configs.reg_enable_email);
                        const needPhone = isConfigEnabled(configs.reg_enable_phone);
                        
                        if (questionnaireStep < totalSteps) {
                          return (
                            <button
                              type="button"
                              onClick={() => {
                                if (questionnaireStep === 1) {
                                  if (!referrer && (!guestName || (needPhone && !guestPhone) || (needEmail && !guestEmail))) {
                                    setQuestionnaireError('Please fill out all visible referrer fields');
                                    return;
                                  }
                                  if (!refFriendName || (needEmail && !refFriendEmail) || !refFriendPhone || !refRelationship) {
                                    setQuestionnaireError('Please fill out all visible referral details and relationship');
                                    return;
                                  }
                                }
                                setQuestionnaireError('');
                                setQuestionnaireStep(prev => prev + 1);
                              }}
                              className="btn-accent"
                            >
                              Next Step <FaArrowRight size={12} />
                            </button>
                          );
                        } else {
                          return (
                            <button
                              type="submit"
                              disabled={submittingReferral}
                              className="btn-accent"
                            >
                              {submittingReferral ? (
                                <FaSpinner className="animate-spin" />
                              ) : (
                                <>
                                  Submit &amp; Claim Points <FaCheckCircle size={12} />
                                </>
                              )}
                            </button>
                          );
                        }
                      })()}
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralPortal;
