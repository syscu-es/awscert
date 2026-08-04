# AWS Certification — Practice exam simulator

<div align="center">

![AWS Certification Practice](public/logo.png)

**An interactive web application to practice for AWS Certification exams — covers all current AWS certifications, from Cloud Practitioner to Professional and Specialty tracks**

[🌐 Test the application!](https://awscert.syscu.es)

</div>

---

## 📋 Table of Contents

- [Project description](#project-description)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Quick start guide](#quick-start-guide)
- [Application usage](#application-usage)
- [Technologies used](#technologies-used)
- [Project structure](#project-structure)
- [Knowledge base pipeline](#knowledge-base-pipeline)
- [Troubleshooting](#troubleshooting)
- [Support and contact](#support-and-contact)
- [License](#license)
- [Credits](#credits)
- [Additional study resources](#additional-study-resources)
- [Tips for passing the exam](#tips-for-passing-the-exam)

---

## 📖 Project description

**AWS Certification Practice** is a web application to help prepare for AWS Certification
exams. It ships with practice question banks for every current AWS certification —
foundational, associate, professional, and specialty — built from AWS's own official exam
guides.

With this tool, you can:
- Practice with questions organized by domain, for any AWS certification
- Take full timed exam simulations
- Get immediate feedback in study mode
- Visualize your performance by domain

Domains, weightings, and question counts are pulled from each certification's real AWS
exam guide (see [Knowledge base pipeline](#knowledge-base-pipeline)) — not fixed to a
single exam.

---

## ✨ Features

### 🎯 Study modes
- **Domain mastery tests**: practice domain-specific questions for any certification
- **Full exam simulation**: timed simulation across all domains
- **Immediate feedback**: detailed explanations for each answer

### 📊 Performance analysis
- Score breakdown by domain
- History of recent tests
- Indicators for weak areas

### 🗺️ Study resources
- **Technical explanations**: details for each question
- **Recommendations**: AWS-based preparation guide

### 🎨 Intuitive interface
- Modern and responsive design, dark/light mode
- Personal notes per question
- Bookmarks for review

---

## 🔧 Prerequisites

| Software | Minimum Version | Download Link |
|----------|----------------|---------------|
| **Node.js** | 20.x LTS | [nodejs.org](https://nodejs.org/) |
| **npm** | 9.x | Installed with Node.js |

---

## 🚀 Quick start guide

```bash
# 1. Clone the repository
git clone https://github.com/syscu-es/awscert.git

# 2. Enter the folder
cd awscert

# 3. Install dependencies
npm install

# 4. Start the application
npm run dev

# Done! Open http://localhost:5173/ in your browser
```

### Building for production

```bash
npm run build
```

This merges the committed knowledge base (`scripts/kb-data/*.json`) into
`src/data/certifications.js` and builds a fully static site in `dist/` — no backend,
no network calls at runtime.

---

## 💻 Application usage

### Main screen

- Pick a certification, grouped by AWS's own certification path (foundational →
  associate → professional → specialty)
- **Practice Tests**: domain-specific tests, or a full exam simulation
- **About**: how to use the app, study tips, exam info

### During a test

- **Left panel**: question and answer options
- **Right panel**: navigation, progress, and domain breakdown
- **Flag button**: mark a question for later review
- **Notes button**: add personal notes per question
- **Question grid**: jump directly to any question

### Study mode (domain tests)

Immediate feedback after each answer, with the explanation for the correct one.

### Exam mode (full simulation)

No feedback until finished — review your answers before submitting, then get a score
and breakdown by domain.

---

## 🏗️ Technologies Used

- **React 19**, **Vite**, **Tailwind CSS**
- **lucide-react** icons
- **ESLint**, **Node.js**

---

## 📁 Project structure

```
awscert/
├── src/
│   ├── components/
│   │   ├── Header.jsx           # Top bar during a quiz
│   │   ├── Menu.jsx             # Certification selector + main page
│   │   ├── QuestionPanel.jsx    # Question panel
│   │   ├── Sidebar.jsx          # Sidebar with navigation
│   │   ├── Result.jsx           # Final results
│   │   └── Footer.jsx           # Footer
│   ├── data/
│   │   └── certifications.js    # Auto-generated — do not edit by hand
│   ├── utils/
│   │   └── helpers.js           # Helper functions
│   ├── App.jsx                  # Main component
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles + design tokens
├── scripts/                     # Knowledge base pipeline (see below)
│   └── kb-data/                 # Scraped/generated KB — committed, source of truth
├── public/                      # Static assets
├── .github/workflows/           # CI/CD
├── index.html
├── vite.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

---

## 🧠 Knowledge base pipeline

Question banks are generated from AWS's own official exam guides, not hand-written per
certification:

```bash
npm run kb:scrape      # fetch every AWS exam guide's domains/task statements
npm run kb:generate    # generate practice questions via OpenAI (needs OPENAI_API_KEY)
npm run kb:build       # merge scripts/kb-data/*.json into src/data/certifications.js
```

`scripts/kb-data/*.json` is committed to the repo and is the actual source of truth —
`npm run build` only merges what's already there, no network calls involved. To refresh
the knowledge base, either run the commands above locally or trigger the
**"Update knowledge base"** GitHub Actions workflow manually (Actions tab → Run workflow).
See [DEPLOYMENT.md](DEPLOYMENT.md) for details.

---

## ❓ Troubleshooting

### "npm: command not found"
**Solution**: Node.js is not installed. Download it from [nodejs.org](https://nodejs.org/)

### Port 5173 is already in use
**Solution**: use another port:
```bash
npm run dev -- --port 3000
```

### Changes don't reflect after editing code
**Solution**: the dev server hot-reloads automatically. If it doesn't, save the file,
wait a second, and reload the browser.

### Error "Module not found"
**Solution**: run `npm install` again.

---

## 📞 Support and contact

- **Website**: [syscu.es](https://www.syscu.es)
- **LinkedIn**: [linkedin.com/company/syscu/](https://www.linkedin.com/company/syscu/)

---

## 📝 License

MIT — see [LICENSE](LICENSE).

---

## 🙏 Credits

Made with ❤️ by [syscu](https://www.syscu.es)

**Based on open-source technologies:** React, Vite, Tailwind CSS, Lucide Icons.

---

## 📚 Additional study resources

- [AWS Certification](https://aws.amazon.com/certification/)
- [AWS Certification Exam Guides](https://docs.aws.amazon.com/aws-certification/latest/examguides/aws-certification-exam-guides.html)
- [AWS Whitepapers](https://aws.amazon.com/whitepapers/)
- [AWS Skill Builder](https://skillbuilder.aws/)

---

## 🎯 Tips for passing the exam

1. **Use this app regularly**: practice at least 30 minutes daily
2. **Focus on weak domains**: performance charts show where you need improvement
3. **Read the explanations**: don't just look for the correct answer, understand why
4. **Take multiple simulations**: the goal is consistently 70%+, ideally 80%+
5. **Review before finishing**: use the review screen to verify doubtful answers

---

<div align="center">

### Was this helpful? Consider leaving a ⭐ on GitHub

**Happy Studying! 🎓**

© 2026 syscu. Licensed under MIT.

</div>
