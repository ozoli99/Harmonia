import React from "react";

interface SkeletonLoaderProps {
    width?: string;
    height?: string;
    className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ width = "w-full", height = "h-6", className = "" }) => {
    return (
        <div className={`bg-gray-300 dark:bg-gray-700 animate-pulse ${width} ${height} ${className}`} />
    );
};

export default SkeletonLoader;