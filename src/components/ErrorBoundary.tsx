// ErrorBoundary component - Catches and handles React component errors gracefully
import React from "react";

export default class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false }; // Track error state
    }

    // Update state when an error occurs in child components
    static getDerivedStateFromError() {
        return { hasError: true };
    }

    // Log error details for debugging
    componentDidCatch(error: any, info: any) {
        console.error("ErrorBoundary caught:", error, info);
    }

    render() {
        // Display fallback UI when an error occurs
        if (this.state.hasError) {
            return <div className="glass p-4 rounded">Something went wrong.</div>;
        }
        // Render child components normally when no error
        return this.props.children;
    }
}
