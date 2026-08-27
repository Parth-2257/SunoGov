import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  padded = true,
  hoverable = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`
        bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm
        ${padded ? 'p-5 sm:p-6' : ''}
        ${hoverable ? 'hover:shadow-md transition-shadow duration-200' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
