import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './LanguageCourse.css';

const courseData = {
  english: {
    subtitle: "30-Hour IELTS Preparation Program (Complete Syllabus)",
    exam: "IELTS",
    outcome: [
      "Understand complete IELTS format",
      "Improve all 4 skills (L, R, W, S)",
      "Achieve target band score (6.5–8+)"
    ],
    modules: [
      { 
        title: "📘 Module 1: Introduction & Basics (2 Hours)", 
        desc: <>IELTS Overview (Academic vs General)<br/>Band Score System Explained<br/>Test Format (Listening, Reading, Writing, Speaking)<br/>Common Mistakes Students Make<br/>Diagnostic Test (Quick Assessment)</> 
      },
      { 
        title: "🎧 Module 2: Listening Skills (6 Hours)", 
        desc: <><b>Types of Questions:</b> Form Completion, Multiple Choice, Map Labelling, Sentence Completion.<br/><b>Listening Techniques:</b> Prediction Skills, Keyword Identification, Note Completion Tricks, Handling Different Accents (British, Australian)<br/>Practice Tests + Error Analysis</> 
      },
      { 
        title: "📖 Module 3: Reading Skills (6 Hours)", 
        desc: <><b>Topics Covered:</b> Skimming & Scanning Techniques.<br/><b>Types of Questions:</b> True/False/Not Given, Matching Headings, Sentence Completion, Multiple Choice.<br/>Time Management Strategies, Vocabulary Building Techniques, Practice Passages + Discussion</> 
      },
      { 
        title: "✍️ Module 4: Writing Skills (8 Hours)", 
        desc: <><b>Task 1 (Report Writing):</b> Types: Bar Chart, Line Graph, Pie Chart, Table, Process Diagram, Map. Structure & Templates, Vocabulary for Data Description.<br/><b>Task 2 (Essay Writing):</b> Essay Types: Opinion, Discussion, Problem-Solution, Advantage/Disadvantage. Idea Generation, Cohesion & Coherence, Grammar for High Band.<br/>Sample Answers + Practice</> 
      },
      { 
        title: "🗣️ Module 5: Speaking Skills (6 Hours)", 
        desc: <><b>Part 1:</b> Introduction - Common Questions.<br/><b>Part 2:</b> Cue Card - How to Speak for 2 Minutes, Structuring Techniques.<br/><b>Part 3:</b> Discussion - Advanced Answer Development, Giving Opinions.<br/><b>Additional Focus:</b> Fluency & Pronunciation, Vocabulary, Mock Speaking Tests</> 
      },
      { 
        title: "🧠 Module 6: Grammar & Vocabulary (Integrated – 2 Hours)", 
        desc: <>Tenses (All forms), Articles & Prepositions, Complex Sentences, Linking Words, Topic-wise Vocabulary</> 
      }
    ]
  },
  japanese: {
    subtitle: "JLPT (N5 to N1) Preparation Program",
    exam: "JLPT",
    outcome: [
      "Master Hiragana, Katakana, and Kanji",
      "Pass the JLPT target level (N5-N1)",
      "Speak accurately in appropriate politeness levels",
      "Gain confidence for living/working in Japan"
    ],
    modules: [
      { title: "📘 Module 1: Introduction to Kana (4 Hours)", desc: "Hiragana & Katakana mastery." },
      { title: "🎧 Module 2: Essential Vocabulary (6 Hours)", desc: "JLPT focused vocabulary & situational usage." },
      { title: "📖 Module 3: Kanji Mastery (8 Hours)", desc: "Radicals, stroke orders, and high-frequency Kanji." },
      { title: "✍️ Module 4: Grammar & Structures (6 Hours)", desc: "Particles, verb conjugations, and Keigo." },
      { title: "🗣️ Module 5: Listening Comprehension (4 Hours)", desc: "Shadowing practice, daily life conversations." },
      { title: "🧠 Module 6: Reading & Mock Tests (2 Hours)", desc: "JLPT reading strategies & timed full-length tests." }
    ]
  },
  german: {
    subtitle: "German Language Course (A1 - B2)",
    exam: "Goethe-Zertifikat / TELC",
    duration: "65 Hours per Level",
    durationDesc: "Balanced 65-hour curriculum per level: Grammar (25h) + Lectures (25h) + Practice (15h).",
    outcome: [
      "A strong grammatical foundation across all levels",
      "Improved fluency and confidence in speaking",
      "Better listening and reading comprehension",
      "Full preparation for Goethe / TELC examinations"
    ],
    modules: [
      { 
        title: "📘 Level A1: Beginner", 
        desc: <><b>Grammar (25 Hrs):</b> Alphabet, Present tense, Articles, Accusative case, Separable verbs.<br/><b>Lectures (25 Hrs):</b> Vocabulary, daily conversations, reading simple texts.<br/><b>Practice (15 Hrs):</b> Self-introduction, short dialogues, writing emails.</>
      },
      { 
        title: "🎧 Level A2: Elementary", 
        desc: <><b>Grammar (25 Hrs):</b> Past tense (Perfekt), Modal verbs, Dative case, Reflexive verbs.<br/><b>Lectures (25 Hrs):</b> Expanded vocabulary, everyday conversations, short articles.<br/><b>Practice (15 Hrs):</b> Daily-life role plays, emails, descriptions.</>
      },
      { 
        title: "📖 Level B1: Intermediate", 
        desc: <><b>Grammar (25 Hrs):</b> Präteritum, Passive voice, Relative clauses, Subordinate clauses.<br/><b>Lectures (25 Hrs):</b> Opinion-based texts, articles, interviews.<br/><b>Practice (15 Hrs):</b> Discussions, presentations, formal letters, news listening.</>
      },
      { 
        title: "✍️ Level B2: Upper Intermediate", 
        desc: <><b>Grammar (25 Hrs):</b> Adv. Konjunktiv II, Passive (all tenses), Reported speech, Idioms.<br/><b>Lectures (25 Hrs):</b> Academic/professional texts, essay/report writing, exam strategies.<br/><b>Practice (15 Hrs):</b> Debates, academic reading, detailed essays and lectures.</>
      },
      { 
        title: "🗣️ Course Structure & Pillars", 
        desc: <><b>Grammar Training:</b> Verb conjugation, sentence structure, the four cases.<br/><b>Lectures with Books:</b> Prepositions, clauses, vocabulary building.<br/><b>Practice Sessions:</b> Intensive focus on four skills (Listening, Reading, Speaking, Writing).</>
      },
      { 
        title: "🧠 Methodology & Support", 
        desc: <><b>Individual Support:</b> Personalized guidance, doubt-clearing sessions.<br/><b>Retention:</b> Regular revision, weekly mock assessments.<br/><b>Final Goal:</b> Independent use of language, Goethe / TELC exam readiness.</>
      }
    ]
  },
  french: {
    subtitle: "French Language Course (DELF / DALF & TEF)",
    exam: "DELF/DALF & TEF",
    duration: "Varies per Level (40 to 120 Hours)",
    durationDesc: "Custom durations: A1/A2 (90 hrs each), B2 (120 hrs), and TEF Prep (40 hrs).",
    outcome: [
      "Master French phonetics, expressions, and grammar",
      "Pass DELF/DALF or TEF examinations",
      "Effectively communicate with native French speakers",
      "Gain points for Canada PR / Study abroad"
    ],
    modules: [
      { 
        title: "📘 Level A1: Beginner (90 Hours)", 
        desc: <><b>Grammar & Lexicon:</b> French pronunciation, basic phrases, Present tense, articles.<br/><b>Compréhension:</b> Basic dialogues and slow audio.<br/><b>Practice:</b> Self-introductions, writing short informal emails.</>
      },
      { 
        title: "🎧 Level A2: Elementary (90 Hours)", 
        desc: <><b>Grammar & Lexicon:</b> Passé Composé, Imparfait, immediate future, basic connectors.<br/><b>Compréhension:</b> Everyday public announcements, short texts.<br/><b>Practice:</b> Role-playing daily scenarios, describing past events.</>
      },
      { 
        title: "📖 Level B1: Intermediate", 
        desc: <><b>Grammar & Lexicon:</b> Subjonctif, Conditionnel, pronouns (Y, EN), complex sentence linking.<br/><b>Compréhension:</b> Radio interviews, newspaper articles.<br/><b>Practice:</b> Expressing opinions, handling unpredicted situations.</>
      },
      { 
        title: "✍️ Level B2: Upper Intermediate (120 Hours)", 
        desc: <><b>Grammar & Lexicon:</b> Advanced structuring, idiomatic expressions, logical connectors.<br/><b>Compréhension:</b> Native fast-paced audio, academic/professional texts.<br/><b>Practice:</b> Formal debates, argumentative essays, detailed reports.</>
      },
      { 
        title: "🗣️ TEF Preparation (40 Hours)", 
        desc: <><b>Core Focus:</b> Intensive crash course explicitly made for TEF Canada Immigration formats.<br/><b>Topics:</b> Section-wise breakdown (Lexique, Lecture, Écoute).<br/><b>Practice:</b> Timed modules and vocabulary strategies.</>
      },
      { 
        title: "🧠 Methodology & Exam Strategies", 
        desc: <><b>Mock Exams:</b> Full-length structured mock tests for DELF/DALF & TEF.<br/><b>Support:</b> Individualized feedback on speaking and writing.<br/><b>Goal:</b> Maximizing points for immigration/study targets.</>
      }
    ]
  }
};

const getDefaultCourseData = (langCapitalized) => ({
  subtitle: `Comprehensive ${langCapitalized} Certification Program`,
  exam: `${langCapitalized} Certification`,
  outcome: [
    `Master essential ${langCapitalized} grammar`,
    `Pass required proficiency exams in ${langCapitalized}`,
    "Speak fluently in everyday scenarios",
    "Gain confidence for real-world interactions"
  ],
  modules: [
    { title: "📘 Module 1: Introduction & Alphabet (4 Hours)", desc: `Basic phonetics and greetings in ${langCapitalized}.` },
    { title: "🎧 Module 2: Essential Vocabulary (6 Hours)", desc: "Common words and everyday phrases." },
    { title: "📖 Module 3: Grammar Foundations (8 Hours)", desc: "Sentence structure, essential tenses." },
    { title: "✍️ Module 4: Reading & Writing (6 Hours)", desc: "Comprehending texts and writing short essays." },
    { title: "🗣️ Module 5: Speaking & Listening (4 Hours)", desc: "Interactive dialogues and listening drills." },
    { title: "🧠 Module 6: Exam Prep & Mock Test (2 Hours)", desc: "Strategies for taking proficiency exams." }
  ]
});

const LanguageCourse = () => {
  const { lang } = useParams();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+91',
    phone: '',
    levelFinished: '',
    purpose: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const languageCapitalized = lang ? lang.charAt(0).toUpperCase() + lang.slice(1) : 'English';
  const cData = courseData[lang?.toLowerCase()] || getDefaultCourseData(languageCapitalized);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'name') {
      // Only allow letters and spaces
      if (!/^[a-zA-Z\s]*$/.test(value)) return;
    }
    
    if (name === 'phone') {
      // Only allow digits, max 10
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length > 10) return;
      setFormData({ ...formData, [name]: digitsOnly });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      // Assuming your backend is on the same host or port 5000 in dev
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/submit-language-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, language: languageCapitalized }),
      });

      if (response.ok) {
        alert(`Thank you for registering for ${languageCapitalized}! We will contact you soon.`);
        setFormData({ name: '', email: '', countryCode: '+91', phone: '', levelFinished: '', purpose: '' });
        setShowForm(false);
      } else {
        alert('There was an issue submitting your registration. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error connecting to the server. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="language-course-wrapper">
      <div className="language-course-container">
        <div className="course-header">
        <h1>{languageCapitalized} Training Program</h1>
        <p>{cData.subtitle}</p>
      </div>

      <div className="course-duration">
        <strong>🕒 Total Duration: {cData.duration || "30 Hours"}</strong>
        <p>👉 {cData.durationDesc || `Divided into 4 Core Modules + Practice + Strategy for ${cData.exam}`}</p>
      </div>

      <div className="course-details">
        {/* Core Modules Grid */}
        <div className="modules-grid">
          {cData.modules.map((mod, index) => (
            <div className="module card" key={index}>
              <h3>{mod.title}</h3>
              <p>{mod.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="bottom-sections-grid">
          <div className="module card">
            <h3>📝 Final Practice & Mock Test</h3>
            <ul>
              <li>Full-Length Mock Test for {cData.exam}</li>
              <li>Individual Feedback</li>
              <li>Score Evaluation</li>
              <li>Improvement Plan</li>
            </ul>
          </div>

          <div className="bonus-features card">
            <h3>💡 Bonus Features</h3>
            <ul>
              <li>✔ Ready-made Templates for Writing</li>
              <li>✔ Daily Practice Materials</li>
              <li>✔ Speaking Mock Sessions</li>
              <li>✔ Vocabulary Lists</li>
              <li>✔ Personalized Feedback</li>
            </ul>
          </div>
        </div>

        <div className="course-outcome card">
          <h3>🚀 Outcome</h3>
          <p>By the end of this course, students will:</p>
          <ul>
            {cData.outcome.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* trigger button for popup */}
      <div className="learn-more-section">
        <button className="open-form-btn" onClick={() => setShowForm(true)}>
          Register to Learn {languageCapitalized}
        </button>
      </div>

      {/* Modal Popup overlay */}
      {showForm && (
        <div className="form-modal-overlay">
          <div className="form-modal-content">
            <button className="close-modal-btn" onClick={() => setShowForm(false)}>✕</button>
            <h2>Register to Learn {languageCapitalized}</h2>
            <form className="registration-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  placeholder="Enter your full name" 
                  title="Only letters and spaces are allowed"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  placeholder="Enter your email address" 
                  pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                  title="Please enter a valid email address"
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <select 
                    name="countryCode" 
                    value={formData.countryCode} 
                    onChange={handleChange} 
                    style={{ width: '80px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+61">+61</option>
                    <option value="+971">+971</option>
                  </select>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    required 
                    placeholder="10-digit number" 
                    maxLength="10"
                    pattern="\d{10}"
                    title="Please enter exactly 10 digits"
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Level Already Finished</label>
                <input type="text" name="levelFinished" value={formData.levelFinished} onChange={handleChange} placeholder="e.g., A1, Beginner, None" />
              </div>
              <div className="form-group">
                <label>Purpose</label>
                <select name="purpose" value={formData.purpose} onChange={handleChange} required>
                  <option value="" disabled>Select your purpose</option>
                  <option value="Study Abroad">Study Abroad</option>
                  <option value="Work">Work</option>
                  <option value="Just to Learn">Just to Learn</option>
                </select>
              </div>
              <button 
                type="submit" 
                className="submit-btn" 
                style={{ '--theme-color': 'var(--primary-color, #E3000F)' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Learn'}
              </button>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default LanguageCourse;
