import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export const Loader = ({  fullScreen = true }) => {
    const loaderElement = (
        <div className={`flex items-center justify-center`}>
            <DotLottieReact
                src="https://lottie.host/82391125-bf42-492a-919a-3194b3f1477b/LBKW9weUIA.lottie"
                loop
                autoplay
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50 min-h-screen">
                {loaderElement}
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-[200px]">
            {loaderElement}
        </div>
    );
};

export const LoadingButton = ({ loading, children, ...props }) => {
    return (
        <button
            disabled={loading}
            className={`relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${props.className || ''}`}
            {...props}
        >
            {loading && (
                <span className="absolute left-4 w-6 h-6">
                    <DotLottieReact
                        src="https://lottie.host/82391125-bf42-492a-919a-3194b3f1477b/LBKW9weUIA.lottie"
                        loop
                        autoplay
                    />
                </span>
            )}
            <span className={loading ? 'pl-8' : ''}>
                {children}
            </span>
        </button>
    );
};