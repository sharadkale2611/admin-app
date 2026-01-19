'use client';

import {
    Box,
    Button,
    Stack,
    Typography,
} from '@mui/material';
import { useEffect } from 'react';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({
    error,
    reset,
}: ErrorProps) {
    useEffect(() => {
        console.error('Dashboard error:', error);
    }, [error]);

    return (
        <Box sx={{ p: 3 }}>
            <Stack spacing={2} maxWidth={480}>
                <Typography variant="h5" color="error">
                    Something went wrong
                </Typography>

                <Typography color="text.secondary">
                    We couldn’t load the dashboard right now.
                    Please try again.
                </Typography>

                {/* Show error only in dev */}
                {process.env.NODE_ENV === 'development' && (
                    <Box
                        sx={{
                            bgcolor: 'grey.100',
                            p: 2,
                            borderRadius: 1,
                        }}
                    >
                        <Typography
                            variant="body2"
                            fontFamily="monospace"
                            color="error"
                        >
                            {error.message}
                        </Typography>
                    </Box>
                )}

                <Stack direction="row" spacing={1}>
                    <Button
                        variant="contained"
                        onClick={reset}
                    >
                        Retry
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={() => window.location.reload()}
                    >
                        Reload
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}
