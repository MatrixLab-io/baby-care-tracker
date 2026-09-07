import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Logo from './ui/Logo';
import ThemeToggle from './ui/ThemeToggle';
import PrivacyNotice from './PrivacyNotice';
import UserMenu from './auth/UserMenu';

/**
 * One flat sticky bar on every screen: brand left, actions right, an optional
 * back link between them. `showPrivacy`/`showUser` come off for public routes.
 */
const Header = ({
  showBack = false,
  backPath = '/',
  backLabel = 'Back',
  rightContent = null,
  showPrivacy = true,
  showUser = true,
}) => {
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <div className="app-header-bar">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Logo />
          {showBack && (
            <button
              type="button"
              onClick={() => navigate(backPath)}
              className="btn btn-secondary btn-sm ml-1"
            >
              <ArrowLeftIcon className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">{backLabel}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {rightContent}
          {showPrivacy && <PrivacyNotice />}
          <ThemeToggle />
          {showUser && <UserMenu />}
        </div>
      </div>
    </header>
  );
};

export default Header;
