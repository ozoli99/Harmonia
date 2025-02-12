import React, { useState } from 'react';

const Support: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate sending a support message to the backend
        console.log("Support message:", { email, message });
        setSuccessMessage('Your message has been sent. Our support team will contact you soon.');
        setEmail('');
        setMessage('');
        setTimeout(() => setSuccessMessage(''), 5000);
    };

    return (
        <div className="max-w-lg mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Support</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
                For assistance, please send us a message or email us at <a href="mailto:support@harmonia.com" className="text-blue-600">support@harmonia.com</a>.
            </p>
            {successMessage && (
                <div className="mb-4 p-4 bg-green-100 text-green-800 rounded">
                    {successMessage}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={4}
                        className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow hover:shadow-lg transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Send Message
                </button>
            </form>
        </div>
    );
};

export default Support;