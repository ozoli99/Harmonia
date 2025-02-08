import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
    return (
        <button
            {...props}
            className={`py-2 px-4 bg-harmoniaBlue hover:bg-harmoniaBlue.dark text-white rounded focus:outline-none focus:ring-2 focus:ring-harmoniaBlue transition-colors duration-200 ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;