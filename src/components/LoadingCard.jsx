import ContentLoader from 'react-content-loader';

// SVG fills read CSS custom properties, so the skeletons follow the theme
// without a second set of colours for dark mode.
const SKELETON_COLORS = {
  backgroundColor: 'var(--ml-surface-2)',
  foregroundColor: 'var(--ml-line)',
};

export const CardLoader = () => (
  <div className="card p-4 sm:p-6">
    <ContentLoader speed={2} width="100%" height={200} {...SKELETON_COLORS}>
      <rect x="0" y="0" rx="4" ry="4" width="60%" height="24" />
      <rect x="0" y="40" rx="4" ry="4" width="40%" height="16" />
      <rect x="0" y="80" rx="4" ry="4" width="100%" height="60" />
      <rect x="0" y="160" rx="4" ry="4" width="30%" height="32" />
    </ContentLoader>
  </div>
);

export const ListLoader = ({ rows = 3 }) => (
  <div className="flex flex-col gap-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="card p-4">
        <ContentLoader speed={2} width="100%" height={56} {...SKELETON_COLORS}>
          <rect x="0" y="8" rx="10" ry="10" width="40" height="40" />
          <rect x="56" y="12" rx="4" ry="4" width="40%" height="14" />
          <rect x="56" y="34" rx="4" ry="4" width="60%" height="12" />
        </ContentLoader>
      </div>
    ))}
  </div>
);

export const HomeLoader = () => (
  <div className="flex flex-col gap-6">
    <div className="flex flex-col gap-3">
      <div className="h-8 w-64 max-w-full rounded-control bg-surface-2 animate-pulse" />
      <div className="h-4 w-48 max-w-full rounded bg-surface-2 animate-pulse" />
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      {[1, 2].map((i) => (
        <div key={i} className="card p-4 sm:p-6">
          <ContentLoader speed={2} width="100%" height={200} {...SKELETON_COLORS}>
            <circle cx="32" cy="32" r="32" />
            <rect x="80" y="12" rx="4" ry="4" width="45%" height="18" />
            <rect x="80" y="40" rx="4" ry="4" width="25%" height="13" />
            <rect x="0" y="84" rx="8" ry="8" width="100%" height="60" />
            <rect x="0" y="160" rx="8" ry="8" width="100%" height="36" />
          </ContentLoader>
        </div>
      ))}
    </div>
  </div>
);
