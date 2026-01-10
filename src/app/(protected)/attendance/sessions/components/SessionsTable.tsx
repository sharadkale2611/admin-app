'use client';

import {
    Box,
    Button,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';

/**
 * Dummy sessions data
 * Replace with API later
 */
const mockSessions = [
    {
        sessionId: 101,
        date: '12 Jan 2026',
        batch: 'Batch 10-A',
        staff: 'Rahul Patil',
        time: '09:00 – 10:00',
        marked: '28/32',
        status: 'PARTIAL',
    },
    {
        sessionId: 102,
        date: '12 Jan 2026',
        batch: 'Batch 9-B',
        staff: 'Sneha Joshi',
        time: '10:00 – 11:00',
        marked: '0/30',
        status: 'PENDING',
    },
    {
        sessionId: 103,
        date: '11 Jan 2026',
        batch: 'Batch 12-C',
        staff: 'Admin',
        time: '11:00 – 12:00',
        marked: '32/32',
        status: 'COMPLETED',
    },
    {
        sessionId: 104,
        date: '10 Jan 2026',
        batch: 'Batch 8-A',
        staff: 'Rahul Patil',
        time: '09:00 – 10:00',
        marked: '30/30',
        status: 'LOCKED',
    },
];

type SessionStatus = 'PENDING' | 'PARTIAL' | 'COMPLETED' | 'LOCKED';

export default function SessionsTable() {
    const router = useRouter();

    const getStatusChip = (status: SessionStatus) => {
        switch (status) {
            case 'PENDING':
                return <Chip label="Pending" color="error" size="small" />;
            case 'PARTIAL':
                return <Chip label="Partial" color="warning" size="small" />;
            case 'COMPLETED':
                return <Chip label="Completed" color="success" size="small" />;
            case 'LOCKED':
                return <Chip label="Locked" size="small" />;
            default:
                return null;
        }
    };

    const getActionLabel = (status: SessionStatus) => {
        if (status === 'PENDING') return 'Mark Attendance';
        if (status === 'PARTIAL') return 'Continue';
        return 'View';
    };

    return (
        <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Sessions
            </Typography>

            <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Batch</TableCell>
                            <TableCell>Staff</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>Marked</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {mockSessions.map((session) => (
                            <TableRow key={session.sessionId}>
                                <TableCell>{session.date}</TableCell>
                                <TableCell>{session.batch}</TableCell>
                                <TableCell>{session.staff}</TableCell>
                                <TableCell>{session.time}</TableCell>
                                <TableCell>{session.marked}</TableCell>
                                <TableCell>
                                    {getStatusChip(session.status as SessionStatus)}
                                </TableCell>
                                <TableCell align="right">
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() =>
                                            router.push(
                                                `/attendance/sessions/${session.sessionId}`
                                            )
                                        }
                                    >
                                        {getActionLabel(session.status as SessionStatus)}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}

                        {mockSessions.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <Typography color="text.secondary">
                                        No attendance sessions found
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
