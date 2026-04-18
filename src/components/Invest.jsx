import React, { useState } from 'react';
import './invest.css';

const Invest = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+91'
  });
  const [submissions, setSubmissions] = useState({
    canada: { submitted: false, valid: false, loading: false },
    us: { submitted: false, valid: false, loading: false },
    netherlands: { submitted: false, valid: false, loading: false }
  });

  const handleSubmit = async (e, country) => {
    e.preventDefault();
    if (submissions[country].loading) return;
    const name = formData.name;
    const email = formData.email;
    const phone = formData.phone;
    const countryCode = formData.countryCode;
    
    if (!name || !email || phone.length !== 10 || !/^[a-zA-Z\s]+$/.test(name)) {
      setSubmissions(prev => ({
        ...prev,
        [country]: { ...prev[country], valid: false }
      }));
      alert("Please enter a valid name (letters only) and a 10-digit phone number.");
      return;
    }

    setSubmissions(prev => ({
      ...prev,
      [country]: { ...prev[country], loading: true }
    }));

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/submit-invest-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone: `${countryCode}${phone}`, country }),
      });

      const data = await response.json();
      //alfa beta 
      if (data.success) {
        setSubmissions(prev => ({
          ...prev,
          [country]: { ...prev[country], submitted: true, valid: true, loading: false }
        }));
      } else {
        setSubmissions(prev => ({
          ...prev,
          [country]: { ...prev[country], valid: false, loading: false }
        }));
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmissions(prev => ({
        ...prev,
        [country]: { ...prev[country], valid: false, loading: false }
      }));
    }
  };

  return (
    <div className="invest-container">
      <h1 className="invest-heading">Invest in Top Countries</h1>
      
      <div className="invest-flags">
        {[{id: 'canada', name: 'Canada'}, {id: 'us', name: 'USA'}, {id: 'netherlands', name: 'Netherlands'}].map(country => (
          <div key={country.id} className="flag-container">
            <div className="card">
              <div className="card-front">
                <img src={`/${country.name}.png`} alt={`${country.name} Flag`} className="invest-flag" />
                <p className="country-name">{country.name}</p>
              </div>
              <div className="card-back">
                <form 
                  onSubmit={(e) => handleSubmit(e, country.id)}
                  className="contact-form"
                >
                  {submissions[country.id].submitted && submissions[country.id].valid ? (
                    <p className="thank-you">Thank you for your inquiry!</p>
                  ) : (
                    <>
                      <label className="contact-label">Contact Us</label>
                      <input 
                        type="text" 
                        placeholder="Your Name"
                        required
                        style={{ borderRadius: '12px', marginBottom: '8px' }}
                        disabled={submissions[country.id].loading}
                        value={formData.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '' || /^[a-zA-Z\s]*$/.test(val)) {
                            setFormData({...formData, name: val});
                          }
                        }}
                      />
                      <input 
                        type="email" 
                        placeholder="Your Email"
                        required
                        style={{ borderRadius: '12px', marginBottom: '8px' }}
                        disabled={submissions[country.id].loading}
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                      <div style={{ display: 'flex', gap: '5px', marginBottom: '8px' }}>
                        <select 
                          style={{ borderRadius: '12px', width: '70px', fontSize: '12px' }}
                          value={formData.countryCode}
                          onChange={(e) => setFormData({...formData, countryCode: e.target.value})}
                        >
                          <option value="+91">+91</option>
                          <option value="+1">+1</option>
                          <option value="+44">+44</option>
                        </select>
                        <input 
                          type="text" 
                          placeholder="Phone"
                          required
                          style={{ borderRadius: '12px', flex: 1 }}
                          disabled={submissions[country.id].loading}
                          value={formData.phone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            if (val.length <= 10) {
                              setFormData({...formData, phone: val});
                            }
                          }}
                        />
                      </div>
                      <button 
                      className='submi1'
                        type="submit"
                        style={{ borderRadius: '12px' }}
                        disabled={submissions[country.id].loading}
                      >
                        {submissions[country.id].loading ? 'Submitting...' : 'Submit'}
                      </button>
                    </>
                  )}
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Invest;