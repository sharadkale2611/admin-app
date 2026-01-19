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
    Alert,
    Skeleton,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import AttendanceAuditDrawer from './AttendanceAuditDrawer';
import { useAttendanceSession } from '@/lib/features/attendance/useAttendanceSession';
import {
    useAttendanceSessionData,
    type AttendanceStatus,
} from '../_context/AttendanceSessionDataContext';


interface AttendanceTableProps {
    sessionId: number;
}

type AttendanceRow = {
    attendanceId: number;
    studentId: number;
    rollNo: string | null;
    studentName: string;
    status: AttendanceStatus;
};

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
                value="Present"
                color="success"
                selected={value === 'Present'}
                onClick={onChange}
            />
            <StatusChip
                label="Absent"
                value="Absent"
                color="error"
                selected={value === 'Absent'}
                onClick={onChange}
            />
            <StatusChip
                label="Late"
                value="Late"
                color="warning"
                selected={value === 'Late'}
                onClick={onChange}
            />
            <StatusChip
                label="Leave"
                value="Leave"
                color="info"
                selected={value === 'Leave'}
                onClick={onChange}
            />
        </Stack>
    );
}


export default function AttendanceTable({
    sessionId,
}: AttendanceTableProps) {
    const { filter, isLocked } = useAttendanceSession();
    const {
        data,
        loading,
        error,
        updating,
        updateError,
        updateStatuses,
    } = useAttendanceSessionData();

    const [rows, setRows] = useState<AttendanceRow[]>([]);
    const [originalRows, setOriginalRows] = useState<AttendanceRow[]>([]);

    const [auditOpen, setAuditOpen] = useState(false);

    useEffect(() => {
        if (!data?.studentAttendance) return;

        const next: AttendanceRow[] = data.studentAttendance.map((a) => ({
            attendanceId: a.attendanceId,
            studentId: a.studentId,
            rollNo: a.rollNo,
            studentName: a.studentName,
            status: a.status,
        }));

        setRows(next);
        setOriginalRows(next);
    }, [data?.studentAttendance]);

    // Track modified rows only
    const modifiedRows = useMemo(
        () =>
            rows.filter((r) => {
                const original = originalRows.find(
                    (o) => o.attendanceId === r.attendanceId
                );
                return original?.status !== r.status;
            }),
        [rows, originalRows]
    );

    const filteredRows = useMemo(() => {
        if (filter === 'ALL') return rows;
        return rows.filter((r) => r.status === filter);
    }, [rows, filter]);

    const handleStatusChange = (
        attendanceId: number,
        newStatus: AttendanceStatus
    ) => {
        if (isLocked) return;
        setRows((prev) =>
            prev.map((row) =>
                row.attendanceId === attendanceId
                    ? { ...row, status: newStatus }
                    : row
            )
        );
    };

    const handleDiscard = () => {
        setRows(originalRows);
    };

    const handleSave = async () => {
        const updates = modifiedRows.map((r) => ({
            attendanceId: r.attendanceId,
            studentId: r.studentId,
            status: r.status,
        }));

        const ok = await updateStatuses(updates);
        if (ok) {
            // provider refetches; effect will sync rows + originals
        }
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

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {updateError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {updateError}
                </Alert>
            )}


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
                                disabled={isLocked || updating}
                                onClick={handleSave}
                            >
                                {updating ? 'Saving...' : 'Save'}
                            </Button>
                            <Button
                                size="small"
                                variant="outlined"
                                disabled={updating}
                                onClick={handleDiscard}
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
                        {loading &&
                            Array.from({ length: 8 }).map((_, idx) => (
                                <TableRow key={`sk-${idx}`}>
                                    <TableCell>
                                        <Skeleton width={40} />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton width={220} />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton width={260} />
                                    </TableCell>
                                </TableRow>
                            ))}

                        {!loading &&
                            filteredRows.map((row) => {
                                const original = originalRows.find(
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
                                        <TableCell>{row.rollNo || '—'}</TableCell>
                                        <TableCell>{row.studentName}</TableCell>
                                        <TableCell>
                                            <StatusButtons
                                                value={row.status}
                                                onChange={(status) =>
                                                    handleStatusChange(
                                                        row.attendanceId,
                                                        status
                                                    )
                                                }
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}

                        {!loading && filteredRows.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    <Typography color="text.secondary">
                                        No students found
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
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

