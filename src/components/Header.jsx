import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, HomeIcon } from '@heroicons/react/24/outline';
import Logo from './ui/Logo';
import ThemeToggle from './ui/ThemeToggle';
import PrivacyNotice from './PrivacyNotice';
import WhatsNew from './WhatsNew';
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
  showWhatsNew = true,
  showPrivacy = true,
  showUser = true,
  showHome = true,
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
          {showHome && (
            <button
              type="button"
              onClick={() => navigate('/welcome')}
              className="btn btn-secondary btn-sm w-9 px-0"
              aria-label="About MyBabyCare"
              title="About MyBabyCare"
            >
              <HomeIcon className="w-[18px] h-[18px]" aria-hidden="true" />
            </button>
          )}
          {showWhatsNew && <WhatsNew />}
          {showPrivacy && <PrivacyNotice />}
          <ThemeToggle />
          {showUser && <UserMenu />}
        </div>
      </div>
    </header>
  );
};

export default Header;
