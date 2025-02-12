import React from 'react';

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
    disablePadding?: boolean;
}

const Container: React.FC<ContainerProps> = ({
    children,
    className = '',
    disablePadding = false,
}) => {
    const paddingClasses = disablePadding ? '' : 'px-4 sm:px-6 lg:px-8';
    
    return (
        <div className={`max-w-7xl mx-auto ${paddingClasses} ${className}`}>
            {children}
        </div>
    );
};

export default Container;