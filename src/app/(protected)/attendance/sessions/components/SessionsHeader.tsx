'use client';

import {
    Box,
    Button,
    Stack,
    Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function SessionsHeader() {
    // later: derive from auth / role
    const canCreateSession = true;

    return (
        <Box>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={2}
            >
                {/* ================= LEFT ================= */}
                <Stack spacing={0.5}>
                    <Typography variant="h5" fontWeight={600}>
                        Attendance Sessions
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Manage daily attendance sessions
                    </Typography>
                </Stack>

                {/* ================= RIGHT ================= */}
                {canCreateSession && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => alert('Create Session – coming soon')}
                    >
                        New Session
                    </Button>
                )}
            </Stack>
        </Box>
    );
}
