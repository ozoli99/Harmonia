import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/ToastContainer';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <ToastProvider>
            <App />
            <ToastContainer />
        </ToastProvider>
    </React.StrictMode>
);