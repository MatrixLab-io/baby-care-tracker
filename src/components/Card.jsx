const Card = ({ children, className = '', padding = true, hover = false }) => {
  const paddingStyles = padding ? 'p-6' : '';
  const hoverStyles = hover ? 'hover:scale-[1.02] cursor-pointer' : '';

  return (
    <div className={`glass-card rounded-2xl transition-all duration-300 ${paddingStyles} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
