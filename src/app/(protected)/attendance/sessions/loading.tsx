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
                <Typography variant="h6">
                    Loading attendance sessions…
                </Typography>
                <CircularProgress />
            </Stack>
        </Box>
    );
}
