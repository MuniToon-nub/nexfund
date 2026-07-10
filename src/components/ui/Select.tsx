import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export default function Select({
  label,
  error,
  options,
  className = '',
  id,
  ...props
}: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-300 mb-1.5">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`
          w-full bg-navy-800 border border-navy-600 rounded-xl text-white
          focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20
          transition-all duration-200 px-4 py-2.5 text-sm appearance-none
          ${error ? 'border-danger-400' : ''}
          ${className}
        `}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-danger-400">{error}</p>}
    </div>
  );
}
