'use client';

import React from 'react';
import {
    Paper,
    Typography,
    Divider,
    Grid,
    Box,
    Chip
} from '@mui/material';

import {
    CalendarMonth,
    AccessTime,
    Class,
    Event
} from '@mui/icons-material';

import { useAppSelector } from '@/lib/hooks';

/* ---------- HELPERS ---------- */
const formatDate = (date?: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const formatTime = (time?: string | null) => {
    if (!time) return '-';
    return time.slice(0, 5);
};

export default function ScheduleInfoTab() {
    const { currentBatch } = useAppSelector(
        state => state.batches
    );

    if (!currentBatch) return null;

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6">
                Schedule Information
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={3}>
                {/* Start Date */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <CalendarMonth fontSize="small" />
                        <Typography variant="subtitle2">
                            Start Date
                        </Typography>
                    </Box>
                    <Typography>
                        {formatDate(currentBatch.startDate)}
                    </Typography>
                </Grid>

                {/* End Date */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <Event fontSize="small" />
                        <Typography variant="subtitle2">
                            End Date
                        </Typography>
                    </Box>
                    <Typography>
                        {formatDate(currentBatch.endDate)}
                    </Typography>
                </Grid>

                {/* Start Time */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <AccessTime fontSize="small" />
                        <Typography variant="subtitle2">
                            Start Time
                        </Typography>
                    </Box>
                    <Typography>
                        {formatTime(currentBatch.startTime)}
                    </Typography>
                </Grid>

                {/* Duration */}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <Class fontSize="small" />
                        <Typography variant="subtitle2">
                            Duration
                        </Typography>
                    </Box>
                    <Typography>
                        {currentBatch.batchDurationInHr} hours
                    </Typography>
                </Grid>

                {/* Status */}
                <Grid size={{ xs: 12 }}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Batch Status
                    </Typography>
                    <Chip
                        label={currentBatch.isActive ? 'Active' : 'Inactive'}
                        color={currentBatch.isActive ? 'success' : 'error'}
                        size="small"
                    />
                </Grid>
            </Grid>
        </Paper>
    );
}
