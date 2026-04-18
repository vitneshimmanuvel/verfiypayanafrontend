import React, { useState } from 'react';
import './CanadaPRCalculator.css';

const CanadaPRCalculator = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '',
    maritalStatus: 'single',
    education: '',
    englishListening: '',
    englishReading: '',
    englishWriting: '',
    englishSpeaking: '',
    frenchListening: '',
    frenchReading: '',
    frenchWriting: '',
    frenchSpeaking: '',
    canadianWorkExperience: '',
    foreignWorkExperience: '',
    jobOffer: 'no',
    provincialNomination: 'no',
    siblingInCanada: 'no',
    spouseEducation: '',
    spouseEnglishListening: '',
    spouseEnglishReading: '',
    spouseEnglishWriting: '',
    spouseEnglishSpeaking: '',
    spouseCanadianWorkExperience: ''
  });
  
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  
  const calculateScore = () => {
    let calculatedScore = 0;
    
    // Age points
    if (formData.age >= 18 && formData.age <= 35) calculatedScore += 110;
    else if (formData.age > 35 && formData.age <= 45) calculatedScore += 80;
    else if (formData.age > 45) calculatedScore += 30;
    
    // Education points
    const educationPoints = {
      'lessThanSecondary': 0,
      'secondary': 30,
      'oneYear': 90,
      'twoYear': 98,
      'bachelor': 120,
      'twoCerts': 128,
      'masters': 135,
      'phd': 150
    };
    calculatedScore += educationPoints[formData.education] || 0;
    
    // Language points (English)
    const languagePoints = {
      'lessThan4': 0,
      '4': 40,
      '5': 60,
      '6': 80,
      '7': 100,
      '8': 120,
      '9': 130
    };
    
    calculatedScore += languagePoints[formData.englishListening] || 0;
    calculatedScore += languagePoints[formData.englishReading] || 0;
    calculatedScore += languagePoints[formData.englishWriting] || 0;
    calculatedScore += languagePoints[formData.englishSpeaking] || 0;
    
    // Work experience
    const workPoints = {
      'none': 0,
      '1year': 35,
      '2years': 46,
      '3years': 56,
      '4years': 63,
      '5years': 70,
      '6plus': 70
    };
    
    calculatedScore += workPoints[formData.canadianWorkExperience] || 0;
    calculatedScore += workPoints[formData.foreignWorkExperience] || 0 / 2;
    
    // Additional factors
    if (formData.jobOffer === 'yes-noc-0-a') calculatedScore += 200;
    else if (formData.jobOffer === 'yes-noc-b') calculatedScore += 50;
    
    if (formData.provincialNomination === 'yes') calculatedScore += 600;
    if (formData.siblingInCanada === 'yes') calculatedScore += 15;
    
    setScore(calculatedScore);
    setShowResult(true);
  };

  const resetCalculator = () => {
    setFormData({
      age: '',
      maritalStatus: 'single',
      education: '',
      englishListening: '',
      englishReading: '',
      englishWriting: '',
      englishSpeaking: '',
      frenchListening: '',
      frenchReading: '',
      frenchWriting: '',
      frenchSpeaking: '',
      canadianWorkExperience: '',
      foreignWorkExperience: '',
      jobOffer: 'no',
      provincialNomination: 'no',
      siblingInCanada: 'no',
      spouseEducation: '',
      spouseEnglishListening: '',
      spouseEnglishReading: '',
      spouseEnglishWriting: '',
      spouseEnglishSpeaking: '',
      spouseCanadianWorkExperience: ''
    });
    setStep(1);
    setShowResult(false);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="form-section">
            <h2>Personal Details</h2>
            <div className="form-group">
              <label>Age</label>
              <input 
                type="number" 
                name="age" 
                value={formData.age} 
                onChange={handleChange} 
                min="18" 
                max="100" 
                required 
              />
            </div>
            <div className="form-group">
              <label>Marital Status</label>
              <div className="radio-group">
                <label>
                  <input 
                    type="radio" 
                    name="maritalStatus" 
                    value="single" 
                    checked={formData.maritalStatus === 'single'} 
                    onChange={handleChange} 
                  />
                  Single
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="maritalStatus" 
                    value="married" 
                    checked={formData.maritalStatus === 'married'} 
                    onChange={handleChange} 
                  />
                  Married
                </label>
              </div>
            </div>
            <div className="navigation">
              <button type="button" onClick={nextStep}>Next</button>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="form-section">
            <h2>Education Level</h2>
            <div className="form-group">
              <label>What is your level of education?</label>
              <select name="education" value={formData.education} onChange={handleChange} required>
                <option value="">Select your education level</option>
                <option value="lessThanSecondary">Less than secondary school (high school)</option>
                <option value="secondary">Secondary diploma (high school graduation)</option>
                <option value="oneYear">One-year program at a university, college, trade or technical school, or other institute</option>
                <option value="twoYear">Two-year program at a university, college, trade or technical school, or other institute</option>
                <option value="bachelor">Bachelor's degree OR a three or more year program at a university, college, trade or technical school, or other institute</option>
                <option value="twoCerts">Two or more certificates, diplomas, or degrees. One must be for a program of three or more years</option>
                <option value="masters">Master's degree, OR professional degree needed to practice in a licensed profession</option>
                <option value="phd">Doctoral level university degree (Ph.D.)</option>
              </select>
            </div>
            <div className="navigation">
              <button type="button" onClick={prevStep}>Back</button>
              <button type="button" onClick={nextStep}>Next</button>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="form-section">
            <h2>English Language Proficiency (IELTS)</h2>
            <p>Enter your IELTS test scores for each ability</p>
            
            <div className="language-grid">
              <div className="form-group">
                <label>Listening</label>
                <select name="englishListening" value={formData.englishListening} onChange={handleChange} required>
                  <option value="">Select score</option>
                  <option value="lessThan4">Less than 4</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Reading</label>
                <select name="englishReading" value={formData.englishReading} onChange={handleChange} required>
                  <option value="">Select score</option>
                  <option value="lessThan4">Less than 4</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Writing</label>
                <select name="englishWriting" value={formData.englishWriting} onChange={handleChange} required>
                  <option value="">Select score</option>
                  <option value="lessThan4">Less than 4</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Speaking</label>
                <select name="englishSpeaking" value={formData.englishSpeaking} onChange={handleChange} required>
                  <option value="">Select score</option>
                  <option value="lessThan4">Less than 4</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                </select>
              </div>
            </div>
            
            <div className="navigation">
              <button type="button" onClick={prevStep}>Back</button>
              <button type="button" onClick={nextStep}>Next</button>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="form-section">
            <h2>French Language Proficiency (Optional)</h2>
            <p>Enter your French test scores (if any)</p>
            
            <div className="language-grid">
              <div className="form-group">
                <label>Listening</label>
                <select name="frenchListening" value={formData.frenchListening} onChange={handleChange}>
                  <option value="">Select score or skip</option>
                  <option value="lessThan4">Less than 4</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Reading</label>
                <select name="frenchReading" value={formData.frenchReading} onChange={handleChange}>
                  <option value="">Select score or skip</option>
                  <option value="lessThan4">Less than 4</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Writing</label>
                <select name="frenchWriting" value={formData.frenchWriting} onChange={handleChange}>
                  <option value="">Select score or skip</option>
                  <option value="lessThan4">Less than 4</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Speaking</label>
                <select name="frenchSpeaking" value={formData.frenchSpeaking} onChange={handleChange}>
                  <option value="">Select score or skip</option>
                  <option value="lessThan4">Less than 4</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                </select>
              </div>
            </div>
            
            <div className="navigation">
              <button type="button" onClick={prevStep}>Back</button>
              <button type="button" onClick={nextStep}>Next</button>
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="form-section">
            <h2>Work Experience</h2>
            
            <div className="form-group">
              <label>Canadian Work Experience</label>
              <select name="canadianWorkExperience" value={formData.canadianWorkExperience} onChange={handleChange} required>
                <option value="">Select years of experience</option>
                <option value="none">None or less than a year</option>
                <option value="1year">1 year</option>
                <option value="2years">2 years</option>
                <option value="3years">3 years</option>
                <option value="4years">4 years</option>
                <option value="5years">5 years</option>
                <option value="6plus">6 years or more</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Foreign Work Experience</label>
              <select name="foreignWorkExperience" value={formData.foreignWorkExperience} onChange={handleChange} required>
                <option value="">Select years of experience</option>
                <option value="none">None or less than a year</option>
                <option value="1year">1 year</option>
                <option value="2years">2 years</option>
                <option value="3years">3 years</option>
                <option value="4years">4 years</option>
                <option value="5years">5 years</option>
                <option value="6plus">6 years or more</option>
              </select>
            </div>
            
            <div className="navigation">
              <button type="button" onClick={prevStep}>Back</button>
              <button type="button" onClick={nextStep}>Next</button>
            </div>
          </div>
        );
        
      case 6:
        return (
          <div className="form-section">
            <h2>Job Offer and Provincial Nomination</h2>
            
            <div className="form-group">
              <label>Do you have a valid job offer from a Canadian employer?</label>
              <div className="radio-group">
                <label>
                  <input 
                    type="radio" 
                    name="jobOffer" 
                    value="no" 
                    checked={formData.jobOffer === 'no'} 
                    onChange={handleChange} 
                  />
                  No
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="jobOffer" 
                    value="yes-noc-0-a" 
                    checked={formData.jobOffer === 'yes-noc-0-a'} 
                    onChange={handleChange} 
                  />
                  Yes, in NOC 0, A
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="jobOffer" 
                    value="yes-noc-b" 
                    checked={formData.jobOffer === 'yes-noc-b'} 
                    onChange={handleChange} 
                  />
                  Yes, in NOC B
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label>Do you have a provincial nomination from a Canadian province or territory?</label>
              <div className="radio-group">
                <label>
                  <input 
                    type="radio" 
                    name="provincialNomination" 
                    value="no" 
                    checked={formData.provincialNomination === 'no'} 
                    onChange={handleChange} 
                  />
                  No
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="provincialNomination" 
                    value="yes" 
                    checked={formData.provincialNomination === 'yes'} 
                    onChange={handleChange} 
                  />
                  Yes
                </label>
              </div>
            </div>
            
            <div className="navigation">
              <button type="button" onClick={prevStep}>Back</button>
              <button type="button" onClick={nextStep}>Next</button>
            </div>
          </div>
        );
        
      case 7:
        return (
          <div className="form-section">
            <h2>Relatives in Canada</h2>
            
            <div className="form-group">
              <label>Do you have a sibling (brother or sister) living in Canada who is a citizen or permanent resident?</label>
              <div className="radio-group">
                <label>
                  <input 
                    type="radio" 
                    name="siblingInCanada" 
                    value="no" 
                    checked={formData.siblingInCanada === 'no'} 
                    onChange={handleChange} 
                  />
                  No
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="siblingInCanada" 
                    value="yes" 
                    checked={formData.siblingInCanada === 'yes'} 
                    onChange={handleChange} 
                  />
                  Yes
                </label>
              </div>
            </div>
            
            <div className="navigation">
              <button type="button" onClick={prevStep}>Back</button>
              <button type="button" onClick={nextStep}>Next</button>
            </div>
          </div>
        );
        
      case 8:
        if (formData.maritalStatus === 'married') {
          return (
            <div className="form-section">
              <h2>Spouse's Details</h2>
              
              <div className="form-group">
                <label>Spouse's Education Level</label>
                <select name="spouseEducation" value={formData.spouseEducation} onChange={handleChange}>
                  <option value="">Select your spouse's education level</option>
                  <option value="lessThanSecondary">Less than secondary school (high school)</option>
                  <option value="secondary">Secondary diploma (high school graduation)</option>
                  <option value="oneYear">One-year program at a university, college, trade or technical school, or other institute</option>
                  <option value="twoYear">Two-year program at a university, college, trade or technical school, or other institute</option>
                  <option value="bachelor">Bachelor's degree OR a three or more year program at a university, college, trade or technical school, or other institute</option>
                  <option value="twoCerts">Two or more certificates, diplomas, or degrees. One must be for a program of three or more years</option>
                  <option value="masters">Master's degree, OR professional degree needed to practice in a licensed profession</option>
                  <option value="phd">Doctoral level university degree (Ph.D.)</option>
                </select>
              </div>
              
              <h3>Spouse's English Language Proficiency (IELTS)</h3>
              <div className="language-grid">
                <div className="form-group">
                  <label>Listening</label>
                  <select name="spouseEnglishListening" value={formData.spouseEnglishListening} onChange={handleChange}>
                    <option value="">Select score</option>
                    <option value="lessThan4">Less than 4</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Reading</label>
                  <select name="spouseEnglishReading" value={formData.spouseEnglishReading} onChange={handleChange}>
                    <option value="">Select score</option>
                    <option value="lessThan4">Less than 4</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Writing</label>
                  <select name="spouseEnglishWriting" value={formData.spouseEnglishWriting} onChange={handleChange}>
                    <option value="">Select score</option>
                    <option value="lessThan4">Less than 4</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Speaking</label>
                  <select name="spouseEnglishSpeaking" value={formData.spouseEnglishSpeaking} onChange={handleChange}>
                    <option value="">Select score</option>
                    <option value="lessThan4">Less than 4</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>Spouse's Canadian Work Experience</label>
                <select name="spouseCanadianWorkExperience" value={formData.spouseCanadianWorkExperience} onChange={handleChange}>
                  <option value="">Select years of experience</option>
                  <option value="none">None or less than a year</option>
                  <option value="1year">1 year</option>
                  <option value="2years">2 years</option>
                  <option value="3years">3 years</option>
                  <option value="4years">4 years</option>
                  <option value="5years">5 years</option>
                  <option value="6plus">6 years or more</option>
                </select>
              </div>
              
              <div className="navigation">
                <button type="button" onClick={prevStep}>Back</button>
                <button type="button" onClick={calculateScore}>Calculate Score</button>
              </div>
            </div>
          );
        } else {
          // Skip spouse details if single
          calculateScore();
          return null;
        }
        
      default:
        return null;
    }
  };

  return (
    <div className="pr-calculator-container">
      <div className="calculator-header">
        <h1>Canada PR Score Calculator</h1>
        <p>Calculate your Comprehensive Ranking System (CRS) score for Express Entry</p>
      </div>
      
      {!showResult ? (
        <div className="calculator-steps">
          <div className="progress-bar">
            <div className="progress" style={{ width: `${(step / 8) * 100}%` }}></div>
            <div className="step-indicator">Step {step} of 8</div>
          </div>
          
          {renderStep()}
        </div>
      ) : (
        <div className="results-section">
          <div className="score-card">
            <div className="score-header">
              <h2>Your Canada PR Score</h2>
              <div className="score-value">{score}</div>
            </div>
            
            <div className="score-description">
              <p>Based on the information you provided, your Comprehensive Ranking System (CRS) score is <strong>{score}</strong>.</p>
              
              <div className="score-analysis">
                <h3>What does this score mean?</h3>
                <ul>
                  <li><strong>450+:</strong> Excellent chances for Express Entry invitation</li>
                  <li><strong>400-449:</strong> Good chances, especially for Provincial Nominee Programs</li>
                  <li><strong>350-399:</strong> Moderate chances, consider improving your score</li>
                  <li><strong>Below 350:</strong> Low chances, significant improvements needed</li>
                </ul>
              </div>
              
              <div className="recommendations">
                <h3>Ways to improve your score:</h3>
                <ul>
                  <li>Improve your language test scores (IELTS/CELPIP for English, TEF for French)</li>
                  <li>Gain additional work experience</li>
                  <li>Obtain a higher level of education</li>
                  <li>Secure a valid job offer from a Canadian employer</li>
                  <li>Get a provincial nomination</li>
                </ul>
              </div>
            </div>
            
            <div className="result-actions">
              <button onClick={resetCalculator}>Calculate Again</button>
              <button className="consultation-btn">Book Free Consultation</button>
            </div>
          </div>
        </div>
      )}
      
      <div className="calculator-footer">
        <p>Note: This calculator provides an estimate based on current CRS criteria. Actual scores may vary based on the latest immigration regulations.</p>
      </div>
    </div>
  );
};

export default CanadaPRCalculator;