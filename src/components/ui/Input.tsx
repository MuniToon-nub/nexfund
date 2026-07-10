import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`
            w-full bg-navy-800 border border-navy-600 rounded-xl text-white
            placeholder:text-gray-500 focus:outline-none focus:border-accent-500
            focus:ring-2 focus:ring-accent-500/20 transition-all duration-200
            ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 text-sm
            ${error ? 'border-danger-400 focus:border-danger-400 focus:ring-danger-400/20' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-danger-400">{error}</p>
      )}
    </div>
  );
}
