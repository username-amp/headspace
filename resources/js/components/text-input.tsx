import classNames from 'classnames';
import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(({ type = 'text', className = '', error, ...props }, ref) => {
    return (
        <div className="relative">
            <input
                {...props}
                type={type}
                className={classNames(
                    'focus:ring-opacity-50 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200',
                    { 'border-red-500': error },
                    className,
                )}
                ref={ref}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
});

TextInput.displayName = 'TextInput';

export default TextInput;
