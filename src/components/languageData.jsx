import React from 'react';
import { 
  FaBook, FaHeadphones, FaBookOpen, FaPen, 
  FaComments, FaBrain
} from 'react-icons/fa';

export const languageData = {
  english: {
    programName: "30-Hour IELTS Preparation Program (Complete Syllabus)",
    durationText: "Divided into 4 Core Modules + Practice + Strategy",
    modules: [
      {
        icon: <FaBook />,
        title: "Module 1: Introduction & Basics (2 Hours)",
        content: (
          <ul>
            <li>IELTS Overview (Academic vs General)</li>
            <li>Band Score System Explained</li>
            <li>Test Format (Listening, Reading, Writing, Speaking)</li>
            <li>Common Mistakes Students Make</li>
            <li>Diagnostic Test (Quick Assessment)</li>
          </ul>
        )
      },
      {
        icon: <FaHeadphones />,
        title: "Module 2: Listening Skills (6 Hours)",
        description: "Topics Covered: Form Completion, Multiple Choice, Map Labelling, Sentence Completion",
        content: (
          <ul>
            <li>Prediction Skills</li>
            <li>Keyword Identification</li>
            <li>Note Completion Tricks</li>
            <li>Handling Different Accents (British, Australian)</li>
            <li>Practice Tests + Error Analysis</li>
          </ul>
        )
      },
      {
        icon: <FaBookOpen />,
        title: "Module 3: Reading Skills (6 Hours)",
        description: "Topics Covered: True/False/Not Given, Matching Headings, Sentence Completion, Multiple Choice",
        content: (
          <ul>
            <li>Skimming & Scanning Techniques</li>
            <li>Time Management Strategies</li>
            <li>Vocabulary Building Techniques</li>
            <li>Practice Passages + Discussion</li>
          </ul>
        )
      },
      {
        icon: <FaPen />,
        title: "Module 4: Writing Skills (8 Hours)",
        description: "Task 1 & 2: Report Writing & Essay Writing",
        content: (
          <ul>
            <li>Idea Generation (Brainstorming)</li>
            <li>Structure & Templates for Reports</li>
            <li>Cohesion & Coherence</li>
            <li>Grammar for High Band (Complex Sentences)</li>
            <li>Sample Answers + Practice</li>
          </ul>
        )
      },
      {
        icon: <FaComments />,
        title: "Module 5: Speaking Skills (6 Hours)",
        description: "Part 1, 2, 3: Introduction, Cue Card, Discussion",
        content: (
          <ul>
            <li>Advanced Answer Development</li>
            <li>Fluency & Pronunciation Focus</li>
            <li>Ideas Structuring & Opinions</li>
            <li>Vocabulary for High Band Score</li>
            <li>Mock Speaking Tests</li>
          </ul>
        )
      },
      {
        icon: <FaBrain />,
        title: "Module 6: Grammar & Vocabulary (2 Hours)",
        content: (
          <ul>
            <li>Tenses (All forms)</li>
            <li>Articles & Prepositions</li>
            <li>Complex Sentences & Linking Words</li>
            <li>Topic-wise Vocabulary</li>
          </ul>
        )
      }
    ],
    outcomes: [
      "Understand complete IELTS format",
      "Improve all 4 skills (L, R, W, S)",
      "Achieve target band score (6.5–8+)",
      "Gain confidence for real exam"
    ]
  },

  french: {
    programName: "30-Hour DELF / TEF Preparation Program",
    durationText: "Divided into 4 Core Modules + Practice + Strategy",
    modules: [
      {
        icon: <FaBook />,
        title: "Module 1: Introduction & Basics (2 Hours)",
        content: (
          <ul>
            <li>DELF & TEF Overview and Levels (A1-C2)</li>
            <li>Point System Explained</li>
            <li>Test Format (Compréhension & Production)</li>
            <li>Common Grammatical Mistakes</li>
            <li>Diagnostic Test (Quick Assessment)</li>
          </ul>
        )
      },
      {
        icon: <FaHeadphones />,
        title: "Module 2: Compréhension Orale - Listening (6 Hours)",
        description: "Topics Covered: MCQs, Matching, Audio Announcements, Dialogues",
        content: (
          <ul>
            <li>Keyword Identification in Spoken French</li>
            <li>Understanding Liaison and Enchaînement</li>
            <li>Handling Fast-Paced Native Audio</li>
            <li>Practice Tests + Error Analysis</li>
          </ul>
        )
      },
      {
        icon: <FaBookOpen />,
        title: "Module 3: Compréhension Écrite - Reading (6 Hours)",
        description: "Topics Covered: True/False/Justification, Matching, Information Extraction",
        content: (
          <ul>
            <li>Skimming & Scanning French Texts</li>
            <li>Time Management Strategies</li>
            <li>Vocabulary Building Techniques</li>
            <li>Practice Passages + Discussion</li>
          </ul>
        )
      },
      {
        icon: <FaPen />,
        title: "Module 4: Production Écrite - Writing (8 Hours)",
        description: "Task 1 & 2: Formal Letters, Emails, Argumentative Essays",
        content: (
          <ul>
            <li>Idea Generation & Structuring Arguments</li>
            <li>Templates for Formal vs Informal Letters</li>
            <li>Les Connecteurs Logiques (Logical Connectors)</li>
            <li>Subjunctive & Complex Sentences</li>
            <li>Sample Answers + Practice</li>
          </ul>
        )
      },
      {
        icon: <FaComments />,
        title: "Module 5: Production Orale - Speaking (6 Hours)",
        description: "Monologue, Directed Interaction, Roleplay",
        content: (
          <ul>
            <li>Advanced Answer Development</li>
            <li>Fluency & French Pronunciation Setup</li>
            <li>Ideas Structuring & Opinions</li>
            <li>Vocabulary for B2/C1 Score</li>
            <li>Mock Speaking Tests</li>
          </ul>
        )
      },
      {
        icon: <FaBrain />,
        title: "Module 6: Grammar & Vocabulary (2 Hours)",
        content: (
          <ul>
            <li>Tenses (Passé Composé, Imparfait, Futur, Conditionnel)</li>
            <li>Pronouns (Y, EN, COD, COI)</li>
            <li>Subjonctif & Linking Words</li>
            <li>Topic-wise Vocabulary</li>
          </ul>
        )
      }
    ],
    outcomes: [
      "Understand complete DELF/TEF format",
      "Improve all 4 skills in French",
      "Achieve target CEFR level (B2+)",
      "Gain confidence for real exam & immigration"
    ]
  },

  german: {
    programName: "German Language Course (A1 - B2)",
    durationText: "65 Hours per Level (Grammar, Lectures & Practice)",
    modules: [
      {
        icon: <FaBook />,
        title: "Level A1 - Beginner",
        description: "Basic understanding and use of familiar everyday expressions.",
        content: (
          <ul>
            <li><strong>Grammar (25 Hrs):</strong> Alphabet, Present tense, Articles, Accusative case, Separable verbs</li>
            <li><strong>Lectures (25 Hrs):</strong> Vocabulary building, Basic daily conversations, Reading/Listening</li>
            <li><strong>Practice (15 Hrs):</strong> Self-introduction, short dialogues, writing short emails</li>
            <li><strong>Outcome:</strong> Basic communication skills & Goethe A1 exam readiness</li>
          </ul>
        )
      },
      {
        icon: <FaHeadphones />,
        title: "Level A2 - Elementary",
        description: "Communication in simple and routine tasks.",
        content: (
          <ul>
            <li><strong>Grammar (25 Hrs):</strong> Past tense (Perfekt), Modal verbs, Dative case, Reflexive verbs</li>
            <li><strong>Lectures (25 Hrs):</strong> Expanded vocabulary, everyday conversations, short articles</li>
            <li><strong>Practice (15 Hrs):</strong> Daily-life role plays, informational emails, descriptions</li>
            <li><strong>Outcome:</strong> Confident daily communication & Goethe A2 exam readiness</li>
          </ul>
        )
      },
      {
        icon: <FaBookOpen />,
        title: "Level B1 - Intermediate",
        description: "Ability to deal with most situations encountered while traveling or working.",
        content: (
          <ul>
            <li><strong>Grammar (25 Hrs):</strong> Präteritum, Passive voice, Relative clauses, Subordinate clauses</li>
            <li><strong>Lectures (25 Hrs):</strong> Opinion-based texts, Newspaper/magazine articles, Interviews</li>
            <li><strong>Practice (15 Hrs):</strong> Discussions, presentations, formal letters, news listening</li>
            <li><strong>Outcome:</strong> Independent workplace communication & Goethe B1 exam readiness</li>
          </ul>
        )
      },
      {
        icon: <FaPen />,
        title: "Level B2 - Upper Intermediate",
        description: "Understanding complex texts and technical discussions.",
        content: (
          <ul>
            <li><strong>Grammar (25 Hrs):</strong> Adv. Konjunktiv II, Passive (all tenses), Reported speech, Idioms</li>
            <li><strong>Lectures (25 Hrs):</strong> Academic/professional texts, essay/report writing, exam strategies</li>
            <li><strong>Practice (15 Hrs):</strong> Debates, academic reading, detailed essays and lectures</li>
            <li><strong>Outcome:</strong> Fluent professional communication & Goethe B2 exam readiness</li>
          </ul>
        )
      },
      {
        icon: <FaComments />,
        title: "Course Structure & Pillars",
        description: "A balanced approach between theory and practical application.",
        content: (
          <ul>
            <li><strong>Grammar Training (25 Hrs):</strong> Verb conjugation, sentence structure, the four cases</li>
            <li><strong>Lectures with Books (25 Hrs):</strong> Prepositions, clauses, vocabulary building, exam practice</li>
            <li><strong>Practice Sessions (15 Hrs):</strong> Intensive practice in listening, reading, speaking, writing</li>
          </ul>
        )
      },
      {
        icon: <FaBrain />,
        title: "Methodology & Outcomes",
        content: (
          <ul>
            <li><strong>Individual Support:</strong> Personalized guidance and continuous doubt clearing</li>
            <li><strong>Retention:</strong> Regular revision sessions and weekly mock assessments</li>
            <li><strong>Skill Focus:</strong> Comprehensive training in reading, writing, listening, speaking</li>
            <li><strong>Final Goal:</strong> Overall mastery of German & Goethe/TELC certification</li>
          </ul>
        )
      }
    ],
    outcomes: [
      "A strong grammatical foundation",
      "Improved fluency and confidence in speaking",
      "Better listening and reading comprehension",
      "Full preparation for Goethe / TELC examinations"
    ]
  }
};
