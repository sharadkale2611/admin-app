import {
    Box,
    CircularProgress,
    Stack,
    Typography,
} from '@mui/material';

export default function Loading() {
    return (
        <Box sx={{ p: 3 }}>
            <Stack spacing={3}>
                {/* Header skeleton */}
                <Stack spacing={1}>
                    <Typography variant="h6">
                        Loading attendance session…
                    </Typography>
                    <CircularProgress size={24} />
                </Stack>

                {/* Summary skeleton */}
                <Stack direction="row" spacing={2}>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Box
                            key={i}
                            sx={{
                                width: 120,
                                height: 56,
                                bgcolor: 'grey.100',
                                borderRadius: 1,
                            }}
                        />
                    ))}
                </Stack>

                {/* Table skeleton */}
                <Box
                    sx={{
                        height: 360,
                        bgcolor: 'grey.100',
                        borderRadius: 1,
                    }}
                />
            </Stack>
        </Box>
    );
}
