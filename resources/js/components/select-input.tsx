import React from 'react';
import classNames from 'classnames';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  error?: string;
  options: SelectOption[];
}

const SelectInput = React.forwardRef<HTMLSelectElement, SelectInputProps>(
  ({ className = '', error, options, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          {...props}
          className={classNames(
            'rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 block w-full',
            { 'border-red-500': error },
            className
          )}
          ref={ref}
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

SelectInput.displayName = 'SelectInput';

export default SelectInput;
