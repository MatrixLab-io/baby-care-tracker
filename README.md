# Baby Care & Vaccine Tracker (Bangladesh EPI Edition)

A production-ready web application for tracking baby's age, vaccines, milestones, and growth based on the Bangladesh Government EPI (Expanded Programme on Immunization) schedule.

## Features

### Core Features
- **Exact Age Calculator**: Shows baby's age in years, months, days, weeks, and total days
- **Bangladesh EPI Vaccine Tracker**: Automatic vaccine schedule based on official BD EPI guidelines
- **Smart Vaccine Status**: Classifies vaccines as Completed, Due, Upcoming, or Overdue
- **Multiple Baby Profiles**: Support for tracking multiple babies
- **Milestone Tracker**: Auto milestones (1 week, 45 days, 3 months, etc.) + custom milestones
- **Growth Tracker**: Track weight, height, and head circumference with visual charts
- **Progress Tracking**: Visual progress bar showing vaccination completion
- **Shareable Links**: Generate read-only links to share baby's vaccine schedule
- **Dark Mode**: Elegant dark/light mode toggle with glassmorphism design
- **Offline Support**: All data stored locally in browser (localStorage)
- **Privacy First**: No login required, no server, no data collection

### Bangladesh EPI Vaccine Schedule

| Age | Vaccines |
|-----|----------|
| At Birth | BCG + OPV 0 |
| 6 weeks (42 days) | Pentavalent 1 + OPV 1 + PCV 1 |
| 10 weeks (70 days) | Pentavalent 2 + OPV 2 + PCV 2 |
| 14 weeks (98 days) | Pentavalent 3 + OPV 3 + PCV 3 |
| 9 months (270 days) | MR (Measles-Rubella) |
| 15 months (450 days) | MR 2 |

## Tech Stack

- **Frontend**: React 19
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4 (with glassmorphism effects)
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Icons**: Heroicons
- **Date Picker**: Flatpickr
- **Date Handling**: Native JavaScript Date API
- **Loading States**: React Content Loader
- **Storage**: LocalStorage (browser-based)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd baby-care-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Project Structure

```
baby-care-tracker/
├── public/
│   └── _redirects          # Netlify SPA routing configuration
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── DatePicker.jsx
│   │   ├── Modal.jsx
│   │   ├── LoadingCard.jsx
│   │   ├── VaccineCard.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── MilestoneTracker.jsx
│   │   ├── GrowthTracker.jsx
│   │   ├── ThemeToggle.jsx
│   │   └── Footer.jsx
│   ├── config/            # Configuration files
│   │   └── vaccines.js    # BD EPI vaccine schedule
│   ├── context/           # React Context
│   │   ├── BabyContext.jsx
│   │   └── ThemeContext.jsx
│   ├── pages/             # Page components
│   │   ├── Home.jsx
│   │   ├── AddEditBaby.jsx
│   │   ├── Dashboard.jsx
│   │   └── SharedView.jsx
│   ├── utils/             # Utility functions
│   │   ├── ageCalculator.js
│   │   ├── storage.js
│   │   └── vaccineEngine.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── netlify.toml           # Netlify configuration
├── package.json
└── README.md
```

## Deployment to Netlify

### Option 1: Deploy via Netlify UI

1. Push your code to GitHub/GitLab/Bitbucket

2. Go to [Netlify](https://www.netlify.com/) and sign in

3. Click "Add new site" → "Import an existing project"

4. Connect your repository

5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

6. Click "Deploy site"

### Option 2: Deploy via Netlify CLI

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

3. Initialize your site:
```bash
netlify init
```

4. Deploy:
```bash
netlify deploy --prod
```

### Environment Variables

No environment variables are required for this application. All data is stored locally in the browser.

## Usage

### Adding a Baby

1. Click "Add Your First Baby" or "Add Another Baby"
2. Enter baby's name and date of birth
3. Optionally add gender and photo URL
4. Click "Add Baby"

### Viewing Vaccine Schedule

1. Click on a baby card from the home page
2. View the dashboard with vaccine status
3. Mark vaccines as "Done" or "Undo" completed vaccines
4. Vaccines are automatically classified as:
   - ✅ **Completed**: User marked as done
   - ⏳ **Due**: Within 7 days or overdue
   - 🔵 **Upcoming**: Future vaccines
   - ⚠️ **Overdue**: Past due date

### Adding Milestones

1. Go to the Milestones tab
2. View auto milestones (achieved based on age)
3. Click "Add Custom" to add custom milestones
4. Enter title, description, and date

### Tracking Growth

1. Go to the Growth tab
2. Click "Add Record"
3. Enter weight, height, and/or head circumference
4. View the growth chart

### Sharing Vaccine Schedule

1. Click the "Share" button on the dashboard
2. Copy the generated link
3. Share with family/doctors for read-only view

## Medical Disclaimer

This app follows the Bangladesh EPI schedule. Always consult with a qualified healthcare professional for medical advice and vaccination guidance.

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available for personal and educational use.

## Support

For issues or questions, please open an issue on the GitHub repository.

---

**Copyright © 2026 - Developed by [MatrixLab](https://matrixlab.it.com)**

Built with ❤️ for parents in Bangladesh
