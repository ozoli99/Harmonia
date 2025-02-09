import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./index.css";

const clerkPublishableKey = "pk_test_Z3JhdGVmdWwtbW90aC05NC5jbGVyay5hY2NvdW50cy5kZXYk"; // Get this from your Clerk Dashboard

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <React.StrictMode>
        <ClerkProvider publishableKey={clerkPublishableKey}>
            <Router>
                <App />
            </Router>
        </ClerkProvider>
    </React.StrictMode>
);