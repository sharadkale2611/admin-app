'use client';

import {
    Box,
    Card,
    CardContent,
    Stack,
    Typography,
    Divider,
    Chip,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

/**
 * Dummy recent activity data
 * Replace with API later
 */
const activities = [
    {
        id: 1,
        message: 'Attendance marked for Batch 10-A',
        user: 'Rahul Patil',
        time: '10 minutes ago',
        type: 'attendance',
    },
    {
        id: 2,
        message: 'Attendance session unlocked',
        user: 'Admin',
        time: '25 minutes ago',
        type: 'attendance',
    },
    {
        id: 3,
        message: 'Marks updated for Physics Unit Test',
        user: 'Sneha Joshi',
        time: '1 hour ago',
        type: 'exam',
    },
    {
        id: 4,
        message: 'New student enrolled in Batch 9-B',
        user: 'Admin',
        time: 'Today at 9:15 AM',
        type: 'student',
    },
];

function getTypeChip(type: string) {
    switch (type) {
        case 'attendance':
            return <Chip label="Attendance" size="small" color="primary" />;
        case 'exam':
            return <Chip label="Exam" size="small" color="secondary" />;
        case 'student':
            return <Chip label="Student" size="small" color="success" />;
        default:
            return <Chip label="Activity" size="small" />;
    }
}

export default function RecentActivity() {
    return (
        <Card variant="outlined">
            <CardContent>
                <Stack spacing={2}>
                    {/* Header */}
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                    >
                        <AccessTimeIcon color="action" />
                        <Typography variant="h6">
                            Recent Activity
                        </Typography>
                    </Stack>

                    <Divider />

                    {/* Empty state */}
                    {activities.length === 0 && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            No recent activity found.
                        </Typography>
                    )}

                    {/* Activity list */}
                    <Stack spacing={2}>
                        {activities.map((activity) => (
                            <Box key={activity.id}>
                                <Stack spacing={0.5}>
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <Typography fontWeight={500}>
                                            {activity.message}
                                        </Typography>
                                        {getTypeChip(activity.type)}
                                    </Stack>

                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        {activity.user} • {activity.time}
                                    </Typography>
                                </Stack>
                            </Box>
                        ))}
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}
