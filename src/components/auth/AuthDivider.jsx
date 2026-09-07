const AuthDivider = ({ label = 'or' }) => {
  return (
    <div className="flex items-center gap-3 my-5" aria-hidden="true">
      <span className="h-px flex-1 bg-line" />
      <span className="text-xs font-medium text-ink-3 uppercase tracking-wide">{label}</span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
};

export default AuthDivider;
