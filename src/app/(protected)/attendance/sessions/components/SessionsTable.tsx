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
    Alert,
    Skeleton,
} from '@mui/material';
import { useRouter } from 'next/navigation';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import api from '@/lib/services/apiService';
import API_ENDPOINTS from '@/lib/config/apiConfig';
import { formatDate } from '@/lib/utils/dateUtils';

type AttendanceSessionListItem = {
    sessionId: number;
    date: string;
    batchId: number;
    batchName: string;
    staffId: number;
    staffName: string;
    time: string;
    marked: string;
    status: string;
    remarks?: string | null;
};

export default function SessionsTable() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sessions, setSessions] = useState<AttendanceSessionListItem[]>([]);

    const queryString = useMemo(() => {
        const params = new URLSearchParams();

        const date = searchParams.get('date');
        const status = (searchParams.get('status') ?? '').toLowerCase();
        const batchId = searchParams.get('batchId');
        const staffId = searchParams.get('staffId');

        if (date) params.set('date', date);
        if (status && status !== 'all') params.set('status', status);
        if (batchId) params.set('batchId', batchId);
        if (staffId) params.set('staffId', staffId);

        const qs = params.toString();
        return qs ? `?${qs}` : '';
    }, [searchParams]);

    useEffect(() => {
        let active = true;

        const load = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await api.get<AttendanceSessionListItem[]>(
                    `${API_ENDPOINTS.ATTENDANCE_SESSIONS.GET_LIST}${queryString}`,
                    { withCredentials: true }
                );

                if (!active) return;

                if (!res?.success) {
                    throw new Error(res?.error || res?.message || 'Failed to fetch sessions');
                }

                setSessions(res.data ?? []);
            } catch (e: any) {
                if (!active) return;
                setError(e?.message || 'Failed to fetch sessions');
                setSessions([]);
            } finally {
                if (!active) return;
                setLoading(false);
            }
        };

        load();

        return () => {
            active = false;
        };
    }, [queryString]);

    const getStatusChip = (status: string) => {
        const s = (status ?? '').toLowerCase();
        if (s === 'pending') return <Chip label="Pending" color="warning" size="small" />;
        if (s === 'partial') return <Chip label="Partial" color="info" size="small" />;
        if (s === 'completed') return <Chip label="Completed" color="success" size="small" />;
        return <Chip label={status || '—'} size="small" />;
    };

    const getActionLabel = (status: string) => {
        const s = (status ?? '').toLowerCase();
        if (s === 'pending') return 'Mark Attendance';
        if (s === 'partial') return 'Continue';
        return 'View Attendance';
    };

    return (
        <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Sessions
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

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
                            <TableCell>Remarks</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading && (
                            Array.from({ length: 6 }).map((_, idx) => (
                                <TableRow key={`sk-${idx}`}>
                                    <TableCell><Skeleton width={90} /></TableCell>
                                    <TableCell><Skeleton width={120} /></TableCell>
                                    <TableCell><Skeleton width={140} /></TableCell>
                                    <TableCell><Skeleton width={110} /></TableCell>
                                    <TableCell><Skeleton width={60} /></TableCell>
                                    <TableCell><Skeleton width={90} /></TableCell>
                                    <TableCell><Skeleton width={160} /></TableCell>
                                    <TableCell align="right"><Skeleton width={90} /></TableCell>
                                </TableRow>
                            ))
                        )}

                        {!loading && sessions.map((session) => (
                            <TableRow key={session.sessionId}>
                                <TableCell>{formatDate(session.date, '—')}</TableCell>
                                <TableCell>{session.batchName || `#${session.batchId}`}</TableCell>
                                <TableCell>{session.staffName || `#${session.staffId}`}</TableCell>
                                <TableCell>{session.time || '—'}</TableCell>
                                <TableCell>{session.marked || '—'}</TableCell>
                                <TableCell>{getStatusChip(session.status)}</TableCell>
                                <TableCell>{session.remarks || '—'}</TableCell>
                                <TableCell align="right">
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() =>
                                            router.push(`/attendance/sessions/${session.sessionId}`)
                                        }
                                    >
                                        {getActionLabel(session.status)}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}

                        {!loading && sessions.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
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
