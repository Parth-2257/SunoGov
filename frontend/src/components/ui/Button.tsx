import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  // Base classes for mobile touch target size and transition states
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Custom focus state mapping
  const focusRingMap = {
    primary: 'focus:ring-primary-500',
    secondary: 'focus:ring-accent-500',
    outline: 'focus:ring-primary-500',
    danger: 'focus:ring-red-500',
  };

  const variantClasses = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white border border-transparent shadow-sm',
    secondary: 'bg-accent-500 hover:bg-accent-600 text-white border border-transparent shadow-sm',
    outline: 'bg-transparent hover:bg-neutral-100 text-neutral-700 border border-neutral-300',
    danger: 'bg-red-600 hover:bg-red-700 text-white border border-transparent shadow-sm',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs min-h-[38px]', // Accessible touch size min-h
    md: 'px-4 py-2 text-sm min-h-[44px]',   // Standard accessible touch target
    lg: 'px-6 py-3 text-base min-h-[48px]',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${focusRingMap[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
