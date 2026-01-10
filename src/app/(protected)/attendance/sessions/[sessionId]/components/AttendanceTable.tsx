'use client';

import {
    Box,
    Button,
    Chip,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useAttendanceFilter } from '../_context/AttendanceFilterContext';
import AttendanceAuditDrawer from './AttendanceAuditDrawer';
import { useAttendanceSession } from '@/lib/features/attendance/useAttendanceSession';


interface AttendanceTableProps {
    sessionId: number;
}

/**
 * Dummy attendance data
 * Replace with API later
 */
const mockAttendance = [
    {
        attendanceId: 1,
        rollNo: 1,
        studentName: 'Amit Kale',
        status: 'PRESENT',
    },
    {
        attendanceId: 2,
        rollNo: 2,
        studentName: 'Sneha Joshi',
        status: 'ABSENT',
    },
    {
        attendanceId: 3,
        rollNo: 3,
        studentName: 'Rohan Patil',
        status: 'LATE',
    },
    {
        attendanceId: 4,
        rollNo: 4,
        studentName: 'Pooja Deshmukh',
        status: 'PRESENT',
    },
];

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'LEAVE';

function StatusChip({
    label,
    value,
    color,
    selected,
    onClick,
}: StatusChipProps) {
    return (
        <Chip
            clickable
            label={label}
            color={selected ? color : 'default'}
            onClick={() => onClick(value)}
            size="small"
            sx={{
                fontWeight: selected ? 600 : 400,
            }}
        />
    );
}


function StatusButtons({
    value,
    onChange,
}: StatusButtonsProps) {
    return (
        <Stack direction="row" spacing={0.5}>
            <StatusChip
                label="Present"
                value="PRESENT"
                color="success"
                selected={value === 'PRESENT'}
                onClick={onChange}
            />
            <StatusChip
                label="Absent"
                value="ABSENT"
                color="error"
                selected={value === 'ABSENT'}
                onClick={onChange}
            />
            <StatusChip
                label="Late"
                value="LATE"
                color="warning"
                selected={value === 'LATE'}
                onClick={onChange}
            />
            <StatusChip
                label="Leave"
                value="LEAVE"
                color="info"
                selected={value === 'LEAVE'}
                onClick={onChange}
            />
        </Stack>
    );
}


export default function AttendanceTable({
    sessionId,
}: AttendanceTableProps) {
    const [rows, setRows] = useState(mockAttendance);
    const { filter, isLocked } = useAttendanceSession();

    const [auditOpen, setAuditOpen] = useState(false);

    // Track modified rows only
    const modifiedRows = useMemo(
        () =>
            rows.filter((r) => {
                const original = mockAttendance.find(
                    (o) => o.attendanceId === r.attendanceId
                );
                return original?.status !== r.status;
            }),
        [rows]
    );

    const filteredRows = useMemo(() => {
        if (filter === 'ALL') return rows;
        return rows.filter(r => r.status === filter);
    }, [rows, filter]);

    const handleStatusChange = (
        attendanceId: number,
        newStatus: AttendanceStatus
    ) => {
        setRows((prev) =>
            prev.map((row) =>
                row.attendanceId === attendanceId
                    ? { ...row, status: newStatus }
                    : row
            )
        );
    };

    return (
        <Box>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 1.5 }}
            >
                <Typography variant="subtitle1" fontWeight={600}>
                    Student Attendance
                </Typography>

                <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setAuditOpen(true)}
                >
                    View Audit Log
                </Button>
            </Stack>


            {/* Unsaved changes banner */}
            {modifiedRows.length > 0 && (
                <Box
                    sx={{
                        mb: 2,
                        p: 1.5,
                        bgcolor: 'warning.light',
                        borderRadius: 1,
                    }}
                >
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Typography fontWeight={600}>
                            ⚠ {modifiedRows.length} unsaved change(s)
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <Button
                                size="small"
                                variant="contained"
                                onClick={() =>
                                    alert(
                                        `Saving ${modifiedRows.length} change(s)`
                                    )
                                }
                            >
                                Save
                            </Button>
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() => setRows(mockAttendance)}
                            >
                                Discard
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            )}

            <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell width={80}>Roll</TableCell>
                            <TableCell>Student</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {filteredRows.map((row) => {
                            const original = mockAttendance.find(
                                (o) => o.attendanceId === row.attendanceId
                            );
                            const isModified =
                                original?.status !== row.status;

                            return (
                                <TableRow
                                    key={row.attendanceId}
                                    sx={{
                                        bgcolor: isModified
                                            ? 'warning.lighter'
                                            : undefined,
                                    }}
                                >
                                    <TableCell>{row.rollNo}</TableCell>
                                    <TableCell>{row.studentName}</TableCell>
                                    <TableCell>
                                        <StatusButtons
                                            value={row.status as AttendanceStatus}
                                            onChange={(status: AttendanceStatus) =>
                                                handleStatusChange(row.attendanceId, status)
                                            }
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <AttendanceAuditDrawer
                open={auditOpen}
                onClose={() => setAuditOpen(false)}
                sessionId={sessionId}
            />

        </Box>
    );
}

/* =========================================================
   Status Buttons (Fast UX)
   ========================================================= */

interface StatusButtonsProps {
    value: AttendanceStatus;
    onChange: (value: AttendanceStatus) => void;
}



interface StatusChipProps {
    label: string;
    value: AttendanceStatus;
    color:
    | 'success'
    | 'error'
    | 'warning'
    | 'info';
    selected: boolean;
    onClick: (value: AttendanceStatus) => void;
}

