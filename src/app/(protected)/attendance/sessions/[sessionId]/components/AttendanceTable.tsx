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
    Radio,
    RadioGroup,
    FormControlLabel,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import AttendanceAuditDrawer from './AttendanceAuditDrawer';
import { useAttendanceSession } from '@/lib/features/attendance/useAttendanceSession';
import {
    useAttendanceSessionData,
    type AttendanceStatus,
} from '../_context/AttendanceSessionDataContext';
import AttendanceSaveBar from './AttendanceSaveBar';


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

const filterToStatus = (filter: string): AttendanceStatus | null => {
    switch ((filter ?? '').toUpperCase()) {
        case 'PRESENT':
            return 'Present';
        case 'ABSENT':
            return 'Absent';
        case 'LATE':
            return 'Late';
        case 'LEAVE':
            return 'Leave';
        case 'ALL':
        default:
            return null;
    }
};

const statusChipColor = (
    status: AttendanceStatus
): 'success' | 'error' | 'warning' | 'info' | 'default' => {
    switch (status) {
        case 'Present':
            return 'success';
        case 'Absent':
            return 'error';
        case 'Late':
            return 'warning';
        case 'Leave':
            return 'info';
        default:
            return 'default';
    }
};

function StatusReadOnly({ status }: { status: AttendanceStatus }) {
    return (
        <Chip
            size="small"
            label={status}
            color={statusChipColor(status)}
            variant={status === 'Pending' ? 'outlined' : 'filled'}
            sx={{ fontWeight: 600 }}
        />
    );
}

function StatusRadioButtons({
    value,
    onChange,
    disabled,
}: {
    value: AttendanceStatus;
    onChange: (value: AttendanceStatus) => void;
    disabled: boolean;
}) {
    return (
        <RadioGroup
            row
            value={value}
            onChange={(e) => onChange(e.target.value as AttendanceStatus)}
        >
            {(['Present', 'Absent', 'Late', 'Leave'] as AttendanceStatus[]).map(
                (s) => (
                    <FormControlLabel
                        key={s}
                        value={s}
                        control={<Radio size="small" />}
                        label={s}
                        disabled={disabled}
                    />
                )
            )}
        </RadioGroup>
    );
}


export default function AttendanceTable({
    sessionId,
}: AttendanceTableProps) {
    const { filter } = useAttendanceSession();
    const {
        data,
        loading,
        error,
        updating,
        updateError,
        updateStatuses,
    } = useAttendanceSessionData();

    const [rows, setRows] = useState<AttendanceRow[]>([]);
    const [baseRows, setBaseRows] = useState<AttendanceRow[]>([]);

    const [isEditing, setIsEditing] = useState(false);

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

        setBaseRows(next);
        setRows(next);
    }, [data?.studentAttendance]);

    const modifiedRows = useMemo(() => {
        return rows.filter((r) => {
            const original = baseRows.find(
                (b) => b.attendanceId === r.attendanceId
            );
            return original?.status !== r.status;
        });
    }, [rows, baseRows]);

    const filteredRows = useMemo(() => {
        const status = filterToStatus(filter);
        if (!status) return rows;
        return rows.filter((r) => r.status === status);
    }, [rows, filter]);

    const handleStatusChange = (
        attendanceId: number,
        newStatus: AttendanceStatus
    ) => {
        const current = rows.find((r) => r.attendanceId === attendanceId);
        if (!current) return;
        if (current.status === newStatus) return;

        setRows((prev) =>
            prev.map((r) =>
                r.attendanceId === attendanceId ? { ...r, status: newStatus } : r
            )
        );
    };

    const handleDiscard = () => {
        setRows(baseRows);
        setIsEditing(false);
    };

    const handleSave = async (_reason: string) => {
        if (!modifiedRows.length) return;

        const updates = modifiedRows.map((r) => ({
            attendanceId: r.attendanceId,
            studentId: r.studentId,
            status: r.status,
        }));

        const ok = await updateStatuses(updates);
        if (!ok) return;

        // server data will refresh via provider; keep UI consistent immediately
        setBaseRows(rows);
        setIsEditing(false);
    };

    const handleToggleEdit = () => {
        if (updating) return;
        if (isEditing) {
            setRows(baseRows);
            setIsEditing(false);
            return;
        }
        setIsEditing(true);
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

                <Stack direction="row" spacing={1} alignItems="center">
                    <Button
                        size="small"
                        variant={isEditing ? 'outlined' : 'contained'}
                        onClick={handleToggleEdit}
                        disabled={loading || !!error || updating}
                    >
                        {isEditing ? 'Cancel Edit' : 'Edit Attendance'}
                    </Button>
{/* 
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setAuditOpen(true)}
                        disabled={loading}
                    >
                        View Audit Log
                    </Button> */}
                </Stack>
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

                        <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell width={150}>Student Code</TableCell>
                            <TableCell width={180}>Student</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading &&
                            Array.from({ length: 8 }).map((_, idx) => (
                                <TableRow key={`sk-${idx}`}>
                                    <TableCell>
                                        <Skeleton width={150} />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton width={180} />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton width={260} />
                                    </TableCell>
                                </TableRow>
                            ))}

                        {!loading &&
                            filteredRows.map((row) => (
                                <TableRow key={row.attendanceId} hover>
                                    <TableCell>{row.rollNo || '—'}</TableCell>
                                    <TableCell>{row.studentName}</TableCell>
                                    <TableCell>
                                        {isEditing ? (
                                            <StatusRadioButtons
                                                value={row.status}
                                                disabled={updating}
                                                onChange={(status) =>
                                                    handleStatusChange(
                                                        row.attendanceId,
                                                        status
                                                    )
                                                }
                                            />
                                        ) : (
                                            <StatusReadOnly status={row.status} />
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}

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
            {/* <AttendanceAuditDrawer
                open={auditOpen}
                onClose={() => setAuditOpen(false)}
                sessionId={sessionId}
            /> */}

            <AttendanceSaveBar
                open={isEditing && modifiedRows.length > 0}
                modifiedCount={modifiedRows.length}
                onDiscard={handleDiscard}
                onSave={handleSave}
            />

        </Box>
    );
}

/* =========================================================
   Status Buttons (Fast UX)
   ========================================================= */

// (radio buttons used in edit mode)

