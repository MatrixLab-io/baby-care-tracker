/** tone: live | soon | new | neutral | accent | inverse | danger */
export default function Badge({ tone = 'neutral', className = '', children }) {
  return <span className={`badge badge-${tone} ${className}`}>{children}</span>;
}
