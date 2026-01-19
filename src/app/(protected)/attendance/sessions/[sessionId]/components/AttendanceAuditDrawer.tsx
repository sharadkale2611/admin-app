'use client';

// src/app/(protected)/attendance/sessions/[sessionId]/components/AttendanceAuditDrawer.tsx
import {
    Drawer,
    Box,
    Typography,
    Stack,
    Divider,
    Chip,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface AttendanceAuditDrawerProps {
    open: boolean;
    onClose: () => void;
    sessionId: number;
}

/**
 * Dummy audit log data
 * Replace with API later
 */
const mockAuditLogs = [
    {
        id: 1,
        studentName: 'Amit Kale',
        oldStatus: 'ABSENT',
        newStatus: 'PRESENT',
        changedBy: 'Admin',
        changedAt: '2026-01-12 10:12',
        reason: 'Student was present but marked absent by mistake',
    },
    {
        id: 2,
        studentName: 'Sneha Joshi',
        oldStatus: 'PRESENT',
        newStatus: 'ABSENT',
        changedBy: 'Rahul Patil',
        changedAt: '2026-01-12 09:06',
        reason: 'Student arrived late and left',
    },
];

export default function AttendanceAuditDrawer({
    open,
    onClose,
    sessionId,
}: AttendanceAuditDrawerProps) {
    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{ sx: { width: 420 } }}
        >
            <Box sx={{ p: 2 }}>
                {/* Header */}
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography variant="h6">
                        Attendance Audit Log
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Stack>

                <Typography variant="body2" color="text.secondary">
                    Session ID: {sessionId}
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* Logs */}
                <Stack spacing={2}>
                    {mockAuditLogs.map((log) => (
                        <Box
                            key={log.id}
                            sx={{
                                p: 1.5,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1,
                            }}
                        >
                            <Typography fontWeight={600}>
                                {log.studentName}
                            </Typography>

                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                sx={{ my: 0.5 }}
                            >
                                <Chip
                                    label={log.oldStatus}
                                    size="small"
                                />
                                →
                                <Chip
                                    label={log.newStatus}
                                    color="success"
                                    size="small"
                                />
                            </Stack>

                            <Typography variant="body2">
                                Changed by <b>{log.changedBy}</b>
                            </Typography>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                {log.changedAt}
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{ mt: 1 }}
                            >
                                Reason: {log.reason}
                            </Typography>
                        </Box>
                    ))}
                </Stack>
            </Box>
        </Drawer>
    );
}
