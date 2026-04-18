import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { text: "Hi welcome to PayanaOverseas! How can I assist you today?", sender: 'bot' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [conversationState, setConversationState] = useState({
    step: 0,
    name: '',
    age: '',
    email: '',
    purpose: '',
    passport: '',
    resume: null,
    qualification: '',
    ugMajor: '', // New field for UG specialization
    workExperience: '', // New field for work experience (UG flows)
    experienceYears: '', // New field for experience years (UG flows)
    germanLanguageUG: '', // New field for German language (UG flows)
    examReadiness: '', // New field for FSP/KP exam readiness (Dentist flow)
    ugEmailSent: false, // New field to track UG program email status
    ugProgramContinue: '', // New field for UG program continuation
    ugProgramStartTime: '', // New field for UG program start time
    experience: '',
    interestedInCategories: '',
    germanLanguage: '',
    continueProgram: '',
    programStartTime: '',
    entryYear: '',
    appointmentType: '',
    appointmentTime: '',
    appointmentDate: '',
    appointmentConfirmed: false,
    emailSent: false,
    isProcessingEmail: false,
    needsFinancialSetup: false,
    financialJobSupport: '',
    // New flow tracking
    currentFlow: '', // 'standard', 'ug_dentist', 'ug_nurse', 'ug_engineering', 'ug_arts', 'ug_mbbs'
    isProcessingUGEmail: false
  });
  
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // API Configuration
  const API_BASE_URL = import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api`
    : 'http://localhost:5000/api';

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addMessage = (text, sender) => {
    setMessages(prev => [...prev, { text, sender }]);
  };

  // Enhanced error handling
  const handleApiError = (error, context) => {
    console.error(`❌ ${context} error:`, error);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return "Unable to connect to server. Please check your internet connection.";
    } else if (error.message.includes('500')) {
      return "Server error occurred. Our team has been notified.";
    } else if (error.message.includes('400')) {
      return "Invalid request. Please try again.";
    } else {
      return "Technical issue occurred. Our team will contact you soon.";
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateName = (name) => {
    return /^[a-zA-Z\s]+$/.test(name.trim()) && name.trim().length >= 2;
  };

  const validateAge = (age) => {
    const numAge = parseInt(age);
    return !isNaN(numAge) && numAge >= 16 && numAge <= 65;
  };

  const handleUserInput = () => {
    if (!userInput.trim()) return;
    
    addMessage(userInput, 'user');
    processUserResponse(userInput.trim());
    setUserInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleUserInput();
    }
  };

  const handleOptionClick = (option) => {
    addMessage(option, 'user');
    processUserResponse(option);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileName = file.name;
      
      setConversationState(prev => ({
        ...prev,
        resume: fileName,
        step: 7
      }));
      
      addMessage(`Resume uploaded: ${fileName}`, 'user');
      setTimeout(() => addMessage("What is your highest qualification?", 'bot'), 500);
    }
    e.target.value = null;
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Navigation functions
  const navigateToPayanaOverseas = () => {
    window.open('https://payanaoverseas.com', '_blank');
  };

  const navigateToSettlo = () => {
    window.open('https://settlo.com', '_blank');
  };

  // New UG Program Email function
  const sendUGProgramEmail = async (emailData) => {
    try {
      addMessage("📧 Sending your UG Program details to our team...", 'bot');
      
      const response = await fetch(`${API_BASE_URL}/send-ug-program-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        console.log('✅ UG Program email sent successfully:', result);
        
        addMessage("✅ Great! Your details have been sent to our team. You'll receive a confirmation email shortly!", 'bot');
        
        setTimeout(() => {
          addMessage(`📧 Email sent at: ${new Date(result.data.timestamp).toLocaleTimeString()}`, 'bot');
        }, 1000);
        
        return true;
      } else {
        console.error('❌ Failed to send UG Program email:', result);
        const errorMsg = result.message || "There was an issue sending your details";
        addMessage(`⚠️ ${errorMsg}, but don't worry - our team has your information and will contact you soon!`, 'bot');
        return false;
      }
      
    } catch (error) {
      console.error('❌ Error sending UG Program email:', error);
      const errorMessage = handleApiError(error, 'UG Program Email');
      addMessage(`⚠️ ${errorMessage}`, 'bot');
      return false;
    }
  };

  // Updated German Program Email function (existing)
  const sendGermanProgramEmail = async (emailData) => {
    try {
      addMessage("📧 Sending your German Program details to our team...", 'bot');
      
      const response = await fetch(`${API_BASE_URL}/send-german-program-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        console.log('✅ German Program email sent successfully:', result);
        
        addMessage("✅ Great! Your details have been sent to our team. You'll receive a confirmation email shortly!", 'bot');
        
        setTimeout(() => {
          addMessage(`📧 Email sent at: ${new Date(result.data.timestamp).toLocaleTimeString()}`, 'bot');
        }, 1000);
        
        return true;
      } else {
        console.error('❌ Failed to send German Program email:', result);
        const errorMsg = result.message || "There was an issue sending your details";
        addMessage(`⚠️ ${errorMsg}, but don't worry - our team has your information and will contact you soon!`, 'bot');
        return false;
      }
      
    } catch (error) {
      console.error('❌ Error sending German Program email:', error);
      const errorMessage = handleApiError(error, 'German Program Email');
      addMessage(`⚠️ ${errorMessage}`, 'bot');
      return false;
    }
  };

  // Updated meeting scheduling function (existing)
  const scheduleGoogleMeeting = async (meetingData) => {
    try {
      addMessage("📅 Scheduling your Google Meet appointment...", 'bot');
      
      const response = await fetch(`${API_BASE_URL}/schedule-meeting`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(meetingData)
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        console.log('✅ Meeting scheduled successfully:', result);
        
        addMessage(`✅ Meeting scheduled successfully!`, 'bot');
        
        setTimeout(() => {
          const meetingInfo = `
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 10px 0;">
              <h4 style="color: #1976d2; margin: 0 0 10px 0;">📅 Meeting Details</h4>
              <p style="margin: 5px 0;"><strong>📧 Google Meet link sent to:</strong> ${result.data.email}</p>
              <p style="margin: 5px 0;"><strong>📅 Date:</strong> ${result.data.date}</p>
              <p style="margin: 10px 0 0 0; color: #666;">Please check your email for the meeting link!</p>
            </div>
          `;
          addMessage(meetingInfo, 'bot');
        }, 1000);
        
        return result;
      } else {
        console.error('❌ Failed to schedule meeting:', result);
        const errorMsg = result.message || "There was an issue scheduling the meeting";
        addMessage(`⚠️ ${errorMsg}, but our team will contact you to arrange it manually.`, 'bot');
        return null;
      }
      
    } catch (error) {
      console.error('❌ Error scheduling meeting:', error);
      const errorMessage = handleApiError(error, 'Meeting Scheduling');
      addMessage(`⚠️ ${errorMessage}`, 'bot');
      return null;
    }
  };

  const processUserResponse = (response) => {
    const { step, currentFlow } = conversationState;
    
    switch(step) {
      case 0: // Initial greeting
        addMessage("Great! Let's get started. Please enter your full name:", 'bot');
        setConversationState(prev => ({ ...prev, step: 1 }));
        break;
        
      case 1: // Name input
        if (validateName(response)) {
          setConversationState(prev => ({
            ...prev,
            step: 2,
            name: response.trim()
          }));
          setTimeout(() => addMessage(`Thanks ${response.trim()}! What's your age?`, 'bot'), 300);
        } else {
          addMessage("Please enter a valid name (at least 2 letters, letters and spaces only)", 'bot');
        }
        break;
        
      case 2: // Age input
        if (validateAge(response)) {
          setConversationState(prev => ({
            ...prev,
            step: 3,
            age: response
          }));
          setTimeout(() => addMessage("Please share your email address:", 'bot'), 300);
        } else {
          addMessage("Please enter a valid age (between 16-65 years)", 'bot');
        }
        break;
        
      case 3: // Email input
        if (validateEmail(response)) {
          setConversationState(prev => ({
            ...prev,
            step: 4,
            email: response.toLowerCase()
          }));
          setTimeout(() => addMessage("Are you looking to Study or Work abroad?", 'bot'), 300);
        } else {
          addMessage("Please enter a valid email address (e.g., example@gmail.com)", 'bot');
        }
        break;
        
      case 4: // Purpose selection - Only Work allowed
        if (response === 'Work') {
          setConversationState(prev => ({
            ...prev,
            step: 5,
            purpose: response
          }));
          setTimeout(() => addMessage("Do you have a valid passport?", 'bot'), 300);
        } else if (response === 'Study') {
          addMessage("Study option is currently not available. Please select Work to continue.", 'bot');
        } else {
          addMessage("Please select either Study or Work", 'bot');
        }
        break;
        
      case 5: // Passport question
        if (response === 'Yes' || response === 'No') {
          setConversationState(prev => ({
            ...prev,
            passport: response,
            step: response === 'No' ? 19 : 6, // Go to financial setup flow if no passport
            needsFinancialSetup: response === 'No'
          }));
          
          if (response === 'No') {
            setTimeout(() => {
              addMessage("You have some time to make financial setups. Now you have to start learning German language now.", 'bot');
              setTimeout(() => addMessage("Ready to start your journey?", 'bot'), 1000);
            }, 300);
          } else {
            setTimeout(() => addMessage("Do you have a resume to upload?", 'bot'), 300);
          }
        } else {
          addMessage("Please select either Yes or No", 'bot');
        }
        break;
        
      case 6: // Resume handling
        if (response === 'Upload Resume') {
          triggerFileInput();
        } else if (response === 'No Resume') {
          setConversationState(prev => ({
            ...prev,
            resume: 'No resume',
            step: 7
          }));
          setTimeout(() => addMessage("What is your highest qualification?", 'bot'), 300);
        } else {
          addMessage("Please select an option", 'bot');
        }
        break;
        
      case 7: // Qualification - ENHANCED WITH UG MAJOR FLOW
        const qualifications = ["12th Completed", "UG Completed", "PG Completed"];
        if (qualifications.includes(response)) {
          setConversationState(prev => ({
            ...prev,
            qualification: response,
            step: response === "UG Completed" ? 22 : 8, // New step for UG Major selection
            currentFlow: response === "UG Completed" ? 'ug_selection' : 'standard'
          }));
          
          if (response === "UG Completed") {
            setTimeout(() => addMessage("What is your UG major?", 'bot'), 300);
          } else {
            setTimeout(() => addMessage("How many years of work experience do you have?", 'bot'), 300);
          }
        } else {
          addMessage("Please select a qualification from the options", 'bot');
        }
        break;

      // NEW CASES FOR UG MAJOR FLOW
      case 22: // UG Major selection
        const ugMajors = ["Nurses", "Dentist", "Engineering", "Arts Background", "MBBS"];
        if (ugMajors.includes(response)) {
          setConversationState(prev => ({
            ...prev,
            ugMajor: response,
            step: 23,
            currentFlow: `ug_${response.toLowerCase()}`
          }));
          setTimeout(() => addMessage("Do you have any work experience?", 'bot'), 300);
        } else {
          addMessage("Please select a UG major from the options", 'bot');
        }
        break;

      case 23: // Work experience for UG majors
        if (response === 'Yes' || response === 'No') {
          setConversationState(prev => ({
            ...prev,
            workExperience: response,
            step: response === 'Yes' ? 24 : 25
          }));
          
          if (response === 'Yes') {
            setTimeout(() => addMessage("How many years of experience?", 'bot'), 300);
          } else {
            // Skip to German language question for no experience
            setTimeout(() => {
              if (conversationState.ugMajor === 'Dentist') {
                addMessage("Are you willing to learn German language and ready to clear FSP and KP exams?", 'bot');
              } else {
                addMessage("Are you willing to learn German language?", 'bot');
              }
            }, 300);
          }
        } else {
          addMessage("Please select either Yes or No", 'bot');
        }
        break;

      case 24: // Experience years for UG majors
        const experienceYears = ["1-2yr", "2-3yr", "3-5yr", "5+yr"];
        if (experienceYears.includes(response)) {
          setConversationState(prev => ({
            ...prev,
            experienceYears: response,
            step: 25
          }));
          setTimeout(() => {
            if (conversationState.ugMajor === 'Dentist') {
              addMessage("Are you willing to learn German language and ready to clear FSP and KP exams?", 'bot');
            } else {
              addMessage("Are you willing to learn German language?", 'bot');
            }
          }, 300);
        } else {
          addMessage("Please select an experience level", 'bot');
        }
        break;

      case 25: // German language and exam readiness (UG flows)
        if (response === 'Yes' || response === 'No') {
          setConversationState(prev => ({
            ...prev,
            germanLanguageUG: response,
            examReadiness: response, // For dentist flow
            step: response === 'Yes' ? 26 : 29,
            isProcessingUGEmail: response === 'Yes'
          }));
          
          if (response === 'Yes') {
            // Send UG program email based on major
            setTimeout(async () => {
              const ugEmailData = {
                name: conversationState.name,
                age: conversationState.age,
                email: conversationState.email,
                qualification: conversationState.qualification,
                ugMajor: conversationState.ugMajor,
                workExperience: conversationState.workExperience,
                experienceYears: conversationState.experienceYears,
                germanLanguageUG: response,
                examReadiness: response
              };
              
              const emailSent = await sendUGProgramEmail(ugEmailData);
              
              setConversationState(prev => ({
                ...prev,
                step: 27,
                ugEmailSent: emailSent,
                isProcessingUGEmail: false
              }));
              
              setTimeout(() => {
                addMessage("Please kindly check your mail. Can you continue with this program?", 'bot');
              }, 1500);
            }, 500);
          } else {
            setTimeout(() => {
              addMessage("No problem! Please enter your email correctly and we'll send you alternative opportunities.", 'bot');
            }, 300);
          }
        } else {
          addMessage("Please select either Yes or No", 'bot');
        }
        break;

      case 26: // Processing UG email (automatic transition)
        // This case is handled automatically in case 25
        break;

      case 27: // Continue with UG program
        if (response === 'Yes' || response === 'No') {
          setConversationState(prev => ({
            ...prev,
            ugProgramContinue: response,
            step: response === 'Yes' ? 28 : 29
          }));
          
          if (response === 'Yes') {
            setTimeout(() => addMessage("When can you kick start your program?", 'bot'), 300);
          } else {
            setTimeout(() => {
              addMessage("No problem! Our team will still contact you to discuss other opportunities that might interest you.", 'bot');
              setTimeout(() => showSummary(), 1000);
            }, 300);
          }
        } else {
          addMessage("Please select either Yes or No", 'bot');
        }
        break;

      case 28: // UG Program start timing
        const ugStartTimes = ["Immediately", "Need some time", "Need more clarification"];
        if (ugStartTimes.includes(response)) {
          setConversationState(prev => ({
            ...prev,
            ugProgramStartTime: response,
            step: response === "Need more clarification" ? 13 : (response === "Need some time" ? 18 : 21) // Connect to existing flow
          }));
          
          if (response === "Need more clarification") {
            setTimeout(() => addMessage("Would you like to schedule a consultation call with our expert?", 'bot'), 300);
          } else if (response === "Need some time") {
            setTimeout(() => addMessage("When do you want to enter into Germany?", 'bot'), 300);
          } else {
            setTimeout(() => {
              addMessage("Perfect! Our team will contact you soon to begin the process.", 'bot');
              setTimeout(() => showSummary(), 1000);
            }, 300);
          }
        } else {
          addMessage("Please select an option", 'bot');
        }
        break;

      case 29: // Email correction for UG flows
        if (validateEmail(response)) {
          setConversationState(prev => ({
            ...prev,
            email: response.toLowerCase(),
            step: 30
          }));
          setTimeout(() => {
            addMessage("Thank you! Our team will contact you with suitable opportunities for your background.", 'bot');
            setTimeout(() => showSummary(), 1000);
          }, 300);
        } else {
          addMessage("Please enter a valid email address", 'bot');
        }
        break;

      // EXISTING CASES (8-21) remain the same...
      case 8: // Work experience (standard flow)
        const experiences = ["No experience", "1-2yr", "2-3yr", "3-5yr", "5+yr"];
        if (experiences.includes(response)) {
          setConversationState(prev => ({
            ...prev,
            step: 9,
            experience: response
          }));
          setTimeout(() => addMessage("Are you interested in any of these categories?", 'bot'), 300);
        } else {
          addMessage("Please select an experience level", 'bot');
        }
        break;
        
      case 9: // Interested in categories
        if (response === 'Yes' || response === 'No') {
          setConversationState(prev => ({
            ...prev,
            step: 10,
            interestedInCategories: response
          }));
          setTimeout(() => addMessage("Are you ready to learn the German language?", 'bot'), 300);
        } else {
          addMessage("Please select either Yes or No", 'bot');
        }
        break;
        
      case 10: // German language - Send email here and wait for completion
        if (response === 'Yes' || response === 'No') {
          // Set processing state to prevent next question
          setConversationState(prev => ({
            ...prev,
            germanLanguage: response,
            isProcessingEmail: true
          }));
          
          // Prepare email data with only original fields (not new ones)
          const emailData = {
            name: conversationState.name,
            age: conversationState.age,
            email: conversationState.email,
            purpose: conversationState.purpose,
            passport: conversationState.passport,
            resume: conversationState.resume,
            qualification: conversationState.qualification,
            experience: conversationState.experience,
            interestedInCategories: conversationState.interestedInCategories,
            germanLanguage: response
          };
          
          // Send email and wait for completion before proceeding
          setTimeout(async () => {
            const emailSent = await sendGermanProgramEmail(emailData);
            
            // After email process completes, update state and proceed
            setConversationState(prev => ({
              ...prev,
              step: 11,
              emailSent: emailSent,
              isProcessingEmail: false
            }));
            
            // Continue with next question after email process
            setTimeout(() => {
              addMessage("Can you continue with this program?", 'bot');
            }, 1500);
          }, 500);
          
        } else {
          addMessage("Please select either Yes or No", 'bot');
        }
        break;
        
      case 11: // Continue program
        if (response === 'Yes' || response === 'No') {
          setConversationState(prev => ({
            ...prev,
            step: 12,
            continueProgram: response
          }));
          
          if (response === 'Yes') {
            setTimeout(() => addMessage("When can you kick start your program?", 'bot'), 300);
          } else {
            setTimeout(() => {
              addMessage("No problem! Our team will still contact you to discuss other opportunities that might interest you.", 'bot');
              setTimeout(() => showSummary(), 1000);
            }, 300);
          }
        } else {
          addMessage("Please select either Yes or No", 'bot');
        }
        break;
        
      case 12: // Program start timing
        const startTimes = ["Immediately", "Need some time", "Need more clarification"];
        if (startTimes.includes(response)) {
          setConversationState(prev => ({
            ...prev,
            programStartTime: response,
            step: response === "Need more clarification" ? 13 : (response === "Need some time" ? 18 : 16)
          }));
          
          if (response === "Need more clarification") {
            setTimeout(() => addMessage("Would you like to schedule a consultation call with our expert?", 'bot'), 300);
          } else if (response === "Need some time") {
            setTimeout(() => addMessage("When do you want to enter into Germany?", 'bot'), 300);
          } else {
            setTimeout(() => {
              addMessage("Perfect! Our team will contact you soon to begin the process.", 'bot');
              setTimeout(() => showSummary(), 1000);
            }, 300);
          }
        } else {
          addMessage("Please select an option", 'bot');
        }
        break;
        
      case 13: // Schedule consultation
        if (response === 'Yes') {
          setConversationState(prev => ({
            ...prev,
            step: 14
          }));
          setTimeout(() => addMessage("How would you prefer to have your consultation?", 'bot'), 300);
        } else {
          setTimeout(() => {
            addMessage("No problem! Our team will contact you via email and phone.", 'bot');
            setTimeout(() => showSummary(), 1000);
          }, 300);
        }
        break;
        
      case 14: // Appointment type
        if (response === 'In-person appointment' || response === 'Google Meet appointment') {
          setConversationState(prev => ({
            ...prev,
            appointmentType: response,
            step: response === 'In-person appointment' ? 20 : 15
          }));
          
          if (response === 'In-person appointment') {
            setTimeout(() => {
              addMessage("Perfect! Our office is located at:", 'bot');
              addMessage("📍 Payana Overseas Solutions<br>Manipal Centre, Dickenson Rd, Bangalore - 560042", 'bot');
              setTimeout(() => addMessage("Do you need local financial job support to achieve your abroad dream?", 'bot'), 1000);
            }, 300);
          } else {
            setTimeout(() => addMessage("What time works best for you?", 'bot'), 300);
          }
        } else {
          addMessage("Please select an appointment type", 'bot');
        }
        break;
        
      case 15: // Time selection for online appointment
        if (response === 'Morning' || response === 'Evening') {
          setConversationState(prev => ({
            ...prev,
            appointmentTime: response,
            step: 16
          }));
          setTimeout(() => addMessage("Please choose your preferred date (format: YYYY-MM-DD):", 'bot'), 300);
        } else {
          addMessage("Please select either Morning or Evening", 'bot');
        }
        break;
        
      case 16: // Date selection for Google Meet
        if (conversationState.appointmentType === 'Google Meet appointment') {
          if (/^\d{4}-\d{2}-\d{2}$/.test(response)) {
            const inputDate = new Date(response);
            const today = new Date();
            
            if (inputDate >= today) {
              setConversationState(prev => ({
                ...prev,
                appointmentDate: response,
                step: 17
              }));
              
              setTimeout(() => {
                addMessage(`Perfect! Your ${conversationState.appointmentTime.toLowerCase()} appointment is scheduled for ${response}`, 'bot');
                addMessage("Would you like to confirm this appointment?", 'bot');
              }, 300);
            } else {
              addMessage("Please enter a future date", 'bot');
            }
          } else {
            addMessage("Please enter date in YYYY-MM-DD format (e.g., 2025-08-15)", 'bot');
          }
        } else {
          // For in-person appointments, just show summary
          setTimeout(() => showSummary(), 300);
        }
        break;
        
      case 17: // Final confirmation for Google Meet
        if (response === 'Confirm' || response === 'Yes') {
          setConversationState(prev => ({
            ...prev,
            appointmentConfirmed: true,
            step: 21
          }));
          
          // Schedule Google Meet
          const meetingData = {
            name: conversationState.name,
            email: conversationState.email,
            date: conversationState.appointmentDate,
            time: conversationState.appointmentTime === 'Morning' ? '11:00' : '16:00',
            timeSlot: conversationState.appointmentTime === 'Morning' ? '11:00 AM' : '4:00 PM'
          };
          
          setTimeout(async () => {
            const meetingResult = await scheduleGoogleMeeting(meetingData);
            
            setTimeout(() => showSummary(), 1000);
          }, 500);
          
        } else {
          setTimeout(() => {
            addMessage("No problem! Our team will contact you to arrange the meeting.", 'bot');
            setTimeout(() => showSummary(), 1000);
          }, 300);
        }
        break;

      case 18: // Germany entry year selection
        const entryYears = ["2025", "2026", "2027"];
        if (entryYears.includes(response)) {
          setConversationState(prev => ({
            ...prev,
            entryYear: response,
            step: response === "2025" ? 21 : 19
          }));
          
          if (response === "2025") {
            setTimeout(() => {
              addMessage("Great! We will connect you soon for 2025 entry.", 'bot');
              setTimeout(() => showSummary(), 1000);
            }, 300);
          } else {
            setTimeout(() => {
              addMessage("You have some time to make financial setups. Now you have to start learning German language now.", 'bot');
              setTimeout(() => addMessage("Ready to start your journey?", 'bot'), 1000);
            }, 300);
          }
        } else {
          addMessage("Please select a year", 'bot');
        }
        break;

      case 19: // No passport flow or 2026/2027 flow - ready to start journey
        if (response === 'Yes' || response === 'Claim Free Passport' || response === 'Register Now') {
          if (response === 'Claim Free Passport') {
            // Open PayanaOverseas website
            setTimeout(() => {
              navigateToPayanaOverseas();
              addMessage("Opening PayanaOverseas website for passport assistance...", 'bot');
              setTimeout(() => showSummary(), 1000);
            }, 300);
          } else if (response === 'Register Now') {
            // Open PayanaOverseas website
            setTimeout(() => {
              navigateToPayanaOverseas();
              addMessage("Opening PayanaOverseas website for registration...", 'bot');
              setTimeout(() => showSummary(), 1000);
            }, 300);
          } else {
            setTimeout(() => showSummary(), 300);
          }
        } else {
          addMessage("Please select an option", 'bot');
        }
        break;

      case 20: // Financial job support question (for in-person appointments)
        if (response === 'Yes' || response === 'Contact Settlo Team') {
          setConversationState(prev => ({
            ...prev,
            financialJobSupport: response,
            step: 21
          }));
          
          if (response === 'Contact Settlo Team') {
            setTimeout(() => {
              navigateToSettlo();
              addMessage("Opening Settlo website for financial job support...", 'bot');
              setTimeout(() => {
                addMessage("Our team will call you to confirm the appointment timing.", 'bot');
                setTimeout(() => showSummary(), 1000);
              }, 1000);
            }, 300);
          } else {
            setTimeout(() => {
              addMessage("Great! Our team will call you to confirm the appointment timing and discuss financial support options.", 'bot');
              setTimeout(() => showSummary(), 1000);
            }, 300);
          }
        } else if (response === 'No') {
          setConversationState(prev => ({
            ...prev,
            financialJobSupport: response,
            step: 21
          }));
          setTimeout(() => {
            addMessage("No problem! Our team will call you to confirm the appointment timing.", 'bot');
            setTimeout(() => showSummary(), 1000);
          }, 300);
        } else {
          addMessage("Please select an option", 'bot');
        }
        break;
        
      default:
        showSummary();
    }
  };

  const showSummary = () => {
    const { 
      name, age, purpose, passport, email, resume, qualification, ugMajor,
      workExperience, experienceYears, germanLanguageUG, examReadiness,
      ugProgramContinue, ugProgramStartTime, experience, interestedInCategories, 
      germanLanguage, continueProgram, programStartTime, appointmentType, 
      appointmentTime, appointmentDate, appointmentConfirmed, currentFlow
    } = conversationState;
    
    let summary = `
      <div style="background: linear-gradient(135deg, #f8f9fa, #e9ecef); padding: 20px; border-radius: 12px; margin: 10px 0;">
        <h3 style="color: #e60023; margin-bottom: 15px; font-size: 1.1rem;">📋 Summary of Your Information</h3>
        <div style="line-height: 1.6;">
          <strong>👤 Name:</strong> ${name}<br>
          <strong>🎂 Age:</strong> ${age}<br>
          <strong>📧 Email:</strong> ${email}<br>
          <strong>🎯 Purpose:</strong> ${purpose}<br>
          <strong>📘 Passport:</strong> ${passport}<br>
          <strong>📄 Resume:</strong> ${resume || 'Not provided'}<br>
          <strong>🎓 Qualification:</strong> ${qualification}<br>
    `;
    
    // Add UG Major details if applicable
    if (currentFlow && currentFlow.startsWith('ug_')) {
      summary += `
          <strong>🎯 UG Major:</strong> ${ugMajor}<br>
          <strong>💼 Work Experience:</strong> ${workExperience}<br>
      `;
      if (experienceYears) {
        summary += `<strong>📅 Experience Years:</strong> ${experienceYears}<br>`;
      }
      summary += `
          <strong>🇩🇪 German Language & Exam Readiness:</strong> ${germanLanguageUG}<br>
          <strong>📋 Continue UG Program:</strong> ${ugProgramContinue}<br>
      `;
      if (ugProgramStartTime) {
        summary += `<strong>⏰ UG Program Start:</strong> ${ugProgramStartTime}<br>`;
      }
    } else {
      // Standard flow details
      summary += `
          <strong>💼 Experience:</strong> ${experience}<br>
          <strong>📈 Interested in categories:</strong> ${interestedInCategories}<br>
          <strong>🇩🇪 German language:</strong> ${germanLanguage}<br>
          <strong>📋 Continue program:</strong> ${continueProgram}<br>
      `;
      if (programStartTime) {
        summary += `<strong>⏰ Program Start:</strong> ${programStartTime}<br>`;
      }
    }
    
    if (appointmentType) {
      summary += `
          <strong>📞 Appointment:</strong> ${appointmentType}<br>
          ${appointmentTime ? `<strong>🕒 Time:</strong> ${appointmentTime}<br>` : ''}
          ${appointmentDate ? `<strong>📅 Date:</strong> ${appointmentDate}<br>` : ''}
          <strong>✅ Status:</strong> ${appointmentConfirmed ? 'Confirmed ✓' : 'Pending'}<br>
      `;
    }
    
    summary += `
        </div>
      </div>
    `;
    
    addMessage(summary, 'bot');
    
    // Different closing message based on flow and email status
    if (currentFlow && currentFlow.startsWith('ug_') && conversationState.ugEmailSent) {
      addMessage(`🎉 Thank you ${name}! Your ${ugMajor} program details have been sent to our specialized team.<br><br>📞 For immediate assistance: <strong>+91 9003619777</strong><br><br>🌟 We're excited to help you achieve your dreams of working in Germany with your ${ugMajor} background!`, 'bot');
    } else if (conversationState.emailSent) {
      addMessage(`🎉 Thank you ${name}! Your details have been sent to our German Program team.<br><br>📞 For immediate assistance: <strong>+91 9003619777</strong><br><br>🌟 We're excited to help you achieve your dreams of working in Germany!`, 'bot');
    } else {
      addMessage(`🙏 Thank you ${name}! Our team will contact you shortly at ${email}.<br><br>📞 For immediate assistance: <strong>+91 9003619777</strong><br><br>🌟 We're excited to help you achieve your dreams of working abroad!`, 'bot');
    }
  };

  const isInputDisabled = () => {
    const disabledSteps = [4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 17, 18, 19, 20, 22, 23, 24, 25, 27, 28];
    // Also disable when processing email
    return disabledSteps.includes(conversationState.step) || 
           conversationState.isProcessingEmail || 
           conversationState.isProcessingUGEmail;
  };

  const shouldShowOptions = () => {
    // Don't show options when processing email
    return !conversationState.isProcessingEmail && !conversationState.isProcessingUGEmail;
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-content">
          <div className="company-logo">
            <span className="logo-icon">🌍</span>
            PayanaOverseas
          </div>
        </div>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`message ${msg.sender === 'bot' ? 'bot-message' : 'user-message'}`}
            dangerouslySetInnerHTML={{ __html: msg.text }}
          />
        ))}
        
        {/* Dynamic options based on conversation step - Only show when not processing email */}
        {shouldShowOptions() && conversationState.step === 4 && (
          <div className="options-container">
            <button className="option-btn work-btn" onClick={() => handleOptionClick('Work')}>
              💼 Work
            </button>
            <button className="option-btn study-btn disabled" disabled>
              📚 Study 
            </button>
          </div>
        )}
        
        {shouldShowOptions() && conversationState.step === 5 && (
          <div className="options-container">
            <button className="option-btn yes-btn" onClick={() => handleOptionClick('Yes')}>
              ✅ Yes
            </button>
            <button className="option-btn no-btn" onClick={() => handleOptionClick('No')}>
              ❌ No
            </button>
          </div>
        )}
        
        {shouldShowOptions() && conversationState.step === 6 && (
          <div className="options-container">
            <button className="option-btn upload-btn" onClick={() => handleOptionClick('Upload Resume')}>
              📄 Upload Resume
            </button>
            <button className="option-btn no-resume-btn" onClick={() => handleOptionClick('No Resume')}>
              🚫 No Resume
            </button>
          </div>
        )}
        
        {shouldShowOptions() && conversationState.step === 7 && (
          <div className="options-container">
            <button className="option-btn" onClick={() => handleOptionClick('12th Completed')}>
              🎓 12th Completed
            </button>
            <button className="option-btn" onClick={() => handleOptionClick('UG Completed')}>
              🎓 UG Completed
            </button>
            <button className="option-btn" onClick={() => handleOptionClick('PG Completed')}>
              🎓 PG Completed
            </button>
          </div>
        )}

        {/* NEW OPTIONS FOR UG MAJOR SELECTION */}
        {shouldShowOptions() && conversationState.step === 22 && (
          <div className="options-container">
            <button className="option-btn" onClick={() => handleOptionClick('Nurses')}>
              👩‍⚕️ Nurses
            </button>
            <button className="option-btn" onClick={() => handleOptionClick('Dentist')}>
              🦷 Dentist
            </button>
            <button className="option-btn" onClick={() => handleOptionClick('Engineering')}>
              ⚙️ Engineering
            </button>
            <button className="option-btn" onClick={() => handleOptionClick('Arts Background')}>
              🎨 Arts Background
            </button>
            <button className="option-btn" onClick={() => handleOptionClick('MBBS')}>
              🩺 MBBS
            </button>
          </div>
        )}

        {/* OPTIONS FOR UG WORK EXPERIENCE */}
        {shouldShowOptions() && (conversationState.step === 23 || conversationState.step === 25) && (
          <div className="options-container">
            <button className="option-btn yes-btn" onClick={() => handleOptionClick('Yes')}>
              ✅ Yes
            </button>
            <button className="option-btn no-btn" onClick={() => handleOptionClick('No')}>
              ❌ No
            </button>
          </div>
        )}

        {/* OPTIONS FOR UG EXPERIENCE YEARS */}
        {shouldShowOptions() && conversationState.step === 24 && (
          <div className="options-container">
            <button className="option-btn" onClick={() => handleOptionClick('1-2yr')}>
              📈 1-2 Years
            </button>
            <button className="option-btn" onClick={() => handleOptionClick('2-3yr')}>
              📊 2-3 Years
            </button>
            <button className="option-btn" onClick={() => handleOptionClick('3-5yr')}>
              📈 3-5 Years
            </button>
            <button className="option-btn" onClick={() => handleOptionClick('5+yr')}>
              🏆 5+ Years
            </button>
          </div>
        )}

        {/* OPTIONS FOR UG PROGRAM CONTINUATION */}
        {shouldShowOptions() && conversationState.step === 27 && (
          <div className="options-container">
            <button className="option-btn yes-btn" onClick={() => handleOptionClick('Yes')}>
              ✅ Yes
            </button>
            <button className="option-btn no-btn" onClick={() => handleOptionClick('No')}>
              ❌ No
            </button>
          </div>
        )}

        {/* OPTIONS FOR UG PROGRAM START TIME */}
        {shouldShowOptions() && conversationState.step === 28 && (
          <div className="options-container">
            <button className="option-btn immediate-btn" onClick={() => handleOptionClick('Immediately')}>
              ⚡ Immediately
            </button>
            <button className="option-btn time-btn" onClick={() => handleOptionClick('Need some time')}>
              ⏳ Need Time
            </button>
            <button className="option-btn clarify-btn" onClick={() => handleOptionClick('Need more clarification')}>
              ❓ Need Clarification
            </button>
          </div>
        )}
        
        {/* EXISTING OPTIONS FOR STANDARD FLOW */}
        {shouldShowOptions() && conversationState.step === 8 && (
          <div className="options-container">
            <button className="option-btn" onClick={() => handleOptionClick('No experience')}>
              🆕 No Experience
            </button>
            <button className="option-btn" onClick={() => handleOptionClick('1-2yr')}>
              📈 1-2 Years
            </button>
            <button className="option-btn" onClick={() => handleOptionClick('2-3yr')}>
              📊 2-3 Years
            </button>
            <button className="option-btn" onClick={() => handleOptionClick('3-5yr')}>
              📈 3-5 Years
            </button>
            <button className="option-btn" onClick={() => handleOptionClick('5+yr')}>
              🏆 5+ Years
            </button>
          </div>
        )}
        
        {shouldShowOptions() && [9, 10, 11, 13].includes(conversationState.step) && (
          <div className="options-container">
            <button className="option-btn yes-btn" onClick={() => handleOptionClick('Yes')}>
              ✅ Yes
            </button>
            <button className="option-btn no-btn" onClick={() => handleOptionClick('No')}>
              ❌ No
            </button>
          </div>
        )}
        
        {shouldShowOptions() && conversationState.step === 12 && (
          <div className="options-container">
            <button className="option-btn immediate-btn" onClick={() => handleOptionClick('Immediately')}>
              ⚡ Immediately
            </button>
            <button className="option-btn time-btn" onClick={() => handleOptionClick('Need some time')}>
              ⏳ Need Time
            </button>
            <button className="option-btn clarify-btn" onClick={() => handleOptionClick('Need more clarification')}>
              ❓ Need Clarification
            </button>
          </div>
        )}
        
        {shouldShowOptions() && conversationState.step === 14 && (
          <div className="options-container">
            <button className="option-btn inperson-btn" onClick={() => handleOptionClick('In-person appointment')}>
              🏢 In-person
            </button>
            <button className="option-btn online-btn" onClick={() => handleOptionClick('Google Meet appointment')}>
              💻 Google Meet
            </button>
          </div>
        )}
        
        {shouldShowOptions() && conversationState.step === 15 && (
          <div className="options-container">
            <button className="option-btn morning-btn" onClick={() => handleOptionClick('Morning')}>
              🌅 Morning (11 AM)
            </button>
            <button className="option-btn evening-btn" onClick={() => handleOptionClick('Evening')}>
              🌆 Evening (4 PM)
            </button>
          </div>
        )}
        
        {shouldShowOptions() && conversationState.step === 17 && (
          <div className="options-container">
            <button className="option-btn confirm-btn" onClick={() => handleOptionClick('Confirm')}>
              ✅ Confirm Appointment
            </button>
            <button className="option-btn cancel-btn" onClick={() => handleOptionClick('No')}>
              ❌ Cancel
            </button>
          </div>
        )}

        {/* Options for Germany entry year selection */}
        {shouldShowOptions() && conversationState.step === 18 && (
          <div className="options-container">
            <button className="option-btn year-btn" onClick={() => handleOptionClick('2025')}>
              📅 2025
            </button>
            <button className="option-btn year-btn" onClick={() => handleOptionClick('2026')}>
              📅 2026
            </button>
            <button className="option-btn year-btn" onClick={() => handleOptionClick('2027')}>
              📅 2027
            </button>
          </div>
        )}

        {/* Options for no passport flow and journey start */}
        {shouldShowOptions() && conversationState.step === 19 && (
          <div className="options-container">
            <button className="option-btn yes-btn" onClick={() => handleOptionClick('Yes')}>
              ✅ Yes
            </button>
            <button className="option-btn passport-btn" onClick={() => handleOptionClick('Claim Free Passport')}>
              📘 Claim Free Passport
            </button>
            <button className="option-btn register-btn" onClick={() => handleOptionClick('Register Now')}>
              📝 Register Now
            </button>
          </div>
        )}

        {/* Options for financial job support */}
        {shouldShowOptions() && conversationState.step === 20 && (
          <div className="options-container">
            <button className="option-btn yes-btn" onClick={() => handleOptionClick('Yes')}>
              ✅ Yes
            </button>
            <button className="option-btn no-btn" onClick={() => handleOptionClick('No')}>
              ❌ No
            </button>
            <button className="option-btn settlo-btn" onClick={() => handleOptionClick('Contact Settlo Team')}>
              💼 Contact Settlo Team
            </button>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input">
        <input 
          type="text" 
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={
            conversationState.isProcessingEmail || conversationState.isProcessingUGEmail
              ? "Processing your information..." 
              : isInputDisabled() 
                ? "Please select an option above..." 
                : "Type your message..."
          }
          disabled={isInputDisabled()}
        />
        <button 
          onClick={handleUserInput} 
          disabled={isInputDisabled() || !userInput.trim()}
          className="send-button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
          </svg>
        </button>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".pdf,.doc,.docx"
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ChatBot;