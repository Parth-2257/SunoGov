import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'primary' | 'success' | 'warning' | 'error';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold select-none border';
  
  const variantClasses = {
    neutral: 'bg-neutral-100 text-neutral-800 border-neutral-200',
    primary: 'bg-primary-50 text-primary-700 border-primary-100',
    success: 'bg-accent-50 text-accent-700 border-accent-100',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    error: 'bg-red-50 text-red-700 border-red-100',
  };

  return (
    <span
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
