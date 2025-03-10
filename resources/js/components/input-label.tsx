import React from 'react';

interface InputLabelProps {
    value?: string;
    htmlFor?: string;
    className?: string;
    children?: React.ReactNode;
}

const InputLabel: React.FC<InputLabelProps> = ({ value, htmlFor, className = '', children }) => {
    return (
        <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 ${className}`}>
            {value || children}
        </label>
    );
};

export default InputLabel;
