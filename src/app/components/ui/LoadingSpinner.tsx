'use client';

import { Box, CircularProgress, Typography, useTheme } from '@mui/material';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: 'primary' | 'secondary' | 'inherit';
    label?: string;
    subLabel?: string;
    center?: boolean;
}

export default function LoadingSpinner({
    size = 'md',
    color = 'primary',
    label,
    subLabel,
    center = true,
}: LoadingSpinnerProps) {
    const theme = useTheme();

    const sizeMap = {
        sm: 20,
        md: 36,
        lg: 56,
    };

    return (
        <Box
            role="status"
            aria-live="polite"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: center ? 'center' : 'flex-start',
                justifyContent: center ? 'center' : 'flex-start',
                gap: 1.5,
            }}
        >
            {/* Spinner */}
            <Box sx={{ position: 'relative' }}>
                {/* Soft background ring */}
                <CircularProgress
                    variant="determinate"
                    value={100}
                    size={sizeMap[size]}
                    thickness={4}
                    sx={{
                        color: theme.palette.action.disabledBackground,
                    }}
                />

                {/* Active spinner */}
                <CircularProgress
                    size={sizeMap[size]}
                    thickness={4}
                    color={color}
                    sx={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        animationDuration: '0.9s',
                    }}
                />
            </Box>

            {/* Text */}
            {(label || subLabel) && (
                <Box textAlign={center ? 'center' : 'left'}>
                    {label && (
                        <Typography
                            variant="body2"
                            fontWeight={500}
                            color="text.primary"
                        >
                            {label}
                        </Typography>
                    )}
                    {subLabel && (
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            {subLabel}
                        </Typography>
                    )}
                </Box>
            )}

            {/* Screen reader fallback */}
            <Typography component="span" sx={{ display: 'none' }}>
                Loading
            </Typography>
        </Box>
    );
}
