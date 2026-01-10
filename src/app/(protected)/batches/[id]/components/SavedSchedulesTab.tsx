'use client';

import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Divider,
    Button,
    Alert,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip
} from '@mui/material';

import { CalendarMonth, Replay } from '@mui/icons-material';

import { useAppSelector } from '@/lib/hooks';

interface SavedSchedulesTabProps {
    batchId: number;
}

/* ---------- HELPERS ---------- */
const formatScheduleDate = (dateString: string) => {
    const d = new Date(dateString);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const dayName = days[d.getDay()];
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();

    return `[${dayName}] ${dd}-${mm}-${yyyy}`;
};

export default function SavedSchedulesTab({
    batchId
}: SavedSchedulesTabProps) {
    const schedules = useAppSelector(
        state => state.batchSchedules.items
    );

    const staffList = useAppSelector(
        state => state.staff.dropdownStaff
    );

    const classRooms = useAppSelector(
        state => state.classRooms.classRooms
    );

    const hasSchedules = schedules.length > 0;

    return (
        <Paper sx={{ p: 3 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                }}
            >
                <Typography variant="h6">
                    Saved Schedules
                </Typography>

                <Button
                    component="a"
                    target="_blank"
                    href={`/batch-schedules/${batchId}`}
                    variant={hasSchedules ? 'outlined' : 'contained'}
                    startIcon={hasSchedules ? <Replay /> : <CalendarMonth />}
                >
                    {hasSchedules ? 'Re-Schedule' : 'Schedule Now'}
                </Button>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {!hasSchedules ? (
                <Alert severity="info">
                    No schedules found for this batch.
                </Alert>
            ) : (
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Trainer</TableCell>
                            <TableCell>Classroom</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {schedules.map((s, idx) => {
                            const d = new Date(s.expectedDateTime);
                            const timeStr = d.toTimeString().slice(0, 5);

                            const trainer =
                                staffList.find(
                                    t =>
                                        Number(t.staffId) ===
                                        Number(s.expectedTrainerId)
                                ) || null;

                            const trainerName = trainer
                                ? `${trainer.firstName} ${trainer.lastName}`
                                : '-';

                            const classRoomName =
                                classRooms.find(
                                    c => c.classRoomId === s.classRoomId
                                )?.classRoomName ?? '-';

                            return (
                                <TableRow key={s.batchScheduleId}>
                                    <TableCell>{idx + 1}</TableCell>

                                    <TableCell>
                                        {formatScheduleDate(s.expectedDateTime)}
                                    </TableCell>

                                    <TableCell>{timeStr}</TableCell>

                                    <TableCell>
                                        <Chip
                                            size="small"
                                            label={s.status}
                                            color={
                                                s.status === 'Completed'
                                                    ? 'success'
                                                    : s.status === 'Cancelled'
                                                        ? 'error'
                                                        : 'warning'
                                            }
                                        />
                                    </TableCell>

                                    <TableCell>{trainerName}</TableCell>

                                    <TableCell>{classRoomName}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            )}
        </Paper>
    );
}
