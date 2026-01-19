// src/app/(protected)/courses/[id]/components/BatchesTab.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
    Grid,
    Paper,
    Typography,
    Button,
    Box,
    Chip,
    Divider,
    Stack,
    CircularProgress,
    Alert,
} from '@mui/material';

import {
    Groups,
    Event,
    Schedule,
    Room,
    Person,
    Assessment,
} from '@mui/icons-material';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import type { Batch } from '@/lib/features/batch/batchTypes';
import { fetchBatchesByCourseId } from '@/lib/features/batch/batchThunks';

/* =====================================================
   TYPES
===================================================== */
type RightPanelView = 'SUMMARY' | 'SCHEDULE' | 'ATTENDANCE';

/* =====================================================
   MAIN COMPONENT
===================================================== */
export function BatchesTab({ courseId }: { courseId: number }) {
    const dispatch = useAppDispatch();

    const { courseBatches, loading, error } = useAppSelector(
        (state) => state.batches
    );

    const [rightView, setRightView] =
        useState<RightPanelView>('SUMMARY');
    const [selectedBatch, setSelectedBatch] =
        useState<Batch | null>(null);

    /* =====================================================
       FETCH BATCHES BY COURSE
    ===================================================== */
    useEffect(() => {
        if (courseId) {
            dispatch(fetchBatchesByCourseId(courseId));
        }
    }, [courseId, dispatch]);

    /* =====================================================
       DERIVED DATA
    ===================================================== */
    const activeCount = useMemo(
        () => courseBatches.filter(b => b.isActive).length,
        [courseBatches]
    );

    const formatDate = (date?: string | null) =>
        date
            ? new Date(date).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            })
            : 'N/A';

    /* =====================================================
       RENDER
    ===================================================== */
    return (
        <Grid container spacing={3}>
            {/* =====================================================
         LEFT — BATCH LIST
      ===================================================== */}
            <Grid size={{ xs: 12, md: 8 }}>
                {loading && <CircularProgress size={24} />}

                {error && (
                    <Alert severity="error">
                        {error.error || 'Failed to load batches'}
                    </Alert>
                )}

                {!loading && courseBatches.length === 0 && (
                    <Alert severity="info">
                        No batches created for this course.
                    </Alert>
                )}

                <Stack spacing={2}>
                    {courseBatches.map((batch) => (
                        <Paper key={batch.batchId} sx={{ p: 3 }}>
                            {/* HEADER */}
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="h6">
                                    {batch.batchCode}
                                </Typography>

                                <Chip
                                    label={batch.isActive ? 'Active' : 'Inactive'}
                                    color={batch.isActive ? 'success' : 'default'}
                                    size="small"
                                />
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            {/* DETAILS */}
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <InfoRow
                                        icon={<Groups fontSize="small" />}
                                        label="Module"
                                        value={batch.moduleName ?? 'N/A'}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <InfoRow
                                        icon={<Person fontSize="small" />}
                                        label="Trainer"
                                        value={batch.trainerName ?? 'N/A'}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <InfoRow
                                        icon={<Room fontSize="small" />}
                                        label="Classroom"
                                        value={batch.classRoomName ?? 'N/A'}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <InfoRow
                                        icon={<Event fontSize="small" />}
                                        label="Duration"
                                        value={`${formatDate(batch.startDate)} → ${formatDate(
                                            batch.endDate
                                        )}`}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <InfoRow
                                        icon={<Schedule fontSize="small" />}
                                        label="Timing"
                                        value={`${batch.startTime ?? '--'} (${batch.batchDurationInHr ?? '--'} Hr)`}
                                    />
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 2 }} />

                            {/* ACTIONS */}
                            {/* <Stack direction="row" spacing={2} flexWrap="wrap">
                                <Button
                                    variant="outlined"
                                    startIcon={<Assessment />}
                                    size="small"
                                    onClick={() => {
                                        setSelectedBatch(batch);
                                        setRightView('ATTENDANCE');
                                    }}
                                >
                                    Attendance
                                </Button>

                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => {
                                        setSelectedBatch(batch);
                                        setRightView('SCHEDULE');
                                    }}
                                >
                                    Schedule
                                </Button>
                            </Stack> */}
                        </Paper>
                    ))}
                </Stack>
            </Grid>

            {/* =====================================================
         RIGHT — INFO PANEL
      ===================================================== */}
            <Grid size={{ xs: 12, md: 4 }}>
                {rightView === 'SUMMARY' && (
                    <BatchSummary
                        courseId={courseId}
                        total={courseBatches.length}
                        active={activeCount}
                    />
                )}

                {rightView === 'SCHEDULE' && selectedBatch && (
                    <BatchSchedulePanel
                        batch={selectedBatch}
                        onClose={() => setRightView('SUMMARY')}
                    />
                )}

                {rightView === 'ATTENDANCE' && selectedBatch && (
                    <AttendancePanel
                        batch={selectedBatch}
                        onClose={() => setRightView('SUMMARY')}
                    />
                )}
            </Grid>
        </Grid>
    );
}

/* =====================================================
   RIGHT PANEL COMPONENTS
===================================================== */

function BatchSummary({
    courseId,
    total,
    active,
}: {
    courseId: number;
    total: number;
    active: number;
}) {
    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Batch Summary</Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2">Course ID</Typography>
            <Typography>{courseId}</Typography>

            <Typography variant="subtitle2">Total Batches</Typography>
            <Typography>{total}</Typography>

            <Typography variant="subtitle2">Active Batches</Typography>
            <Typography>{active}</Typography>
        </Paper>
    );
}

function BatchSchedulePanel({
    batch,
    onClose,
}: {
    batch: Batch;
    onClose: () => void;
}) {
    return (
        <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between">
                <Typography variant="h6">Batch Schedule</Typography>
                <Button size="small" onClick={onClose}>
                    ✕
                </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2">Batch Code</Typography>
            <Typography>{batch.batchCode}</Typography>

            <Typography sx={{ mt: 2 }} color="text.secondary">
                Schedule view coming soon…
            </Typography>
        </Paper>
    );
}

function AttendancePanel({
    batch,
    onClose,
}: {
    batch: Batch;
    onClose: () => void;
}) {
    return (
        <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between">
                <Typography variant="h6">Attendance</Typography>
                <Button size="small" onClick={onClose}>
                    ✕
                </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2">Batch Code</Typography>
            <Typography>{batch.batchCode}</Typography>

            <Typography sx={{ mt: 2 }} color="text.secondary">
                Attendance report coming soon…
            </Typography>
        </Paper>
    );
}

/* =====================================================
   SMALL INFO ROW
===================================================== */
function InfoRow({
    label,
    value,
    icon,
}: {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
}) {
    return (
        <Box display="flex" alignItems="center" gap={1}>
            {icon}
            <Box>
                <Typography variant="subtitle2" color="text.secondary">
                    {label}
                </Typography>
                <Typography variant="body2">{value}</Typography>
            </Box>
        </Box>
    );
}
