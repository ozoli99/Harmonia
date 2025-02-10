import React, { ErrorInfo } from "react";

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8">
                    <h2 className="text-3xl font-bold text-red-500">Something went wrong.</h2>
                    <p className="text-gray-700">Please try refreshing the page or contact support if the issue persists.</p>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;