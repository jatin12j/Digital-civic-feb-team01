import React from 'react';

export const Spinner = ({ size = 'md', color = 'blue' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };
  
  const colors = {
    blue: 'border-blue-600 border-t-transparent',
    emerald: 'border-emerald-600 border-t-transparent',
    white: 'border-white border-t-transparent'
  };

  return (
    <div className={`animate-spin rounded-full ${sizes[size]} ${colors[color]}`}></div>
  );
};

export const Alert = ({ type = 'info', message, className = '' }) => {
  const types = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    error: 'bg-red-50 text-red-800 border-red-200'
  };

  return (
    <div className={`p-4 rounded-md border ${types[type]} ${className}`}>
      {message}
    </div>
  );
};
