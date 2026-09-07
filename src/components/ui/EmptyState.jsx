/** Icon well, one line of what is missing, one action. */
export default function EmptyState({ icon: Icon, title, message, action, className = '' }) {
  return (
    <div className={`flex flex-col items-center text-center py-10 px-4 ${className}`}>
      {Icon && (
        <span className="icon-tile w-12 h-12 mb-4">
          <Icon className="w-6 h-6 text-ink-2" aria-hidden="true" />
        </span>
      )}
      <h3 className="text-[17px] font-semibold text-ink">{title}</h3>
      {message && <p className="text-sm text-ink-2 mt-1.5 max-w-sm">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
