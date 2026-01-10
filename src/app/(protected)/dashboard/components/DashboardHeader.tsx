'use client';

import {
    Box,
    Stack,
    Typography,
} from '@mui/material';
import { format } from 'date-fns';

export default function DashboardHeader() {
    const now = new Date();
    const hour = now.getHours();

    const greeting =
        hour < 12
            ? 'Good morning'
            : hour < 18
                ? 'Good afternoon'
                : 'Good evening';

    return (
        <Box>
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                justifyContent="space-between"
                spacing={2}
            >
                {/* LEFT */}
                <Stack spacing={0.5}>
                    <Typography variant="h5" fontWeight={600}>
                        {greeting}, Admin 👋
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Here’s what’s happening at your institute today
                    </Typography>
                </Stack>

                {/* RIGHT */}
                <Stack
                    alignItems={{ xs: 'flex-start', md: 'flex-end' }}
                >
                    <Typography variant="body2" color="text.secondary">
                        {format(now, 'EEEE, dd MMM yyyy')}
                    </Typography>
                </Stack>
            </Stack>
        </Box>
    );
}
