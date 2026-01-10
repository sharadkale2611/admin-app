'use client';

import {
    Box,
    Stack,
    TextField,
    MenuItem,
    Button,
} from '@mui/material';
import { useState } from 'react';

/**
 * Dummy filter values
 * Replace with API-driven dropdowns later
 */
const statusOptions = [
    { label: 'All', value: 'ALL' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Partial', value: 'PARTIAL' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Locked', value: 'LOCKED' },
];

const batchOptions = [
    { label: 'All Batches', value: 'ALL' },
    { label: 'Batch 10-A', value: '10-A' },
    { label: 'Batch 9-B', value: '9-B' },
    { label: 'Batch 12-C', value: '12-C' },
];

const staffOptions = [
    { label: 'All Staff', value: 'ALL' },
    { label: 'Rahul Patil', value: 'Rahul' },
    { label: 'Sneha Joshi', value: 'Sneha' },
];

export default function SessionsFilters() {
    const [date, setDate] = useState('');
    const [status, setStatus] = useState('ALL');
    const [batch, setBatch] = useState('ALL');
    const [staff, setStaff] = useState('ALL');

    const handleReset = () => {
        setDate('');
        setStatus('ALL');
        setBatch('ALL');
        setStaff('ALL');
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
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    sx={{ minWidth: 160 }}
                >
                    {batchOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                        </MenuItem>
                    ))}
                </TextField>

                {/* Staff */}
                <TextField
                    select
                    size="small"
                    label="Staff"
                    value={staff}
                    onChange={(e) => setStaff(e.target.value)}
                    sx={{ minWidth: 160 }}
                >
                    {staffOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
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
