import React, { ReactNode } from 'react';

interface ErrorBoundaryProps {
    fallback?: (error: Error) => ReactNode;
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo): void {
        console.error('Caught in ErrorBoundary:', error, info);
    }

    render(): ReactNode {
        const { hasError, error } = this.state;

        if (hasError && error) {
            if (typeof this.props.fallback === 'function') {
                return this.props.fallback(error);
            }

            return (
                <div>
                    <div style={{ color: 'red' }}>{error.message}</div>
                </div>
            );
        }

        return this.props.children;
    }
}
