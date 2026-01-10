'use client';

import {
    Box,
    Card,
    CardContent,
    Stack,
    Typography,
    Button,
    Chip,
    Divider,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useRouter } from 'next/navigation';

/**
 * Dummy alerts data
 * Replace with API-driven rules later
 */
const actionItems = [
    {
        id: 1,
        title: 'Attendance not marked',
        description: 'Batch 10-A (09:00 – 10:00)',
        severity: 'error',
        actionLabel: 'Mark Attendance',
        actionPath: '/attendance/sessions',
    },
    {
        id: 2,
        title: 'Attendance partially marked',
        description: 'Batch 9-B (10:00 – 11:00)',
        severity: 'warning',
        actionLabel: 'Continue',
        actionPath: '/attendance/sessions',
    },
    {
        id: 3,
        title: 'Exam marks pending',
        description: 'Physics – Unit Test',
        severity: 'warning',
        actionLabel: 'Update Marks',
        actionPath: '/exam-marks',
    },
];

type Severity = 'error' | 'warning';

export default function ActionRequired() {
    const router = useRouter();

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
                        spacing={1}
                        alignItems="center"
                    >
                        <WarningAmberIcon color="warning" />
                        <Typography variant="h6">
                            Action Required
                        </Typography>
                    </Stack>

                    <Divider />

                    {/* No issues */}
                    {actionItems.length === 0 && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            🎉 No pending actions. Everything looks good!
                        </Typography>
                    )}

                    {/* Action items */}
                    <Stack spacing={2}>
                        {actionItems.map((item) => (
                            <Box
                                key={item.id}
                                sx={{
                                    p: 1.5,
                                    borderRadius: 1,
                                    bgcolor:
                                        item.severity === 'error'
                                            ? 'error.lighter'
                                            : 'warning.lighter',
                                }}
                            >
                                <Stack spacing={1}>
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <Typography fontWeight={600}>
                                            {item.title}
                                        </Typography>

                                        <Chip
                                            label={
                                                item.severity === 'error'
                                                    ? 'High'
                                                    : 'Medium'
                                            }
                                            color={
                                                item.severity === 'error'
                                                    ? 'error'
                                                    : 'warning'
                                            }
                                            size="small"
                                        />
                                    </Stack>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {item.description}
                                    </Typography>

                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() =>
                                            router.push(item.actionPath)
                                        }
                                    >
                                        {item.actionLabel}
                                    </Button>
                                </Stack>
                            </Box>
                        ))}
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}
