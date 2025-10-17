import React from 'react';

interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
    message,
    onRetry,
}) => {
    return (
        <div
            className="bg-red-50 border border-red-200 rounded-lg p-4"
            role="alert"
            aria-live="assertive"
        >
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <svg
                        className="w-5 h-5 text-red-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
                <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-red-800" id="error-title">
                        Error
                    </h3>
                    <p className="mt-1 text-sm text-red-700" aria-describedby="error-title">
                        {message}
                    </p>
                    {onRetry && (
                        <div className="mt-3">
                            <button
                                onClick={onRetry}
                                className="bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-4 rounded-md text-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus:ring-offset-2"
                                aria-label="Retry the failed operation"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ErrorMessage;