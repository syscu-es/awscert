export const translations = {
  // Header
  header: {
    certificationExam: 'Certification Exam',
    switchToLight: 'Switch to Light Mode',
    switchToDark: 'Switch to Dark Mode',
    finish: 'Finish',
    abandonTest: 'Abandon Exam?',
    abandonConfirm: 'Are you sure you want to leave the exam? Your progress will not be saved.',
    cancel: 'Cancel',
    abandon: 'Abandon'
  },

  // Menu
  menu: {
    certificationSelectorTitle: 'Choose Your Certification',
    certificationSelectorSubtitle: 'Pick the certification you want to practice for.',
    backToCertifications: 'Back to Certifications',
    title: 'AWS Certified Cloud Practitioner',
    subtitle: 'Exam prep application by SYSCU',
    description: 'Master the fundamentals with our comprehensive practice exam simulator',
    practiceTests: 'Practice Tests',
    about: 'About',
    domainMasteryTests: 'Domain Mastery Tests',
    domainDescription: 'Focus on specific domains with targeted quizzes',
    questions: 'Questions',
    weight: 'Weight',
    fullExamSimulation: 'Full Exam Simulation',
    fullExamDescription: 'Experience the real exam with all domains combined',
    examFeatures: {
      randomized: '65 random questions from all domains',
      timeLimit: '90 minutes to complete (real exam time)',
      distribution: 'Distribution proportional to each domain\'s official weight',
      unscored: '15 unscored questions included'
    },
    startFullExam: 'Start full exam simulation',
    aboutTool: 'About This Tool',
    aboutDescription: 'This simulator covers all 12 currently valid AWS certifications (Foundational, Associate, Professional, and Specialty) with over 800 practice questions based on the official exam guides.',
    aboutDescription2: 'It provides realistic exam conditions with questions organized by each certification\'s official domains, letting you study a specific domain or take the full exam simulation.',
    aboutDescription3: 'The tool includes immediate feedback in domain mode and a full per-domain performance breakdown after every exam. It\'s free and requires no sign-up.',
    aboutSyscuTitle: 'About SysCu',
    aboutSyscuBadge: 'AWS Partner Network',
    aboutSyscuDescription: 'SysCu is a 100% remote, senior-only cloud consultancy specializing in optimizing AWS infrastructure for companies across Spain and Latin America.',
    aboutSyscuDescription2: 'As a member of the AWS Partner Network (Services & Software Path), it helps teams migrate to AWS, cut costs with FinOps, automate CI/CD, and strengthen security and observability, with direct contact with the architects who implement each project.',
    aboutSyscuCta: 'Discover SysCu',
    howToUse: 'How to Use',
    howToSteps: {
      1: 'Choose a domain to focus on specific topics, or take the full exam simulation',
      2: 'Answer questions and manage your time (90 minutes for the full exam)',
      3: 'Review your answers before finishing (in exam mode)',
      4: 'Check your score and per-domain performance breakdown'
    },
    studyTips: 'Study Tips',
    studyTipsList: {
      1: 'Start with individual domain tests to identify weak areas',
      2: 'Take multiple full exams until you consistently score 70%+',
      3: 'AWS recommends 80% as a safe score before exam day'
    },
    important: 'Important',
    importantText: 'This tool is designed for study purposes. Make sure you are familiar with the official AWS documentation and exam guides before taking the real exam.',
    importantText2: 'AWS recommends consistently scoring at least 80% on practice exams before attempting the official certification exam.',
    certificationPath: 'AWS Certification Path',
    domainMasteryKicker: 'Domain mastery',
    domainWord: 'Domain',
    domainsCount: 'domains',
    certificationNotFound: 'Certification not found!',
    noQuestionsForDomain: 'No questions available for Domain',
    errorStartingExam: 'Error starting the exam: ',
    levelLabels: {
      foundational: 'Foundational — start here',
      associate: 'Associate — pick your role',
      professional: 'Professional — advanced experience',
      specialty: 'Specialty — go deep on one area'
    },
    languageSwitchToEs: 'Cambiar a Español',
    languageSwitchToEn: 'Switch to English'
  },

  // Question Panel
  questionPanel: {
    question: 'Question',
    of: 'of',
    flag: 'Flag',
    notes: 'Notes',
    explanation: 'Explanation',
    correct: 'Correct',
    incorrect: 'Incorrect',
    continue: 'Continue',
    submit: 'Submit',
    addNote: 'Add a personal note...',
    saveNote: 'Save Note',
    cancelNote: 'Cancel',
    tooManySelected: 'You selected more than 2 options. Narrow it down to continue.'
  },

  // Sidebar
  sidebar: {
    progress: 'Progress',
    answered: 'Answered',
    flagged: 'Flagged',
    remaining: 'Remaining',
    navigation: 'Navigation',
    previous: 'Previous',
    next: 'Next',
    review: 'Review answers before finishing',
    reviewDescription: 'Review your answers before submitting the exam',
    reviewInstructions: 'You can change any answer before submitting. Flagged questions appear in orange.',
    acknowledgeReview: 'I have reviewed the questions and confirm finishing the exam',
    submitExam: 'Confirm Submission',
    eliminateAnswer: 'Strike out option',
    restoreAnswer: 'Restore option',
    selectAnswer: 'Select answer',
    changeAnswer: 'Change answer',
    unanswered: 'Unanswered',
    open: 'Open',
    performanceBreakdown: 'Performance breakdown',
    awsRecommendation: 'AWS Recommendation',
    awsRecommendationText: 'For the real exam, AWS recommends consistently scoring at least 80% on practice exams before taking it.'
  },

  // Result
  result: {
    passed: 'Certification Passed!',
    notPassed: 'Not Passed',
    estimatedScore: 'Your estimated score on the AWS scale',
    points: 'Points (100-1000)',
    minimumToPass: 'Minimum to pass',
    backToHome: 'Back to Home',
    retryTest: 'Retry Exam',
    shareOnLinkedIn: 'Share on LinkedIn',
    shareDescription: 'Download an image of your result to share on LinkedIn',
    shareCardBrand: 'AWS Certification Prep',
    shareCardFooter: 'Get ready for your next certification exam for free!',
    shareLinkedInTitle: 'Achievement unlocked! I scored {score} points on the AWS certification exam.',
    shareLinkedInSummary: 'I prepared using the free AWS Certification Prep practice exam tool. Sharing my result and encouraging others to prepare for their AWS certifications!',
    shareAlert: 'Your result image has been downloaded!\n\nNow you can:\n1. Open LinkedIn in a new tab\n2. Create a new post\n3. Paste the image you downloaded\n4. Add the text: "I just scored {score} points on the AWS certification exam! I prepared using the free AWS Certification Prep practice exam tool. Get ready for your next certification exam for free at https://awscert.syscu.es!"',
    shareError: 'There was an error generating the image. Please try again.'
  },

  // Footer
  footer: {
    madeWith: 'Made with',
    by: 'by',
    practiceTests: 'Practice Tests',
    about: 'About',
    github: 'GitHub',
    website: 'Website',
    quickLinks: 'Quick Links',
    connect: 'Connect'
  },

  // App
  app: {
    noQuestionsLoaded: 'No questions loaded',
    noQuestionsDescription: 'Try refreshing the page or open the console to see errors.',
    back: 'Back'
  },

  // Common
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Info'
  },

  // Countdown (Cloud Quest launch teaser)
  countdown: {
    kicker: 'Coming up next',
    heading: 'AWS Cloud Quest',
    title: 'The new version of AWS Cloud Quest is almost here',
    description: 'AWS is renewing Cloud Quest: a redesigned 3D city, AI-powered customer conversations, revamped tournaments, and hands-on builds in a real AWS environment. Your progress carries over. Launching August 11, 2026 on AWS Skill Builder.',
    cta: 'View AWS Cloud Quest on Skill Builder',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Min',
    seconds: 'Sec'
  },

  // Footer
  footerExtra: {
    title: 'AWS Certification Practice Exams',
    description: 'Free practice exam simulator for all 12 currently valid AWS certifications, no sign-up required.'
  }
};
