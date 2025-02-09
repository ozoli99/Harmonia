import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton: React.FC = () => {
    const { logout } = useAuth0();
    return (
        <button
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors"
        >
            Log Out
        </button>
    );
};

export default LogoutButton;