'use client';

import {
    Box,
    Stack,
    TextField,
    MenuItem,
    Button,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import api from '@/lib/services/apiService';
import API_ENDPOINTS from '@/lib/config/apiConfig';
import type { Batch } from '@/lib/features/batch/batchTypes';
import type { Staff } from '@/lib/features/staff/staffTypes';

const statusOptions = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Partial', value: 'partial' },
    { label: 'Completed', value: 'completed' },
];

const toIntOrEmpty = (value: string) => {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : null;
};

export default function SessionsFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [batches, setBatches] = useState<Batch[]>([]);
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [date, setDate] = useState('');
    const [status, setStatus] = useState('all');
    const [batchId, setBatchId] = useState('');
    const [staffId, setStaffId] = useState('');

    useEffect(() => {
        setDate(searchParams.get('date') ?? '');
        setStatus((searchParams.get('status') ?? 'all').toLowerCase());
        setBatchId(searchParams.get('batchId') ?? '');
        setStaffId(searchParams.get('staffId') ?? '');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    useEffect(() => {
        let active = true;

        const load = async () => {
            try {
                const [batchesRes, staffRes] = await Promise.all([
                    api.get<Batch[]>(API_ENDPOINTS.BATCHES.GET_LIST, { withCredentials: true }),
                    api.get<Staff[]>(API_ENDPOINTS.STAFF.GET_LIST, { withCredentials: true }),
                ]);

                if (!active) return;

                setBatches(batchesRes.data ?? []);
                setStaffList(staffRes.data ?? []);
            } catch {
                // keep filters usable even if dropdown fetch fails
                if (!active) return;
                setBatches([]);
                setStaffList([]);
            }
        };

        load();

        return () => {
            active = false;
        };
    }, []);

    const nextQueryString = useMemo(() => {
        const params = new URLSearchParams();

        if (date) params.set('date', date);
        if (status && status !== 'all') params.set('status', status);

        const bId = toIntOrEmpty(batchId);
        const sId = toIntOrEmpty(staffId);
        if (bId) params.set('batchId', String(bId));
        if (sId) params.set('staffId', String(sId));

        const qs = params.toString();
        return qs ? `?${qs}` : '';
    }, [batchId, date, staffId, status]);

    useEffect(() => {
        router.replace(`/attendance/sessions${nextQueryString}`);
    }, [nextQueryString, router]);

    const handleReset = () => {
        setDate('');
        setStatus('all');
        setBatchId('');
        setStaffId('');
    };

    return (
        <Box>
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                alignItems="center"
            >
                {/* Date */}
                <TextField
                    type="date"
                    size="small"
                    label="Date"
                    InputLabelProps={{ shrink: true }}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />

                {/* Status */}
                <TextField
                    select
                    size="small"
                    label="Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    sx={{ minWidth: 160 }}
                >
                    {statusOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                        </MenuItem>
                    ))}
                </TextField>

                {/* Batch */}
                <TextField
                    select
                    size="small"
                    label="Batch"
                    value={batchId}
                    onChange={(e) => setBatchId(e.target.value)}
                    sx={{ minWidth: 160 }}
                >
                    <MenuItem value="">All Batches</MenuItem>
                    {batches.map((b) => (
                        <MenuItem key={b.batchId} value={String(b.batchId)}>
                            {b.batchCode}
                        </MenuItem>
                    ))}
                </TextField>

                {/* Staff */}
                <TextField
                    select
                    size="small"
                    label="Staff"
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                    sx={{ minWidth: 160 }}
                >
                    <MenuItem value="">All Staff</MenuItem>
                    {staffList.map((s) => (
                        <MenuItem key={s.staffId} value={String(s.staffId)}>
                            {(s.firstName && s.lastName ? s.firstName + ' ' + s.lastName : null) ?? `Staff #${s.staffId}`}
                        </MenuItem>
                    ))}
                </TextField>

                {/* Reset */}
                <Button
                    variant="text"
                    size="small"
                    onClick={handleReset}
                >
                    Reset
                </Button>
            </Stack>
        </Box>
    );
}
