import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';
import PrivacyDialog from '../PrivacyDialog';

// showPrivacy is off wherever there is no BabyProvider — the landing page can
// show a signed-in user their account without loading their children.
const UserMenu = ({ showPrivacy = true }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    // Move to the public page first. Signing out while still on a guarded
    // route bounces through /auth, which leaves you staring at a sign-in form
    // you just chose to leave.
    navigate('/', { replace: true });
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const openPrivacy = () => {
    setIsOpen(false);
    setPrivacyOpen(true);
  };

  if (!user) return null;

  const displayName = user.displayName || user.email?.split('@')[0] || 'User';

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 p-1 rounded-control hover:bg-surface-2 transition-colors cursor-pointer"
        aria-label="User menu"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <Avatar src={user.photoURL} name={displayName} size="sm" />
        <ChevronDownIcon
          className={`w-4 h-4 text-ink-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div className="menu absolute right-0 mt-2 w-60 z-50" role="menu">
          <div className="px-3 py-2.5 border-b border-line">
            <p className="text-sm font-semibold text-ink truncate">{displayName}</p>
            <p className="text-xs text-ink-2 truncate">{user.email}</p>
          </div>

          {/* Your data and how to delete it sit under the account, not beside
              the theme toggle. */}
          {showPrivacy && (
            <button type="button" onClick={openPrivacy} className="menu-item" role="menuitem">
              <ShieldCheckIcon className="w-[18px] h-[18px]" aria-hidden="true" />
              Data privacy
            </button>
          )}

          <button type="button" onClick={handleSignOut} className="menu-item menu-item-danger" role="menuitem">
            <ArrowRightStartOnRectangleIcon className="w-[18px] h-[18px]" aria-hidden="true" />
            Sign out
          </button>
        </div>
      )}

      {showPrivacy && <PrivacyDialog isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />}
    </div>
  );
};

export default UserMenu;
