/** tone: live | soon | new | neutral | accent | inverse | danger | skip */
export default function Badge({ tone = 'neutral', icon: Icon, className = '', children }) {
  return (
    <span className={`badge badge-${tone} ${className}`}>
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      {children}
    </span>
  );
}
