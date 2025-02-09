import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth0Provider, Auth0ProviderOptions } from '@auth0/auth0-react';

interface Auth0ProviderWithHistoryProps {
    children: React.ReactNode;
}

const Auth0ProviderWithHistory: React.FC<Auth0ProviderWithHistoryProps> = ({ children }) => {
    const domain = process.env.REACT_APP_AUTH0_DOMAIN!;
    const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID!;
    const audience = process.env.REACT_APP_AUTH0_AUDIENCE!;
    const redirectUri = process.env.REACT_APP_AUTH0_CALLBACK_URL || window.location.origin;
    const navigate = useNavigate();

    const onRedirectCallback = (appState?: { returnTo?: string }) => {
        navigate(appState?.returnTo || window.location.pathname);
    };

    return (
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            authorizationParams={{
                redirect_uri: redirectUri,
                audience: audience,
            }}
            onRedirectCallback={onRedirectCallback}
            useRefreshTokens={true}
            cacheLocation="localstorage"
        >
            {children}
        </Auth0Provider>
    );
};

export default Auth0ProviderWithHistory;