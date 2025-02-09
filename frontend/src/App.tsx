import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";

const App: React.FC = () => {
    const { isLoading, isAuthenticated, error, user } = useAuth0();

    if (isLoading) {
        return <div className="p-8 text-center">Loading...</div>;
    }
    if (error) {
        return <div className="p-8 text-center text-red-600">Error: {error.message}</div>;
    }
    if (isAuthenticated) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Hello, {user?.name}!</h1>
                <LogoutButton />
            </div>
        );
    } else {
        return (
            <div className="p-8 text-center">
                <LoginButton />
            </div>
        );
    }
};

export default App;