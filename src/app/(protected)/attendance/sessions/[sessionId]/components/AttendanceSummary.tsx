'use client';

import { Box, Chip, Stack, Typography } from '@mui/material';
import { useAttendanceFilter } from '../_context/AttendanceFilterContext';
import { useAttendanceSession } from '@/lib/features/attendance/useAttendanceSession';

interface AttendanceSummaryProps {
    sessionId: number;
}

/**
 * Dummy summary data
 * Replace with API response later
 */
const mockSummary = {
    present: 28,
    absent: 3,
    late: 1,
    leave: 0,
    total: 32,
};

type AttendanceFilter =
    | 'ALL'
    | 'PRESENT'
    | 'ABSENT'
    | 'LATE'
    | 'LEAVE';

export default function AttendanceSummary({
    sessionId,
}: AttendanceSummaryProps) {

    const { filter, setFilter } = useAttendanceSession();
    

    const handleFilterChange = (value: AttendanceFilter) => {
        setFilter(value);
    };

    return (
        <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Session Summary
            </Typography>

            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                flexWrap="wrap"
            >
                <SummaryChip
                    label="Present"
                    count={mockSummary.present}
                    color="success"
                    active={filter === 'PRESENT'}
                    onClick={() => handleFilterChange('PRESENT')}
                />

                <SummaryChip
                    label="Absent"
                    count={mockSummary.absent}
                    color="error"
                    active={filter === 'ABSENT'}
                    onClick={() => handleFilterChange('ABSENT')}
                />

                <SummaryChip
                    label="Late"
                    count={mockSummary.late}
                    color="warning"
                    active={filter === 'LATE'}
                    onClick={() => handleFilterChange('LATE')}
                />

                <SummaryChip
                    label="Leave"
                    count={mockSummary.leave}
                    color="info"
                    active={filter === 'LEAVE'}
                    onClick={() => handleFilterChange('LEAVE')}
                />

                <SummaryChip
                    label="Total"
                    count={mockSummary.total}
                    color="default"
                    active={filter === 'ALL'}
                    onClick={() => handleFilterChange('ALL')}
                />
            </Stack>
        </Box>
    );
}

/* =========================================================
   Reusable Summary Chip
   ========================================================= */

interface SummaryChipProps {
    label: string;
    count: number;
    color:
    | 'default'
    | 'success'
    | 'error'
    | 'warning'
    | 'info';
    active: boolean;
    onClick: () => void;
}

function SummaryChip({
    label,
    count,
    color,
    active,
    onClick,
}: SummaryChipProps) {
    return (
        <Chip
            clickable
            onClick={onClick}
            color={active ? color : 'default'}
            label={
                <Stack direction="row" spacing={1}>
                    <Typography fontWeight={600}>
                        {label}
                    </Typography>
                    <Typography>
                        {count}
                    </Typography>
                </Stack>
            }
            sx={{
                px: 1.5,
                py: 2,
                borderRadius: 2,
                bgcolor: active ? undefined : 'grey.100',
            }}
        />
    );
}
