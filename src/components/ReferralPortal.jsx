import React, { useState, useEffect } from 'react';
import { 
  FaCoins, FaHandHoldingUsd, FaUserFriends, FaArrowRight, FaArrowLeft, 
  FaCheckCircle, FaSpinner, FaSignOutAlt, FaGlobe, FaAward, FaTrophy, 
  FaChevronRight, FaLock, FaUser, FaEnvelope, FaPhone, FaArrowAltCircleUp 
} from 'react-icons/fa';
import './ReferralPortal.css';

const ReferralPortal = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
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
    cash_per_point: 10
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
  const [refGoal, setRefGoal] = useState(''); // 'study', 'work', 'invest', 'language'
  const [refCountry, setRefCountry] = useState('');
  const [refBudget, setRefBudget] = useState('');
  const [refExamReady, setRefExamReady] = useState('');
  const [refNotes, setRefNotes] = useState('');
  const [questionnaireError, setQuestionnaireError] = useState('');

  // Load configs on mount
  useEffect(() => {
    fetchConfigs();
    // Check if user is logged in
    const storedReferrer = localStorage.getItem('payana_referrer_profile');
    if (storedReferrer) {
      const parsed = JSON.parse(storedReferrer);
      setReferrer(parsed);
      fetchProfile(parsed.email);
    }
  }, []);

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

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);

    try {
      const endpoint = authMode === 'login' ? '/referrer/login' : '/referrer/register';
      const body = authMode === 'login' 
        ? { email: authEmail, phone: authPhone }
        : { name: authName, email: authEmail, phone: authPhone, isOldClient };

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
  };

  const handleReferralSubmit = async (e) => {
    e.preventDefault();
    setQuestionnaireError('');

    if (!refFriendName || !refFriendEmail || !refFriendPhone) {
      setQuestionnaireError('Please fill out all contact fields');
      return;
    }

    setSubmittingReferral(true);

    const questionnaire = {
      targetCountry: refCountry,
      preference: refGoal,
      examReady: refExamReady,
      budget: refBudget,
      additionalNotes: refNotes
    };

    try {
      const res = await fetch(`${API_URL}/referrer/submit-referral`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referrerId: referrer.id,
          referredName: refFriendName,
          referredEmail: refFriendEmail,
          referredPhone: refFriendPhone,
          questionnaire
        })
      });

      const data = await res.json();
      setSubmittingReferral(false);

      if (data.success) {
        setCelebrationPoints(configs.points_per_referral);
        setReferralSuccess(true);
        fetchProfile(referrer.email);
        
        // Reset questionnaire inputs
        setRefFriendName('');
        setRefFriendEmail('');
        setRefFriendPhone('');
        setRefGoal('');
        setRefCountry('');
        setRefBudget('');
        setRefExamReady('');
        setRefNotes('');
        setQuestionnaireStep(1);
      } else {
        setQuestionnaireError(data.message || 'Error submitting referral. Please try again.');
      }
    } catch (err) {
      setSubmittingReferral(false);
      setQuestionnaireError('Network error. Please try again later.');
    }
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
                <div className="table-responsive">
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
                      {profileData.referrals.map((ref) => {
                        const q = ref.questionnaire || {};
                        return (
                          <tr key={ref.id} className="table-body-row">
                            <td>
                              <p className="referred-name">{ref.referred_name}</p>
                              <p className="referred-email">{ref.referred_email}</p>
                              <p className="referred-phone">{ref.referred_phone}</p>
                            </td>
                            <td>
                              <div className="referred-interest-cell">
                                <p><span className="cell-label">Pathway:</span> <span className="font-semibold text-gradient uppercase">{q.preference || 'N/A'}</span></p>
                                <p><span className="cell-label">Destination:</span> <span className="font-semibold">{q.targetCountry || 'N/A'}</span></p>
                                <p><span className="cell-label">Budget:</span> <span className="font-semibold">{q.budget || 'N/A'}</span></p>
                              </div>
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
                        );
                      })}
                    </tbody>
                  </table>
                </div>
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
          </div>
        ) : (
          /* Landing Screen (Logged Out) */
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

                <div className="hero-actions-container">
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
                </div>
              </div>

              {/* Reward Calculator */}
              <div className="referral-hero-right glass-card">
                <div>
                  <h3 className="calc-card-title">
                    <FaTrophy className="text-yellow-400" /> Reward Calculator
                  </h3>
                  <p className="calc-card-subtitle">Estimate your earnings based on referral configurations.</p>
                  
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
                  <h4 className="guide-step-title">Assess Friend</h4>
                  <p className="guide-step-desc">Fill out details about your friend's target country, education, and language goals.</p>
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
                  {authMode === 'login' ? 'Portal Log In' : 'Register Referrer'}
                </h3>
                <p className="modal-subtitle">
                  {authMode === 'login' 
                    ? 'Enter email and phone matching registration' 
                    : 'Become a referrer and start earning points'
                  }
                </p>
              </div>

              {authError && (
                <div className="form-error-message">
                  {authError}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="form-fields">
                {authMode === 'register' && (
                  <div className="input-group">
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

                <div className="input-group">
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

                <div className="input-group">
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

                {authMode === 'register' && (
                  <div className="checkbox-wrapper">
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

                <button 
                  type="submit"
                  disabled={loading}
                  className="btn-accent btn-full"
                >
                  {loading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    authMode === 'login' ? 'Access Portal' : 'Register & Start'
                  )}
                </button>
              </form>

              <div className="modal-footer">
                {authMode === 'login' ? (
                  <p>
                    Don't have an account?{' '}
                    <button 
                      onClick={() => { setAuthMode('register'); setAuthError(''); }}
                      className="empty-state-link"
                    >
                      Sign Up Here
                    </button>
                  </p>
                ) : (
                  <p>
                    Already registered?{' '}
                    <button 
                      onClick={() => { setAuthMode('login'); setAuthError(''); }}
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
                    Your friend's inquiry has been saved and the admin has been notified.
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
                  <div className="step-indicator-wrapper">
                    <div>
                      <span className="badge-premium badge-indigo">Step {questionnaireStep} of 3</span>
                      <h3 className="modal-title" style={{ marginTop: '0.25rem' }}>
                        {questionnaireStep === 1 && "Friend's Contact Information"}
                        {questionnaireStep === 2 && "Pathway & Choice of Preference"}
                        {questionnaireStep === 3 && "Candidate Assessment Details"}
                      </h3>
                    </div>
                    
                    <div className="step-indicator-bars">
                      {[1, 2, 3].map((step) => (
                        <div 
                          key={step} 
                          className={`step-indicator-bar ${
                            step === questionnaireStep ? 'active' : step < questionnaireStep ? 'completed' : ''
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {questionnaireError && (
                    <div className="form-error-message">
                      {questionnaireError}
                    </div>
                  )}

                  <form onSubmit={handleReferralSubmit} className="form-fields">
                    
                    {/* STEP 1: Basic details */}
                    {questionnaireStep === 1 && (
                      <div className="step-form-grid animate-slide-up">
                        <div className="input-group span-2-columns">
                          <label className="input-label">Friend's Full Name *</label>
                          <input 
                            type="text"
                            value={refFriendName}
                            onChange={(e) => setRefFriendName(e.target.value)}
                            placeholder="e.g. Jane Smith"
                            required
                            className="input-premium"
                          />
                        </div>
                        
                        <div className="input-group span-2-columns">
                          <label className="input-label">Friend's Email Address *</label>
                          <input 
                            type="email"
                            value={refFriendEmail}
                            onChange={(e) => setRefFriendEmail(e.target.value)}
                            placeholder="e.g. janesmith@example.com"
                            required
                            className="input-premium"
                          />
                        </div>

                        <div className="input-group span-2-columns">
                          <label className="input-label">Friend's Phone Number *</label>
                          <input 
                            type="tel"
                            value={refFriendPhone}
                            onChange={(e) => setRefFriendPhone(e.target.value)}
                            placeholder="e.g. 9876500000"
                            required
                            className="input-premium"
                          />
                        </div>
                      </div>
                    )}

                    {/* STEP 2: Pathway Options */}
                    {questionnaireStep === 2 && (
                      <div className="form-fields animate-slide-up">
                        <label className="input-label">What is your friend interested in doing? *</label>
                        
                        <div className="pathway-selection-grid">
                          <button
                            type="button"
                            onClick={() => setRefGoal('study')}
                            className={`path-selection-card ${refGoal === 'study' ? 'selected' : ''}`}
                          >
                            <span className="path-icon">🎓</span>
                            <div>
                              <p className="path-card-title">Study Abroad</p>
                              <p className="path-card-desc">Bachelor's, Master's, PG programs</p>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setRefGoal('work')}
                            className={`path-selection-card ${refGoal === 'work' ? 'selected' : ''}`}
                          >
                            <span className="path-icon">💼</span>
                            <div>
                              <p className="path-card-title">Work Abroad</p>
                              <p className="path-card-desc">Job seeker, work permits, pathways</p>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setRefGoal('invest')}
                            className={`path-selection-card ${refGoal === 'invest' ? 'selected' : ''}`}
                          >
                            <span className="path-icon">💰</span>
                            <div>
                              <p className="path-card-title">Invest Abroad</p>
                              <p className="path-card-desc">Business setup, golden visa, investor</p>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setRefGoal('language')}
                            className={`path-selection-card ${refGoal === 'language' ? 'selected' : ''}`}
                          >
                            <span className="path-icon">🗣️</span>
                            <div>
                              <p className="path-card-title">Language Course</p>
                              <p className="path-card-desc">IELTS, OET, French, German training</p>
                            </div>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 3: Assessment specifics */}
                    {questionnaireStep === 3 && (
                      <div className="step-form-grid animate-slide-up">
                        <div className="input-group">
                          <label className="input-label">Target Country</label>
                          <select 
                            value={refCountry}
                            onChange={(e) => setRefCountry(e.target.value)}
                            className="select-premium"
                          >
                            <option value="">Select Target Country</option>
                            <option value="Canada">Canada</option>
                            <option value="Germany">Germany</option>
                            <option value="UK">United Kingdom</option>
                            <option value="USA">USA</option>
                            <option value="Australia">Australia</option>
                            <option value="France">France</option>
                            <option value="Other">Other Countries</option>
                          </select>
                        </div>

                        <div className="input-group">
                          <label className="input-label">Language Test Status</label>
                          <select 
                            value={refExamReady}
                            onChange={(e) => setRefExamReady(e.target.value)}
                            className="select-premium"
                          >
                            <option value="">Select Status</option>
                            <option value="Ready to take test">Ready to take test</option>
                            <option value="Already cleared test">Already cleared test</option>
                            <option value="Needs coaching/training">Needs coaching/training</option>
                            <option value="Not required">Not required</option>
                          </select>
                        </div>

                        <div className="input-group span-2-columns">
                          <label className="input-label">Target Budget Range</label>
                          <select 
                            value={refBudget}
                            onChange={(e) => setRefBudget(e.target.value)}
                            className="select-premium"
                          >
                            <option value="">Select Budget Range</option>
                            <option value="Under 10 Lakhs">Under 10 Lakhs</option>
                            <option value="10 to 20 Lakhs">10 to 20 Lakhs</option>
                            <option value="20 to 30 Lakhs">20 to 30 Lakhs</option>
                            <option value="Above 30 Lakhs">Above 30 Lakhs</option>
                          </select>
                        </div>

                        <div className="input-group span-2-columns">
                          <label className="input-label">Additional Profile Notes / Background</label>
                          <textarea 
                            value={refNotes}
                            onChange={(e) => setRefNotes(e.target.value)}
                            placeholder="e.g. Friend has 3 years experience in IT, or wants intake of September."
                            rows="3"
                            className="textarea-premium"
                          />
                        </div>
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="step-navigation-buttons">
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

                      {questionnaireStep < 3 ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (questionnaireStep === 1 && (!refFriendName || !refFriendEmail || !refFriendPhone)) {
                              setQuestionnaireError('Please fill out all contact fields before continuing');
                              return;
                            }
                            if (questionnaireStep === 2 && !refGoal) {
                              setQuestionnaireError('Please select a pathway of interest before continuing');
                              return;
                            }
                            setQuestionnaireError('');
                            setQuestionnaireStep(prev => prev + 1);
                          }}
                          className="btn-accent"
                        >
                          Next Step <FaArrowRight size={12} />
                        </button>
                      ) : (
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
                      )}
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
