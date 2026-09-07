import { useState, useRef, useEffect } from 'react';
import { ArrowRightStartOnRectangleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
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
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
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
        <div className="menu absolute right-0 mt-2 w-56 z-50" role="menu">
          <div className="px-3 py-2.5 border-b border-line">
            <p className="text-sm font-semibold text-ink truncate">{displayName}</p>
            <p className="text-xs text-ink-2 truncate">{user.email}</p>
          </div>
          <button type="button" onClick={handleSignOut} className="menu-item menu-item-danger" role="menuitem">
            <ArrowRightStartOnRectangleIcon className="w-[18px] h-[18px]" aria-hidden="true" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
