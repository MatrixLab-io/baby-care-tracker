const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  className = '',
  fullWidth = false,
  icon: Icon
}) => {
  const baseStyles = 'font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer';

  const variants = {
    primary: 'glass-card text-indigo-600 dark:text-indigo-400 hover:scale-105 focus:ring-indigo-500 shadow-lg',
    secondary: 'glass-card text-gray-700 dark:text-gray-300 hover:scale-105 focus:ring-gray-500',
    danger: 'glass-card hover:scale-105 focus:ring-red-500',
    success: 'glass-card text-green-600 dark:text-green-400 hover:scale-105 focus:ring-green-500',
    outline: 'glass border-2 border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 hover:scale-105 focus:ring-indigo-500'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const dangerClass = variant === 'danger' ? 'btn-danger' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${dangerClass} ${className}`}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </button>
  );
};

export default Button;
