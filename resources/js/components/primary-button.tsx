import classNames from 'classnames';
import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    disabled?: boolean;
    children: React.ReactNode;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ className = '', disabled, children, ...props }) => {
    return (
        <button
            {...props}
            className={classNames(
                'inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out hover:bg-indigo-700 focus:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none active:bg-indigo-800',
                {
                    'cursor-not-allowed opacity-50': disabled,
                },
                className,
            )}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default PrimaryButton;
