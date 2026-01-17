import ContentLoader from 'react-content-loader';

export const CardLoader = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <ContentLoader
      speed={2}
      width="100%"
      height={200}
      backgroundColor="#f3f4f6"
      foregroundColor="#e5e7eb"
    >
      <rect x="0" y="0" rx="4" ry="4" width="60%" height="24" />
      <rect x="0" y="40" rx="4" ry="4" width="40%" height="16" />
      <rect x="0" y="80" rx="4" ry="4" width="100%" height="60" />
      <rect x="0" y="160" rx="4" ry="4" width="30%" height="32" />
    </ContentLoader>
  </div>
);

export const ListLoader = ({ rows = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <ContentLoader
          speed={2}
          width="100%"
          height={60}
          backgroundColor="#f3f4f6"
          foregroundColor="#e5e7eb"
        >
          <circle cx="30" cy="30" r="20" />
          <rect x="60" y="10" rx="4" ry="4" width="40%" height="16" />
          <rect x="60" y="34" rx="4" ry="4" width="60%" height="12" />
        </ContentLoader>
      </div>
    ))}
  </div>
);
