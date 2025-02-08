import React from 'react';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        // TODO: Call your auth provider’s login function.
        navigate('/dashboard');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-3xl font-bold mb-4">Login to Harmonia</h2>
            {/* Replace with your login form or Auth0/Clerk login button */}
            <Button onClick={handleLogin}>Log In</Button>
        </div>
    );
};

export default Login;