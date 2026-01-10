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
} from '@mui/material';

import {
    Groups,
    Event,
    Schedule,
    Room,
    Person,
    Add,
    Visibility,
    Assessment,
} from '@mui/icons-material';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchBatchesByStudentId } from '@/lib/features/batch/batchThunks';
import type { Batch } from '@/lib/features/batch/batchTypes';
import { createSBA } from '@/lib/features/studentBatchAssignment/studentBatchAssignmentThunks';

/* =====================================================
   TYPES
===================================================== */
type RightPanelView = 'SUMMARY' | 'SCHEDULE' | 'ATTENDANCE';

/* =====================================================
   MAIN COMPONENT
===================================================== */
export default function BatchesTab({ studentId }: { studentId: number }) {
    const dispatch = useAppDispatch();

    const { studentBatches, loading, error } = useAppSelector(
        (state) => state.batches
    );

    const todayIsoDate = () =>
        new Date().toISOString().split('T')[0];


    const handleAssignBatch = async (batch: Batch) => {
        try {
            const payload = {
                studentEnrollmentId: batch.studentEnrollmentId,
                batchId: batch.batchId,
                assignmentDate: todayIsoDate(),
                assignmentType: 'fresh',
                remark: null,
                isActive: true,
            };

            // ✅ unwrap() throws error if rejected
            await dispatch(createSBA(payload)).unwrap();

            // ✅ ALWAYS refetch after success
            await dispatch(fetchBatchesByStudentId(studentId)).unwrap();

        } catch (err: any) {
            console.error('Assign failed:', err);
            alert(err?.error || 'Failed to assign batch');
        }
    };


    const [rightView, setRightView] =
        useState<RightPanelView>('SUMMARY');
    const [selectedBatch, setSelectedBatch] =
        useState<Batch | null>(null);

    /* =====================================================
       FETCH BATCHES BY STUDENT
    ===================================================== */
    useEffect(() => {
        if (studentId) {
            dispatch(fetchBatchesByStudentId(studentId));
        }
    }, [studentId, dispatch]);

    /* =====================================================
       DERIVED STATS
    ===================================================== */
    const assignedCount = useMemo(
        () => studentBatches.length,
        [studentBatches]
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
         LEFT COLUMN — BATCH LIST
      ===================================================== */}
            <Grid size={{ xs: 12, md: 8 }}>
                {loading && <CircularProgress size={24} />}

                {error && (
                    <Typography color="error">
                        {error.error || 'Failed to load batches'}
                    </Typography>
                )}

                {!loading && studentBatches.length === 0 && (
                    <Typography color="text.secondary">
                        No batches assigned to this student.
                    </Typography>
                )}

                <Stack spacing={2}>
                    {studentBatches.map((batch) => (
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
                                        value={`${batch.startTime ?? '--'} (${batch.batchDurationInHr ?? '--'
                                            } Hr)`}
                                    />
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 2 }} />

                            {/* ACTIONS */}
                            <Stack direction="row" spacing={2} flexWrap="wrap">

                                {!batch.isAssigned && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<Add />}
                                        size="small"
                                        onClick={() => handleAssignBatch(batch)}
                                    >
                                        Assign to Batch
                                    </Button>
                                )}

                                {/* <Button
                                    variant="outlined"
                                    startIcon={<Visibility />}
                                    size="small"
                                    disabled={!batch.isAssigned}
                                    onClick={() => {
                                        setSelectedBatch(batch);
                                        setRightView('SCHEDULE');
                                    }}
                                >
                                    View Batch Schedule
                                </Button> */}

                                {/* <Button
                                    variant="outlined"
                                    startIcon={<Assessment />}
                                    size="small"
                                    disabled={!batch.isAssigned}
                                    onClick={() => {
                                        setSelectedBatch(batch);
                                        setRightView('ATTENDANCE');
                                    }}
                                >
                                    Attendance Report
                                </Button> */}
                            </Stack>

                        </Paper>
                    ))}
                </Stack>
            </Grid>

            {/* =====================================================
         RIGHT COLUMN — DYNAMIC PANEL
      ===================================================== */}
            <Grid size={{ xs: 12, md: 4 }}>
                {rightView === 'SUMMARY' && (
                    <BatchSummary
                        studentId={studentId}
                        total={studentBatches.length}
                        assigned={assignedCount}
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
    studentId,
    total,
    assigned,
}: {
    studentId: number;
    total: number;
    assigned: number;
}) {
    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Batch Summary</Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2">Student ID</Typography>
            <Typography>{studentId}</Typography>

            <Typography variant="subtitle2">Total Batches</Typography>
            <Typography>{total}</Typography>

            <Typography variant="subtitle2">Assigned Batches</Typography>
            <Typography>{assigned}</Typography>
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
                Schedule table goes here...
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
                <Typography variant="h6">Attendance Report</Typography>
                <Button size="small" onClick={onClose}>
                    ✕
                </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2">Batch Code</Typography>
            <Typography>{batch.batchCode}</Typography>

            <Typography sx={{ mt: 2 }} color="text.secondary">
                Attendance report goes here...
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
