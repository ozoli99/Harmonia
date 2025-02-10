import React from 'react';
import { useTranslation } from 'react-i18next';
import LoginButton from '../components/LoginButton';

const Home: React.FC = () => {
    const { t } = useTranslation();
    
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <h1 className="text-5xl font-bold text-harmoniaBlue dark:text-white mb-4">
                {t("welcome")}
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
                Your centralized platform for massage service management.
            </p>
            <LoginButton />
        </div>
    );
};

export default Home;