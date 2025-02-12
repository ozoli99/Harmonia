import React from 'react';

const SkipToContent: React.FC = () => {
    return (
        <a
            href="#main-content"
            className="hidden absolute left-4 top-4 bg-blue-600 text-white p-2 rounded-md z-50 transform -translate-y-full focus:translate-y-0 transition-transform"
        >
            Skip to content
        </a>
    );
};

export default SkipToContent;