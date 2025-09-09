'use client';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: 'primary' | 'secondary' | 'white';
    className?: string;
    text?: string;
    textClassName?: string;
}

export default function LoadingSpinner({
    size = 'md',
    color = 'primary',
    className = '',
    text,
    textClassName = '',
}: LoadingSpinnerProps) {
    // Size classes
    const getSizeClasses = () => {
        switch (size) {
            case 'sm': return 'h-4 w-4 border-2';
            case 'md': return 'h-8 w-8 border-4';
            case 'lg': return 'h-12 w-12 border-4';
            default: return 'h-8 w-8 border-4';
        }
    };

    // Color classes
    const getColorClasses = () => {
        switch (color) {
            case 'primary':
                return 'border-t-blue-600 border-r-blue-600 border-b-transparent border-l-transparent';
            case 'secondary':
                return 'border-t-green-500 border-r-green-500 border-b-transparent border-l-transparent';
            case 'white':
                return 'border-t-white border-r-white border-b-transparent border-l-transparent';
            default:
                return 'border-t-blue-600 border-r-blue-600 border-b-transparent border-l-transparent';
        }
    };

    return (
        <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
            <div
                className={`animate-spin rounded-full ${getSizeClasses()} ${getColorClasses()}`}
                style={{ animationDuration: '0.75s' }}
            />
            {text && (
                <p className={`text-sm text-gray-500 ${textClassName}`}>
                    {text}
                </p>
            )}
        </div>
    );
}