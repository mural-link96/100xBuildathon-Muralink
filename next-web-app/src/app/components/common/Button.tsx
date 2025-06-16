// src/app/components/common/Button.tsx
import React, { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  [key: string]: any;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick = () => {},
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'font-semibold rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';

  const variants: Record<string, string> = {
    primary: 'bg-yellow-400 text-gray-900 hover:bg-yellow-300 hover:shadow-2xl',
    secondary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    outline: 'border-2 border-transparent hover:border-indigo-200 bg-white hover:shadow-xl',
    ghost: 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
  };

  const sizes: Record<string, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-2 py-3 text-base',
    lg: 'px-8 md:px-10 py-3 md:py-4 text-base md:text-lg'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      ) : children}
    </button>
  );
};

export default Button;