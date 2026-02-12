'use client';

import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import AttendanceOverrideDialog from './AttendanceOverrideDialog';
import { useAttendanceSession } from '@/lib/features/attendance/useAttendanceSession';
import { useAttendanceSessionData } from '../_context/AttendanceSessionDataContext';

interface AttendanceHeaderProps {
    sessionId: number;
}

export default function AttendanceHeader({
    sessionId,
}: AttendanceHeaderProps) {
    const router = useRouter();
    const { isLocked, unlockSession } = useAttendanceSession();
    const { data, error, loading } = useAttendanceSessionData();

    const [overrideOpen, setOverrideOpen] = useState(false);

    if (loading) {
        return (
            <Typography color="text.secondary">
                Loading session...
            </Typography>
        );
    }

    if (error || !data?.session) {
        return (
            <Typography color="error">
                {error || 'Attendance session not found'}
            </Typography>
        );
    }

    const session = data.session;

    return (
        <>
            <Box
                sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    bgcolor: 'background.paper',
                    pb: 2,
                }}
            >
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    justifyContent="space-between"
                    spacing={2}
                >
                    {/* ================= LEFT ================= */}
                    <Stack spacing={0.5}>
                        <Typography variant="h5" fontWeight={600}>
                            Attendance • {session.batchName}
                        </Typography>

                        <Stack direction="row" spacing={2} flexWrap="wrap">
                            <Stack direction="row" spacing={0.75} alignItems="center">
                                <CalendarTodayIcon fontSize="small" color="action" />
                                <Typography variant="body2">{session.date}</Typography>
                            </Stack>

                            <Stack direction="row" spacing={0.75} alignItems="center">
                                <AccessTimeIcon fontSize="small" color="action" />
                                <Typography variant="body2">{session.time}</Typography>
                            </Stack>

                            <Stack direction="row" spacing={0.75} alignItems="center">
                                <PersonIcon fontSize="small" color="action" />
                                <Typography variant="body2">{session.staffName}</Typography>
                            </Stack>

                            {session.moduleName && session.moduleName !== 'N/A' && (
                                <Stack direction="row" spacing={0.75} alignItems="center">
                                    <MenuBookIcon fontSize="small" color="action" />
                                    <Typography variant="body2">{session.moduleName}</Typography>
                                </Stack>
                            )}
                        </Stack>
                    </Stack>

                    {/* ================= RIGHT ================= */}
                    <Stack direction="row" spacing={1} alignItems="center">
                        {/* <Chip
                            icon={isLocked ? <LockIcon /> : <LockOpenIcon />}
                            label={isLocked ? 'Locked' : 'Editable'}
                            color={isLocked ? 'warning' : 'success'}
                            size="small"
                        />

                        {isLocked && (
                            <Button
                                size="small"
                                variant="contained"
                                color="warning"
                                onClick={() => setOverrideOpen(true)}
                            >
                                Override Lock
                            </Button>
                        )} */}

                        {/* <Button
                            variant="outlined"
                            size="small"
                            startIcon={<DownloadIcon />}
                            onClick={() => alert('Export coming soon')}
                        >
                            Export
                        </Button> */}

                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => router.back()}
                        >
                            Back
                        </Button>
                    </Stack>
                </Stack>
            </Box>

            <AttendanceOverrideDialog
                open={overrideOpen}
                onClose={() => setOverrideOpen(false)}
                onConfirm={(reason) => {
                    unlockSession(reason);
                    setOverrideOpen(false);
                }}
            />
        </>
    );
}
