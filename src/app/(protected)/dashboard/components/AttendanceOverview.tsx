'use client';

import {
    Box,
    Card,
    CardContent,
    Stack,
    Typography,
    LinearProgress,
    Button,
    Divider,
} from '@mui/material';
import { useRouter } from 'next/navigation';

/**
 * Dummy attendance data
 * Replace with API later
 */
const attendanceToday = {
    present: 920,
    absent: 80,
    late: 40,
    total: 1040,
};

export default function AttendanceOverview() {
    const router = useRouter();

    const attendancePercent = Math.round(
        (attendanceToday.present / attendanceToday.total) * 100
    );

    return (
        <Card
            variant="outlined"
            sx={{ flex: 1 }}
        >
            <CardContent>
                <Stack spacing={2}>
                    {/* Header */}
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Typography variant="h6">
                            Today’s Attendance
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {attendancePercent}% Present
                        </Typography>
                    </Stack>

                    {/* Progress */}
                    <LinearProgress
                        variant="determinate"
                        value={attendancePercent}
                        sx={{ height: 8, borderRadius: 4 }}
                    />

                    {/* Stats */}
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                    >
                        <Stack alignItems="center">
                            <Typography fontWeight={600}>
                                {attendanceToday.present}
                            </Typography>
                            <Typography variant="caption">
                                Present
                            </Typography>
                        </Stack>

                        <Stack alignItems="center">
                            <Typography fontWeight={600}>
                                {attendanceToday.absent}
                            </Typography>
                            <Typography variant="caption">
                                Absent
                            </Typography>
                        </Stack>

                        <Stack alignItems="center">
                            <Typography fontWeight={600}>
                                {attendanceToday.late}
                            </Typography>
                            <Typography variant="caption">
                                Late
                            </Typography>
                        </Stack>
                    </Stack>

                    <Divider />

                    {/* Action */}
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => router.push('/attendance/sessions')}
                    >
                        View Attendance Sessions
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
}
