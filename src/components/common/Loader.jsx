/* eslint-disable react/prop-types */

export const Loader = ({ size = 'medium', fullScreen = false }) => {
    const sizeClasses = {
        small: 'w-4 h-4',
        medium: 'w-8 h-8',
        large: 'w-12 h-12'
    };

    const loaderElement = (
        <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-200 border-t-blue-600`} />
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
                {loaderElement}
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center p-4">
            {loaderElement}
        </div>
    );
};

// Loading Button Component
// eslint-disable-next-line react/prop-types
export const LoadingButton = ({ loading, children, ...props }) => {
    return (
        <button
            disabled={loading}
            className={`relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${props.className || ''}`}
            {...props}
        >
            {loading && (
                <span className="absolute left-4">
                    <Loader size="small" />
                </span>
            )}
            <span className={loading ? 'pl-6' : ''}>
                {children}
            </span>
        </button>
    );
};