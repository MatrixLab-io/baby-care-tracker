import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  const next = isDark ? 'light' : 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="btn btn-secondary btn-sm w-9 px-0"
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
    >
      {isDark ? (
        <SunIcon className="w-[18px] h-[18px]" aria-hidden="true" />
      ) : (
        <MoonIcon className="w-[18px] h-[18px]" aria-hidden="true" />
      )}
    </button>
  );
}
