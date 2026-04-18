import React, { useState, useEffect } from 'react';
import './PRScoreCalculator.css';

const PRScoreCalculator = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [formData, setFormData] = useState({
    // Australia fields
    age: '25-32',
    english: 'competent',
    employmentOutside: '0-3',
    employmentInside: '0-1',
    qualifications: 'diploma',
    ausStudy: 'no',
    specialistEducation: 'no',
    stateNomination: 'none',
    maritalStatus: 'single',
    naati: 'no',
    
    // Canada fields
    canadaAge: '20-29',
    canadaEducation: 'bachelor',
    canadaFirstLanguage: 'clb7',
    canadaSecondLanguage: 'none',
    canadaWorkExperience: 'none',
    canadaMaritalStatus: 'single', // New field for Canada
    canadaSpouseEducation: 'none',
    canadaSpouseLanguage: 'none',
    canadaSpouseWork: 'none',
    canadaForeignWork: 'none',
    canadaSibling: 'no',
    canadaFrench: 'none',
    canadaStudy: 'none',
    canadaNomination: 'no',
    
    // Contact fields
    name: '',
    email: '',
    phone: '',
    countryCode: 'IND +91',
  });
  
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedCountry) {
      setFormData(prev => ({
        ...prev,
        // Reset Australia fields
        age: '25-32',
        english: 'competent',
        employmentOutside: '0-3',
        employmentInside: '0-1',
        qualifications: 'diploma',
        ausStudy: 'no',
        specialistEducation: 'no',
        stateNomination: 'none',
        maritalStatus: 'single',
        naati: 'no',
        
        // Reset Canada fields
        canadaAge: '20-29',
        canadaEducation: 'bachelor',
        canadaFirstLanguage: 'clb7',
        canadaSecondLanguage: 'none',
        canadaWorkExperience: 'none',
        canadaMaritalStatus: 'single',
        canadaSpouseEducation: 'none',
        canadaSpouseLanguage: 'none',
        canadaSpouseWork: 'none',
        canadaForeignWork: 'none',
        canadaSibling: 'no',
        canadaFrench: 'none',
        canadaStudy: 'none',
        canadaNomination: 'no',
        
        // Keep contact info
        name: '',
        email: '',
        phone: '',
        countryCode: 'IND +91',
      }));
      setStep(1);
    }
  }, [selectedCountry]);

  const validateField = (name, value) => {
    let error = '';
    
    if (name === 'name') {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        error = 'Name can only contain letters and spaces';
      }
    }
    
    if (name === 'phone') {
      if (!/^\d*$/.test(value)) {
        error = 'Phone number can only contain digits';
      }
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
    
    if (!error) {
      // Handle marital status change for Canada
      if (name === 'canadaMaritalStatus') {
        if (value === 'single') {
          setFormData(prev => ({
            ...prev,
            [name]: value,
            canadaSpouseEducation: 'none',
            canadaSpouseLanguage: 'none',
            canadaSpouseWork: 'none'
          }));
        } else {
          setFormData(prev => ({ ...prev, [name]: value }));
        }
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let valid = true;
    const newErrors = {};
    
    if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = 'Please enter a valid name';
      valid = false;
    }
    
    if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
      valid = false;
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      valid = false;
    }
    
    setErrors(newErrors);
    
    if (valid) {
      setIsSubmitting(true);
      
      try {
        const score = selectedCountry === 'aus' ? calculateAustraliaScore() : calculateCanadaScore();
        const isSpouse = selectedCountry === 'can' && formData.canadaMaritalStatus === 'married';
        
        const submissionData = {
          country: selectedCountry,
          score: score,
          hasSpouse: isSpouse,
          formData: formData,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          countryCode: formData.countryCode
        };

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/submit-pr-score`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData),
        });

        if (response.ok) {
          setStep(2);
        } else {
          console.error('Failed to submit data');
          setStep(2); // Still show results even if email fails
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        setStep(2); // Still show results even if submission fails
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const handleReset = () => {
    setSelectedCountry(null);
    setStep(1);
    setErrors({});
  };

  const calculateAustraliaScore = () => {
    let score = 0;
    
    // Age points
    if (formData.age === '18-24') score += 25;
    else if (formData.age === '25-32') score += 30;
    else if (formData.age === '33-39') score += 25;
    else if (formData.age === '40-44') score += 15;
    
    // English points
    if (formData.english === 'competent') score += 0;
    else if (formData.english === 'proficient') score += 10;
    else if (formData.english === 'superior') score += 20;
    
    // Employment outside Australia points
    if (formData.employmentOutside === '0-3') score += 0;
    else if (formData.employmentOutside === '3-5') score += 5;
    else if (formData.employmentOutside === '5-8') score += 10;
    else if (formData.employmentOutside === '8-10') score += 15;
    
    // Employment inside Australia points
    if (formData.employmentInside === '0-1') score += 0;
    else if (formData.employmentInside === '1-3') score += 5;
    else if (formData.employmentInside === '3-5') score += 10;
    else if (formData.employmentInside === '5-8') score += 15;
    else if (formData.employmentInside === '8-10') score += 20;
    
    // Qualifications points
    if (formData.qualifications === 'doctorate') score += 20;
    else if (formData.qualifications === 'bachelor-master') score += 15;
    else if (formData.qualifications === 'diploma') score += 10;
    else if (formData.qualifications === 'recognized') score += 10;
    
    // Australian study points
    if (formData.ausStudy === 'yes') {
      score += 5;
      if (formData.specialistEducation === 'yes') score += 10;
    }
    
    // State nomination points
    if (formData.stateNomination === '190') score += 5;
    else if (formData.stateNomination === '491') score += 15;
    
    // Marital status points
    if (formData.maritalStatus === 'single') score += 10;
    else if (formData.maritalStatus === 'spouse-australian') score += 10;
    else if (formData.maritalStatus === 'spouse-skill-english') score += 10;
    else if (formData.maritalStatus === 'spouse-english') score += 5;
    
    // NAATI points
    if (formData.naati === 'yes') score += 5;
    
    return score;
  };

  const calculateCanadaScore = () => {
    let score = 0;
    const hasSpouse = formData.canadaMaritalStatus === 'married';
    
    // Age points based on official CRS table
    const agePoints = {
      '18': hasSpouse ? 90 : 99,
      '19': hasSpouse ? 95 : 105,
      '20-29': hasSpouse ? 100 : 110,
      '30': hasSpouse ? 95 : 105,
      '31': hasSpouse ? 90 : 99,
      '32': hasSpouse ? 85 : 94,
      '33': hasSpouse ? 80 : 88,
      '34': hasSpouse ? 75 : 83,
      '35': hasSpouse ? 70 : 77,
      '36': hasSpouse ? 65 : 72,
      '37': hasSpouse ? 60 : 66,
      '38': hasSpouse ? 55 : 61,
      '39': hasSpouse ? 50 : 55,
      '40': hasSpouse ? 45 : 50,
      '41': hasSpouse ? 35 : 39,
      '42': hasSpouse ? 25 : 28,
      '43': hasSpouse ? 15 : 17,
      '44': hasSpouse ? 5 : 6,
      '45+': 0
    };
    score += agePoints[formData.canadaAge] || 0;
    
    // Education points
    const educationPoints = {
      'secondary': hasSpouse ? 28 : 30,
      'one-year': hasSpouse ? 84 : 90,
      'two-year': hasSpouse ? 91 : 98,
      'bachelor': hasSpouse ? 112 : 120,
      'two-certificates': hasSpouse ? 119 : 128,
      'master': hasSpouse ? 126 : 135,
      'doctorate': hasSpouse ? 140 : 150
    };
    score += educationPoints[formData.canadaEducation] || 0;
    
    // First official language points (calculated for all 4 abilities)
    const firstLangAbilityPoints = {
      'clb4-5': hasSpouse ? 6 : 6,
      'clb6': hasSpouse ? 8 : 9,
      'clb7': hasSpouse ? 16 : 17,
      'clb8': hasSpouse ? 22 : 23,
      'clb9': hasSpouse ? 29 : 31,
      'clb10+': hasSpouse ? 32 : 34
    };
    const firstLangPoints = (firstLangAbilityPoints[formData.canadaFirstLanguage] || 0) * 4;
    score += firstLangPoints;
    
    // Second official language points (all 4 abilities)
    const secondLangAbilityPoints = {
      'clb5-6': 1,
      'clb7-8': 3,
      'clb9+': 6
    };
    if (formData.canadaSecondLanguage !== 'none') {
      const secondLangPoints = (secondLangAbilityPoints[formData.canadaSecondLanguage] || 0) * 4;
      score += Math.min(secondLangPoints, hasSpouse ? 22 : 24); // Maximum cap
    }
    
    // Canadian work experience points
    const canWorkPoints = {
      '1-year': hasSpouse ? 35 : 40,
      '2-years': hasSpouse ? 46 : 53,
      '3-years': hasSpouse ? 56 : 64,
      '4-years': hasSpouse ? 63 : 72,
      '5+years': hasSpouse ? 70 : 80
    };
    if (formData.canadaWorkExperience !== 'none') {
      score += canWorkPoints[formData.canadaWorkExperience] || 0;
    }
    
    // Spouse factors (if applicable)
    if (hasSpouse) {
      // Spouse education points
      const spouseEducationPoints = {
        'secondary': 2,
        'one-year': 6,
        'two-year': 7,
        'bachelor': 8,
        'two-certificates': 9,
        'master': 10,
        'doctorate': 10
      };
      if (formData.canadaSpouseEducation !== 'none') {
        score += spouseEducationPoints[formData.canadaSpouseEducation] || 0;
      }
      
      // Spouse language points (all 4 abilities)
      const spouseLangAbilityPoints = {
        'clb5-6': 1,
        'clb7-8': 3,
        'clb9+': 5
      };
      if (formData.canadaSpouseLanguage !== 'none') {
        const spouseLangPoints = (spouseLangAbilityPoints[formData.canadaSpouseLanguage] || 0) * 4;
        score += Math.min(spouseLangPoints, 20); // Maximum 20 points
      }
      
      // Spouse Canadian work experience points
      const spouseWorkPoints = {
        '1-year': 5,
        '2-years': 7,
        '3-years': 8,
        '4-years': 9,
        '5+years': 10
      };
      if (formData.canadaSpouseWork !== 'none') {
        score += spouseWorkPoints[formData.canadaSpouseWork] || 0;
      }
    }
    
    // Skill transferability factors
    let skillTransferabilityPoints = 0;
    
    // Education with language combination
    if (formData.canadaEducation !== 'secondary') {
      const isStrongLanguage = ['clb9', 'clb10+'].includes(formData.canadaFirstLanguage);
      const isGoodLanguage = ['clb7', 'clb8'].includes(formData.canadaFirstLanguage);
      
      if (isStrongLanguage) {
        if (['one-year'].includes(formData.canadaEducation)) {
          skillTransferabilityPoints += 25;
        } else {
          skillTransferabilityPoints += 50;
        }
      } else if (isGoodLanguage) {
        if (['one-year'].includes(formData.canadaEducation)) {
          skillTransferabilityPoints += 13;
        } else {
          skillTransferabilityPoints += 25;
        }
      }
    }
    
    // Education with Canadian work experience combination
    if (formData.canadaEducation !== 'secondary' && formData.canadaWorkExperience !== 'none') {
      const hasSignificantCanWork = ['2-years', '3-years', '4-years', '5+years'].includes(formData.canadaWorkExperience);
      
      if (hasSignificantCanWork) {
        if (['one-year'].includes(formData.canadaEducation)) {
          skillTransferabilityPoints = Math.max(skillTransferabilityPoints, 25);
        } else {
          skillTransferabilityPoints = Math.max(skillTransferabilityPoints, 50);
        }
      } else if (formData.canadaWorkExperience === '1-year') {
        if (['one-year'].includes(formData.canadaEducation)) {
          skillTransferabilityPoints = Math.max(skillTransferabilityPoints, 13);
        } else {
          skillTransferabilityPoints = Math.max(skillTransferabilityPoints, 25);
        }
      }
    }
    
    // Foreign work experience combinations
    if (formData.canadaForeignWork !== 'none') {
      const isStrongLanguage = ['clb9', 'clb10+'].includes(formData.canadaFirstLanguage);
      const isGoodLanguage = ['clb7', 'clb8'].includes(formData.canadaFirstLanguage);
      const hasSignificantForeignWork = formData.canadaForeignWork === '3+years';
      
      // Foreign work with language
      if (isStrongLanguage) {
        const foreignLangPoints = hasSignificantForeignWork ? 50 : 25;
        skillTransferabilityPoints = Math.max(skillTransferabilityPoints, foreignLangPoints);
      } else if (isGoodLanguage) {
        const foreignLangPoints = hasSignificantForeignWork ? 25 : 13;
        skillTransferabilityPoints = Math.max(skillTransferabilityPoints, foreignLangPoints);
      }
      
      // Foreign work with Canadian work experience
      if (formData.canadaWorkExperience !== 'none') {
        const hasSignificantCanWork = ['2-years', '3-years', '4-years', '5+years'].includes(formData.canadaWorkExperience);
        
        if (hasSignificantCanWork) {
          const foreignCanWorkPoints = hasSignificantForeignWork ? 50 : 25;
          skillTransferabilityPoints = Math.max(skillTransferabilityPoints, foreignCanWorkPoints);
        } else if (formData.canadaWorkExperience === '1-year') {
          const foreignCanWorkPoints = hasSignificantForeignWork ? 25 : 13;
          skillTransferabilityPoints = Math.max(skillTransferabilityPoints, foreignCanWorkPoints);
        }
      }
    }
    
    // Cap skill transferability at 100 points
    score += Math.min(skillTransferabilityPoints, 100);
    
    // Additional points
    if (formData.canadaSibling === 'yes') score += 15;
    
    // French language points
    if (formData.canadaFrench === 'strong-weak-english') score += 25;
    else if (formData.canadaFrench === 'strong-good-english') score += 50;
    
    // Canadian study points
    if (formData.canadaStudy === '1-2-years') score += 15;
    else if (formData.canadaStudy === '3+years') score += 30;
    
    // Provincial nomination points
    if (formData.canadaNomination === 'yes') score += 600;
    
    return Math.min(score, 1200); // Maximum possible score is 1200
  };
  
  const currentScore = selectedCountry === 'aus' ? calculateAustraliaScore() : 
                      selectedCountry === 'can' ? calculateCanadaScore() : 0;
  
  const countryCodes = [
    { value: 'AFG +93', label: 'Afghanistan +93' },
    { value: 'ALB +355', label: 'Albania +355' },
    { value: 'DZA +213', label: 'Algeria +213' },
    { value: 'ARG +54', label: 'Argentina +54' },
    { value: 'AUS +61', label: 'Australia +61' },
    { value: 'AUT +43', label: 'Austria +43' },
    { value: 'BHR +973', label: 'Bahrain +973' },
    { value: 'BGD +880', label: 'Bangladesh +880' },
    { value: 'BEL +32', label: 'Belgium +32' },
    { value: 'BRA +55', label: 'Brazil +55' },
    { value: 'CAN +1', label: 'Canada +1' },
    { value: 'CHN +86', label: 'China +86' },
    { value: 'COL +57', label: 'Colombia +57' },
    { value: 'CZE +420', label: 'Czech Republic +420' },
    { value: 'DNK +45', label: 'Denmark +45' },
    { value: 'EGY +20', label: 'Egypt +20' },
    { value: 'FRA +33', label: 'France +33' },
    { value: 'DEU +49', label: 'Germany +49' },
    { value: 'GRC +30', label: 'Greece +30' },
    { value: 'HKG +852', label: 'Hong Kong +852' },
    { value: 'IND +91', label: 'India +91' },
    { value: 'IDN +62', label: 'Indonesia +62' },
    { value: 'IRL +353', label: 'Ireland +353' },
    { value: 'ISR +972', label: 'Israel +972' },
    { value: 'ITA +39', label: 'Italy +39' },
    { value: 'JPN +81', label: 'Japan +81' },
    { value: 'KWT +965', label: 'Kuwait +965' },
    { value: 'MYS +60', label: 'Malaysia +60' },
    { value: 'MEX +52', label: 'Mexico +52' },
    { value: 'NLD +31', label: 'Netherlands +31' },
    { value: 'NZL +64', label: 'New Zealand +64' },
    { value: 'NGA +234', label: 'Nigeria +234' },
    { value: 'NOR +47', label: 'Norway +47' },
    { value: 'OMN +968', label: 'Oman +968' },
    { value: 'PAK +92', label: 'Pakistan +92' },
    { value: 'PHL +63', label: 'Philippines +63' },
    { value: 'POL +48', label: 'Poland +48' },
    { value: 'PRT +351', label: 'Portugal +351' },
    { value: 'QAT +974', label: 'Qatar +974' },
    { value: 'SAU +966', label: 'Saudi Arabia +966' },
    { value: 'SGP +65', label: 'Singapore +65' },
    { value: 'ZAF +27', label: 'South Africa +27' },
    { value: 'KOR +82', label: 'South Korea +82' },
    { value: 'ESP +34', label: 'Spain +34' },
    { value: 'SWE +46', label: 'Sweden +46' },
    { value: 'CHE +41', label: 'Switzerland +41' },
    { value: 'TWN +886', label: 'Taiwan +886' },
    { value: 'THA +66', label: 'Thailand +66' },
    { value: 'TUR +90', label: 'Turkey +90' },
    { value: 'ARE +971', label: 'UAE +971' },
    { value: 'UKR +380', label: 'Ukraine +380' },
    { value: 'GBR +44', label: 'UK +44' },
    { value: 'USA +1', label: 'USA +1' },
    { value: 'VNM +84', label: 'Vietnam +84' },
  ];

  return (
    <div className="pr-calculator-container">
      <div className="pr-header">
        <h1>WANT TO CHECK YOUR PR SCORE?</h1>
        {!selectedCountry && <p>Select your destination country</p>}
      </div>

      <div className="pr-content">
        {!selectedCountry ? (
          <div className="country-selection">
            <div className="country-buttons">
              <button 
                className="country-button aus-button"
                onClick={() => setSelectedCountry('aus')}
              >
                <div className="flag-icon aus-flag"></div>
                <span>Australia</span>
              </button>
              <button 
                className="country-button can-button"
                onClick={() => setSelectedCountry('can')}
              >
                <div className="flag-icon can-flag"></div>
                <span>Canada</span>
              </button>
            </div>
            <div className="country-info">
              <div className="country-card">
                <h3>Australia PR</h3>
                <p>Points-based immigration system</p>
                <p>Minimum 65 points required</p>
              </div>
              <div className="country-card">
                <h3>Canada PR</h3>
                <p>Comprehensive Ranking System</p>
                <p>Minimum 67 points required</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="pr-form-container">
            <div className="country-header">
              <h2>
                {selectedCountry === 'aus' 
                  ? 'Australia PR Score Calculator' 
                  : 'Canada PR Score Calculator'}
              </h2>
              <div className="score-display-header">
                <h3>Current Score: <span className="score-value">{currentScore} points</span></h3>
              </div>
            </div>
            
            {step === 2 ? (
              <div className="thank-you-message">
                <h2>
                  {selectedCountry === 'aus' 
                    ? (currentScore < 65 
                        ? "Unfortunately, your score is below the eligibility threshold"
                        : "🎉 Congratulations! You are eligible to apply for Australia PR")
                    : (currentScore < 67 
                        ? "Unfortunately, your score is below the eligibility threshold"
                        : "🎉 Congratulations! You have a competitive score for Canada PR")}
                </h2>
                
                <div className="score-display">
                  <h3>Your Calculated PR Score:</h3>
                  <div className="score-value">{currentScore} points</div>
                  <p className="score-description">
                    {selectedCountry === 'aus' 
                      ? "Australian PR requires 65+ points"
                      : "Canada Express Entry varies by draw (usually 400-500+ points)"}
                  </p>
                </div>
                
                <p className="result-message">
                  {selectedCountry === 'aus' 
                    ? (currentScore < 65 
                        ? "Let us guide you on improving your chances. Our expert will contact you soon."
                        : "Our team will connect with you shortly.")
                    : (currentScore < 67 
                        ? "Let us help you improve your score. Our expert will contact you soon."
                        : "Our team will connect with you shortly to discuss your options.")}
                </p>
                
                <div className="result-buttons">
                  <button
                    onClick={handleReset}
                    className="submit-button"
                  >
                    Calculate Again
                  </button>
                  <button
                    onClick={() => window.location.href = '/contact'}
                    className="submit-button contact-button"
                  >
                    Contact Us Now
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="main-form">
                {selectedCountry === 'aus' ? (
                  <>
                    {/* Australia Form Fields */}
                    <div className="form-section">
                      <h3>Age*</h3>
                      <div className="form-options-grid">
                        {[
                          { value: '18-24', label: '18-24 years' },
                          { value: '25-32', label: '25-32 years' },
                          { value: '33-39', label: '33-39 years' },
                          { value: '40-44', label: '40-44 years' }
                        ].map(option => (
                          <label 
                            key={option.value} 
                            className={`form-option ${formData.age === option.value ? 'selected' : ''}`}
                          >
                            <input
                              type="radio"
                              name="age"
                              value={option.value}
                              checked={formData.age === option.value}
                              onChange={handleChange}
                              className="hidden"
                              required
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="form-section">
                      <h3>English Proficiency*</h3>
                      <div className="form-options-grid">
                        {[
                          { value: 'competent', label: 'Competent English' },
                          { value: 'proficient', label: 'Proficient English' },
                          { value: 'superior', label: 'Superior English' }
                        ].map(option => (
                          <label 
                            key={option.value} 
                            className={`form-option ${formData.english === option.value ? 'selected' : ''}`}
                          >
                            <input
                              type="radio"
                              name="english"
                              value={option.value}
                              checked={formData.english === option.value}
                              onChange={handleChange}
                              className="hidden"
                              required
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="form-section">
                      <h3>Skilled Employment Outside Australia (Last 10 Years)*</h3>
                      <div className="form-options-grid">
                        {[
                          { value: '0-3', label: '0-3 years' },
                          { value: '3-5', label: '3-5 years' },
                          { value: '5-8', label: '5-8 years' },
                          { value: '8-10', label: '8-10 years' }
                        ].map(option => (
                          <label 
                            key={option.value} 
                            className={`form-option ${formData.employmentOutside === option.value ? 'selected' : ''}`}
                          >
                            <input
                              type="radio"
                              name="employmentOutside"
                              value={option.value}
                              checked={formData.employmentOutside === option.value}
                              onChange={handleChange}
                              className="hidden"
                              required
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="form-section">
                      <h3>Skilled Employment In Australia (Last 10 Years)*</h3>
                      <div className="form-options-grid">
                        {[
                          { value: '0-1', label: '0-1 year' },
                          { value: '1-3', label: '1-3 years' },
                          { value: '3-5', label: '3-5 years' },
                          { value: '5-8', label: '5-8 years' },
                          { value: '8-10', label: '8-10 years' }
                        ].map(option => (
                          <label 
                            key={option.value} 
                            className={`form-option ${formData.employmentInside === option.value ? 'selected' : ''}`}
                          >
                            <input
                              type="radio"
                              name="employmentInside"
                              value={option.value}
                              checked={formData.employmentInside === option.value}
                              onChange={handleChange}
                              className="hidden"
                              required
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="form-section">
                      <h3>Qualifications*</h3>
                      <div className="form-options-grid">
                        {[
                          { value: 'doctorate', label: 'Doctorate' },
                          { value: 'bachelor-master', label: "Bachelor's/Master's" },
                          { value: 'diploma', label: 'Diploma' },
                          { value: 'recognized', label: 'Recognized University' }
                        ].map(option => (
                          <label 
                            key={option.value} 
                            className={`form-option ${formData.qualifications === option.value ? 'selected' : ''}`}
                          >
                            <input
                              type="radio"
                              name="qualifications"
                              value={option.value}
                              checked={formData.qualifications === option.value}
                              onChange={handleChange}
                              className="hidden"
                              required
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="form-section">
                      <h3>Australian Study Requirement (92 Weeks Course)*</h3>
                      <div className="form-options-grid">
                        {[
                          { value: 'yes', label: 'Yes' },
                          { value: 'no', label: 'No' }
                        ].map(option => (
                          <label 
                            key={option.value} 
                            className={`form-option ${formData.ausStudy === option.value ? 'selected' : ''}`}
                          >
                            <input
                              type="radio"
                              name="ausStudy"
                              value={option.value}
                              checked={formData.ausStudy === option.value}
                              onChange={handleChange}
                              className="hidden"
                              required
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {formData.ausStudy === 'yes' && (
                      <div className="form-section">
                        <h3>Specialist Education in Australia (STEM Doctorate/Master's)*</h3>
                        <div className="form-options-grid">
                          {[
                            { value: 'yes', label: 'Yes' },
                            { value: 'no', label: 'No' }
                          ].map(option => (
                            <label 
                              key={option.value} 
                              className={`form-option ${formData.specialistEducation === option.value ? 'selected' : ''}`}
                            >
                              <input
                                type="radio"
                                name="specialistEducation"
                                value={option.value}
                                checked={formData.specialistEducation === option.value}
                                onChange={handleChange}
                                className="hidden"
                                required
                              />
                              {option.label}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="form-section">
                      <h3>State Nomination*</h3>
                      <div className="form-options-grid">
                        {[
                          { value: 'none', label: 'None' },
                          { value: '190', label: '190 Subclass' },
                          { value: '491', label: '491 Subclass' }
                        ].map(option => (
                          <label 
                            key={option.value} 
                            className={`form-option ${formData.stateNomination === option.value ? 'selected' : ''}`}
                          >
                            <input
                              type="radio"
                              name="stateNomination"
                              value={option.value}
                              checked={formData.stateNomination === option.value}
                              onChange={handleChange}
                              className="hidden"
                              required
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="form-section">
                      <h3>Marital Status / Spouse Criteria*</h3>
                      <div className="form-options-grid">
                        {[
                          { value: 'single', label: 'Single (Unmarried)' },
                          { value: 'spouse-australian', label: 'Spouse is Australian Citizen/PR' },
                          { value: 'spouse-skill-english', label: 'Spouse has Skill Assessment & Competent English' },
                          { value: 'spouse-english', label: 'Spouse has Competent English (No Assessment)' }
                        ].map(option => (
                          <label 
                            key={option.value} 
                            className={`form-option ${formData.maritalStatus === option.value ? 'selected' : ''}`}
                          >
                            <input
                              type="radio"
                              name="maritalStatus"
                              value={option.value}
                              checked={formData.maritalStatus === option.value}
                              onChange={handleChange}
                              className="hidden"
                              required
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="form-section">
                      <h3>NAATI Test*</h3>
                      <div className="form-options-grid">
                        {[
                          { value: 'yes', label: 'Yes' },
                          { value: 'no', label: 'No' }
                        ].map(option => (
                          <label 
                            key={option.value} 
                            className={`form-option ${formData.naati === option.value ? 'selected' : ''}`}
                          >
                            <input
                              type="radio"
                              name="naati"
                              value={option.value}
                              checked={formData.naati === option.value}
                              onChange={handleChange}
                              className="hidden"
                              required
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Canada Form Fields */}
                    <div className="form-section">
                      <h3>Age*</h3>
                      <div className="form-options-grid">
                        {[
                          { value: '18', label: '18 years' },
                          { value: '19', label: '19 years' },
                          { value: '20-29', label: '20-29 years' },
                          { value: '30', label: '30 years' },
                          { value: '31', label: '31 years' },
                          { value: '32', label: '32 years' },
                          { value: '33', label: '33 years' },
                          { value: '34', label: '34 years' },
                          { value: '35', label: '35 years' },
                          { value: '36', label: '36 years' },
                          { value: '37', label: '37 years' },
                          { value: '38', label: '38 years' },
                          { value: '39', label: '39 years' },
                          { value: '40', label: '40 years' },
                          { value: '41', label: '41 years' },
                          { value: '42', label: '42 years' },
                          { value: '43', label: '43 years' },
                          { value: '44', label: '44 years' },
                          { value: '45+', label: '45+ years' }
                        ].map(option => (
                          <label 
                            key={option.value} 
                            className={`form-option ${formData.canadaAge === option.value ? 'selected' : ''}`}
                          >
                            <input
                              type="radio"
                              name="canadaAge"
                              value={option.value}
                              checked={formData.canadaAge === option.value}
                              onChange={handleChange}
                              className="hidden"
                              required
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="form-section">
                      <h3>Level of Education*</h3>
                      <div className="form-options-grid">
                        {[
                          { value: 'secondary', label: 'Secondary school (high school)' },
                          { value: 'one-year', label: 'One-year program' },
                          { value: 'two-year', label: 'Two-year program' },
                          { value: 'bachelor', label: "Bachelor's degree" },
                          { value: 'two-certificates', label: 'Two or more certificates/diplomas' },
                          { value: 'master', label: "Master's degree" },
                          { value: 'doctorate', label: 'Doctoral degree (Ph.D.)' }
                        ].map(option => (
                          <label 
                            key={option.value} 
                            className={`form-option ${formData.canadaEducation === option.value ? 'selected' : ''}`}
                          >
                            <input
                              type="radio"
                              name="canadaEducation"
                              value={option.value}
                              checked={formData.canadaEducation === option.value}
                              onChange={handleChange}
                              className="hidden"
                              required
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="form-section">
                      <h3>First Official Language Proficiency (English/French)*</h3>
                      <div className="form-options-grid">
                        {[
                          { value: 'clb4-5', label: 'CLB 4-5 (Basic)' },
                          { value: 'clb6', label: 'CLB 6 (Moderate)' },
                          { value: 'clb7', label: 'CLB 7 (Good)' },
                          { value: 'clb8', label: 'CLB 8 (Very Good)' },
                          { value: 'clb9', label: 'CLB 9 (Fluent)' },
                          { value: 'clb10+', label: 'CLB 10+ (Excellent)' }
                        ].map(option => (
                          <label 
                            key={option.value} 
                            className={`form-option ${formData.canadaFirstLanguage === option.value ? 'selected' : ''}`}
                          >
                            <input
                              type="radio"
                              name="canadaFirstLanguage"
                              value={option.value}
                              checked={formData.canadaFirstLanguage === option.value}
                              onChange={handleChange}
                              className="hidden"
                              required
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="form-section">
                      <h3>Second Official Language Proficiency*</h3>
                      <div className="form-options-grid">
                        {[
                          { value: 'none', label: 'None/CLB 4 or less' },
                          { value: 'clb5-6', label: 'CLB 5-6' },
                          { value: 'clb7-8', label: 'CLB 7-8' },
                          { value: 'clb9+', label: 'CLB 9+' }
                        ].map(option => (
                          <label 
                            key={option.value} 
                            className={`form-option ${formData.canadaSecondLanguage === option.value ? 'selected' : ''}`}
                          >
                            <input
                              type="radio"
                              name="canadaSecondLanguage"
                              value={option.value}
                              checked={formData.canadaSecondLanguage === option.value}
                              onChange={handleChange}
                              className="hidden"
                              required
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="form-section">
                      <h3>Canadian Work Experience*</h3>
                      <div className="form-options-grid">
                        {[
                          { value: 'none', label: 'None or less than 1 year' },
                          { value: '1-year', label: '1 year' },
                          { value: '2-years', label: '2 years' },
                          { value: '3-years', label: '3 years' },
                          { value: '4-years', label: '4 years' },
                          { value: '5+years', label: '5+ years' }
                        ].map(option => (
                          <label 
                            key={option.value} 
                            className={`form-option ${formData.canadaWorkExperience === option.value ? 'selected' : ''}`}
                          >
                            <input
                              type="radio"
                              name="canadaWorkExperience"
                              value={option.value}
                              checked={formData.canadaWorkExperience === option.value}
                              onChange={handleChange}
                              className="hidden"
                              required
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="form-section">
                      <h3>Foreign Work Experience*</h3>
                      <div className="form-options-grid">
                        {[
                          { value: 'none', label: 'No foreign work experience' },
                          { value: '1-2years', label: '1-2 years' },
                          { value: '3+years', label: '3+ years' }
                        ].map(option => (
                          <label 
                            key={option.value} 
                            className={`form-option ${formData.canadaForeignWork === option.value ? 'selected' : ''}`}
                          >
                            <input
                              type="radio"
                              name="canadaForeignWork"
                              value={option.value}
                              checked={formData.canadaForeignWork === option.value}
                              onChange={handleChange}
                              className="hidden"
                              required
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="form-section">
                      <h3>Brother or Sister Living in Canada*</h3>
                      <div className="form-options-grid">
                        {[
                          { value: 'no', label: 'No' },
                          { value: 'yes', label: 'Yes (Canadian citizen or PR, 18+ years)' }
                        ].map(option => (
                          <label 
                            key={option.value} 
                            className={`form-option ${formData.canadaSibling === option.value ? 'selected' : ''}`}
                          >
                            <input
                              type="radio"
                              name="canadaSibling"
                              value={option.value}
                              checked={formData.canadaSibling === option.value}
                              onChange={handleChange}
                              className="hidden"
                              required
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="form-section">
                      <h3>French Language Skills*</h3>
                      <div className="form-options-grid">
                        {[
                          { value: 'none', label: 'No French or below NCLC 7' },
                          { value: 'strong-weak-english', label: 'Strong French (NCLC 7+), Weak English (CLB 4-)' },
                          { value: 'strong-good-english', label: 'Strong French (NCLC 7+), Good English (CLB 5+)' }
                        ].map(option => (
                          <label 
                            key={option.value} 
                            className={`form-option ${formData.canadaFrench === option.value ? 'selected' : ''}`}
                          >
                            <input
                              type="radio"
                              name="canadaFrench"
                              value={option.value}
                              checked={formData.canadaFrench === option.value}
                              onChange={handleChange}
                              className="hidden"
                              required
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="form-section">
                      <h3>Post-secondary Education in Canada*</h3>
                      <div className="form-options-grid">
                        {[
                          { value: 'none', label: 'None' },
                          { value: '1-2-years', label: '1-2 year credential' },
                          { value: '3+years', label: '3+ year credential' }
                        ].map(option => (
                          <label 
                            key={option.value} 
                            className={`form-option ${formData.canadaStudy === option.value ? 'selected' : ''}`}
                          >
                            <input
                              type="radio"
                              name="canadaStudy"
                              value={option.value}
                              checked={formData.canadaStudy === option.value}
                              onChange={handleChange}
                              className="hidden"
                              required
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="form-section">
                      <h3>Provincial or Territorial Nomination*</h3>
                      <div className="form-options-grid">
                        {[
                          { value: 'no', label: 'No' },
                          { value: 'yes', label: 'Yes' }
                        ].map(option => (
                          <label 
                            key={option.value} 
                            className={`form-option ${formData.canadaNomination === option.value ? 'selected' : ''}`}
                          >
                            <input
                              type="radio"
                              name="canadaNomination"
                              value={option.value}
                              checked={formData.canadaNomination === option.value}
                              onChange={handleChange}
                              className="hidden"
                              required
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* Marital Status Question for Canada - Added before contact info */}
                    <div className="form-section">
                      <h3>Marital Status*</h3>
                      <div className="form-options-grid">
                        {[
                          { value: 'single', label: 'Single / Unmarried' },
                          { value: 'married', label: 'Married / Common-law Partner' }
                        ].map(option => (
                          <label 
                            key={option.value} 
                            className={`form-option ${formData.canadaMaritalStatus === option.value ? 'selected' : ''}`}
                          >
                            <input
                              type="radio"
                              name="canadaMaritalStatus"
                              value={option.value}
                              checked={formData.canadaMaritalStatus === option.value}
                              onChange={handleChange}
                              className="hidden"
                              required
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* Spouse fields - show only if married */}
                    {formData.canadaMaritalStatus === 'married' && (
                      <>
                        <div className="form-section">
                          <h3>Spouse's Level of Education*</h3>
                          <div className="form-options-grid">
                            {[
                              { value: 'none', label: 'Less than secondary school' },
                              { value: 'secondary', label: 'Secondary school' },
                              { value: 'one-year', label: 'One-year program' },
                              { value: 'two-year', label: 'Two-year program' },
                              { value: 'bachelor', label: "Bachelor's degree" },
                              { value: 'two-certificates', label: 'Two or more certificates' },
                              { value: 'master', label: "Master's degree" },
                              { value: 'doctorate', label: 'Doctoral degree' }
                            ].map(option => (
                              <label 
                                key={option.value} 
                                className={`form-option ${formData.canadaSpouseEducation === option.value ? 'selected' : ''}`}
                              >
                                <input
                                  type="radio"
                                  name="canadaSpouseEducation"
                                  value={option.value}
                                  checked={formData.canadaSpouseEducation === option.value}
                                  onChange={handleChange}
                                  className="hidden"
                                  required
                                />
                                {option.label}
                              </label>
                            ))}
                          </div>
                        </div>
                        
                        <div className="form-section">
                          <h3>Spouse's Official Language Proficiency*</h3>
                          <div className="form-options-grid">
                            {[
                              { value: 'none', label: 'CLB 4 or less' },
                              { value: 'clb5-6', label: 'CLB 5-6' },
                              { value: 'clb7-8', label: 'CLB 7-8' },
                              { value: 'clb9+', label: 'CLB 9+' }
                            ].map(option => (
                              <label 
                                key={option.value} 
                                className={`form-option ${formData.canadaSpouseLanguage === option.value ? 'selected' : ''}`}
                              >
                                <input
                                  type="radio"
                                  name="canadaSpouseLanguage"
                                  value={option.value}
                                  checked={formData.canadaSpouseLanguage === option.value}
                                  onChange={handleChange}
                                  className="hidden"
                                  required
                                />
                                {option.label}
                              </label>
                            ))}
                          </div>
                        </div>
                        
                        <div className="form-section">
                          <h3>Spouse's Canadian Work Experience*</h3>
                          <div className="form-options-grid">
                            {[
                              { value: 'none', label: 'None or less than 1 year' },
                              { value: '1-year', label: '1 year' },
                              { value: '2-years', label: '2 years' },
                              { value: '3-years', label: '3 years' },
                              { value: '4-years', label: '4 years' },
                              { value: '5+years', label: '5+ years' }
                            ].map(option => (
                              <label 
                                key={option.value} 
                                className={`form-option ${formData.canadaSpouseWork === option.value ? 'selected' : ''}`}
                              >
                                <input
                                  type="radio"
                                  name="canadaSpouseWork"
                                  value={option.value}
                                  checked={formData.canadaSpouseWork === option.value}
                                  onChange={handleChange}
                                  className="hidden"
                                  required
                                />
                                {option.label}
                              </label>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
                
                {/* Contact Information Section */}
                <div className="contact-information">
                  <div className="form-section">
                    <h3>Name*:</h3>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      pattern="[A-Za-z\s]+"
                      title="Only letters and spaces allowed"
                      required
                    />
                    {errors.name && <div className="error-message">{errors.name}</div>}
                  </div>
                  
                  <div className="contact-grid">
                    <div className="form-section">
                      <h3>Email*:</h3>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@email.com"
                        required
                      />
                      {errors.email && <div className="error-message">{errors.email}</div>}
                    </div>
                    
                    <div className="form-section">
                      <h3>Phone*:</h3>
                      <div className="phone-input">
                        <div className="country-code">
                          <select 
                            name="countryCode"
                            value={formData.countryCode}
                            onChange={handleChange}
                          >
                            {countryCodes.map(code => (
                              <option key={code.value} value={code.value}>
                                {code.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="1234567890"
                          pattern="\d*"
                          title="Only numbers allowed"
                          required
                        />
                      </div>
                      {errors.phone && <div className="error-message">{errors.phone}</div>}
                    </div>
                  </div>
                </div>
                
                <div className="submit-section">
                  <button
                    type="submit"
                    className="submit-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Calculating...' : 'Get the Report'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PRScoreCalculator;