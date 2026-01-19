// src/app/(protected)/attendance/sessions/page.tsx

import { Suspense } from 'react';
import {
    Box,
    Divider,
    CircularProgress,
    Stack,
    Typography,
} from '@mui/material';

import SessionsHeader from './components/SessionsHeader';
import SessionsFilters from './components/SessionsFilters';
import SessionsTable from './components/SessionsTable';

export default function AttendanceSessionsPage() {
    return (
        <Box sx={{ p: 3 }}>
            {/* ================= HEADER ================= */}
            <Suspense fallback={<HeaderSkeleton />}>
                <SessionsHeader />
            </Suspense>

            <Divider sx={{ my: 2 }} />

            {/* ================= FILTERS ================= */}
            <Suspense fallback={<FiltersSkeleton />}>
                <SessionsFilters />
            </Suspense>

            <Divider sx={{ my: 2 }} />

            {/* ================= TABLE ================= */}
            <Suspense fallback={<TableSkeleton />}>
                <SessionsTable />
            </Suspense>
        </Box>
    );
}

/* =========================================================
   Skeletons (UX-friendly)
   ========================================================= */

function HeaderSkeleton() {
    return (
        <Stack spacing={1}>
            <Typography variant="h6">
                Attendance Sessions
            </Typography>
            <CircularProgress size={20} />
        </Stack>
    );
}

function FiltersSkeleton() {
    return (
        <Stack direction="row" spacing={2}>
            {[1, 2, 3, 4].map((i) => (
                <Box
                    key={i}
                    sx={{
                        width: 140,
                        height: 40,
                        bgcolor: 'grey.100',
                        borderRadius: 1,
                    }}
                />
            ))}
        </Stack>
    );
}

function TableSkeleton() {
    return (
        <Box
            sx={{
                height: 420,
                bgcolor: 'grey.100',
                borderRadius: 1,
            }}
        />
    );
}
