import React from 'react';
import classNames from 'classnames';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  className = '',
  disabled,
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      className={classNames(
        'inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150',
        {
          'opacity-50 cursor-not-allowed': disabled,
        },
        className
      )}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
