'use client';

import {
    Box,
    Button,
    Stack,
    Typography,
} from '@mui/material';
import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Sessions list error:', error);
    }, [error]);

    return (
        <Box sx={{ p: 3 }}>
            <Stack spacing={2}>
                <Typography variant="h5" color="error">
                    Unable to load attendance sessions
                </Typography>

                <Typography color="text.secondary">
                    Please try again.
                </Typography>

                <Stack direction="row" spacing={1}>
                    <Button variant="contained" onClick={reset}>
                        Retry
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => window.history.back()}
                    >
                        Go Back
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}
