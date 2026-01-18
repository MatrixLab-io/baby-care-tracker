import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import PrivacyNotice from './PrivacyNotice';

const BabyIcon = () => (
  <svg viewBox="0 0 100 100" className="w-9 h-9">
    <defs>
      <linearGradient id="headerBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#6366f1' }} />
        <stop offset="100%" style={{ stopColor: '#8b5cf6' }} />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#headerBgGrad)" />
    <circle cx="50" cy="52" r="28" fill="#fcd9b6" />
    <ellipse cx="50" cy="30" rx="20" ry="12" fill="#4a3728" />
    <circle cx="38" cy="32" r="6" fill="#4a3728" />
    <circle cx="62" cy="32" r="6" fill="#4a3728" />
    <circle cx="42" cy="50" r="4" fill="#1f2937" />
    <circle cx="58" cy="50" r="4" fill="#1f2937" />
    <circle cx="43" cy="49" r="1.5" fill="white" />
    <circle cx="59" cy="49" r="1.5" fill="white" />
    <circle cx="35" cy="58" r="5" fill="#ffb6c1" opacity="0.6" />
    <circle cx="65" cy="58" r="5" fill="#ffb6c1" opacity="0.6" />
    <path d="M 42 62 Q 50 70 58 62" stroke="#1f2937" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <ellipse cx="50" cy="72" rx="8" ry="5" fill="#60a5fa" />
    <circle cx="50" cy="72" r="3" fill="#3b82f6" />
  </svg>
);

const Header = ({ showBack = false, backPath = '/', backLabel = 'Back', backIcon = false, rightContent = null }) => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between mb-6">
      {/* Left side - Logo + Back */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Logo - Always visible */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <BabyIcon />
          <span className="hidden sm:inline text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            MyBabyCare
          </span>
        </div>

        {/* Back button - When needed */}
        {showBack && (
          <button
            onClick={() => navigate(backPath)}
            className="glass-card px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:scale-105 transition-transform text-gray-600 dark:text-gray-300 text-sm font-medium"
          >
            {backIcon ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                {backLabel}
              </>
            )}
          </button>
        )}
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2">
        {rightContent}
        <PrivacyNotice />
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
