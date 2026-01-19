'use client';

import { Box, Chip, Stack, Typography } from '@mui/material';
import { useAttendanceSession } from '@/lib/features/attendance/useAttendanceSession';
import { useAttendanceSessionData } from '../_context/AttendanceSessionDataContext';

interface AttendanceSummaryProps {
    sessionId: number;
}

type AttendanceFilter =
    | 'ALL'
    | 'Present'
    | 'Absent'
    | 'Late'
    | 'Leave';

export default function AttendanceSummary({
    sessionId,
}: AttendanceSummaryProps) {

    const { filter, setFilter } = useAttendanceSession();
    const { data } = useAttendanceSessionData();
    

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
                    count={data?.summary.present ?? 0}
                    color="success"
                    active={filter === 'Present'}
                    onClick={() => handleFilterChange('Present')}
                />

                <SummaryChip
                    label="Absent"
                    count={data?.summary.absent ?? 0}
                    color="error"
                    active={filter === 'Absent'}
                    onClick={() => handleFilterChange('Absent')}
                />

                <SummaryChip
                    label="Late"
                    count={data?.summary.late ?? 0}
                    color="warning"
                    active={filter === 'Late'}
                    onClick={() => handleFilterChange('Late')}
                />

                <SummaryChip
                    label="Leave"
                    count={data?.summary.leave ?? 0}
                    color="info"
                    active={filter === 'Leave'}
                    onClick={() => handleFilterChange('Leave')}
                />

                <SummaryChip
                    label="Total"
                    count={data?.summary.total ?? 0}
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
