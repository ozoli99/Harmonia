import React, { useState } from 'react';

const BrandingSettings: React.FC = () => {
    const [logo, setLogo] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setLogo(file);
            const reader = new FileReader();
            reader.onloadend = () => setLogoPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        // Simulate saving settings to backend
        console.log("Saving branding settings:", { logo, contactEmail, contactPhone });
        setSuccessMessage("Settings saved successfully!");
        setTimeout(() => setSuccessMessage(''), 5000);
    };

    return (
        <div className="max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Branding Settings</h2>
            {successMessage && (
                <div className="mb-4 p-4 bg-green-100 text-green-800 rounded">
                    {successMessage}
                </div>
            )}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Upload Logo</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="mt-1 block w-full"
                />
                {logoPreview && (
                    <img src={logoPreview} alt="Logo Preview" className="mt-2 h-16" />
                )}
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Email</label>
                <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Phone</label>
                <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <button
                onClick={handleSave}
                className="w-full py-2 px-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow hover:shadow-lg transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                Save Settings
            </button>
        </div>
    );
};

export default BrandingSettings;