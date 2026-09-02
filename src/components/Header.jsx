import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import PrivacyNotice from './PrivacyNotice';
import WhatsNew from './WhatsNew';
import UserMenu from './auth/UserMenu';
import BrandMark from './BrandMark';

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
          <BrandMark />
          <span className="hidden sm:inline text-xl font-bold text-slate-800 dark:text-white">
            MyBabyCare
          </span>
        </div>

        {/* Back button - When needed */}
        {showBack && (
          <button
            onClick={() => navigate(backPath)}
            className="glass-card border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:scale-105 transition-transform text-gray-600 dark:text-gray-300 text-sm font-medium"
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
        <WhatsNew />
        <PrivacyNotice />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;
