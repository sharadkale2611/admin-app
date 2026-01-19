import {
    Box,
    CircularProgress,
    Stack,
    Typography,
    Skeleton,
} from '@mui/material';

export default function Loading() {
    return (
        <Box sx={{ p: 3 }}>
            <Stack spacing={3}>
                {/* Header */}
                <Stack spacing={1}>
                    <Typography variant="h5">
                        Loading dashboard…
                    </Typography>
                    <CircularProgress size={24} />
                </Stack>

                {/* KPI cards skeleton */}
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                >
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton
                            key={i}
                            variant="rounded"
                            height={100}
                            sx={{ flex: 1 }}
                        />
                    ))}
                </Stack>

                {/* Main sections */}
                <Skeleton variant="rounded" height={180} />
                <Skeleton variant="rounded" height={140} />
                <Skeleton variant="rounded" height={200} />
            </Stack>
        </Box>
    );
}
