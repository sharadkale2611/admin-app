'use client';

import {
    Box,
    Card,
    CardContent,
    Grid,
    Stack,
    Typography,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import GroupsIcon from '@mui/icons-material/Groups';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PercentIcon from '@mui/icons-material/Percent';
import SchoolIcon from '@mui/icons-material/School';

/**
 * Dummy KPI data
 * Replace with API later
 */
const stats = [
    {
        label: 'Total Students',
        value: 1240,
        icon: <PeopleIcon color="primary" />,
        subText: 'Across all batches',
    },
    {
        label: 'Active Batches',
        value: 48,
        icon: <GroupsIcon color="secondary" />,
        subText: 'Currently running',
    },
    {
        label: 'Staff Present Today',
        value: '32 / 35',
        icon: <EventAvailableIcon color="success" />,
        subText: 'Marked attendance',
    },
    {
        label: 'Attendance Today',
        value: '92%',
        icon: <PercentIcon color="warning" />,
        subText: 'Overall presence',
    },
    {
        label: 'Upcoming Exams',
        value: 6,
        icon: <SchoolIcon color="info" />,
        subText: 'Next 7 days',
    },
];

export default function DashboardStats() {
    return (
        <Box>
            <Grid container spacing={2}>
                {stats.map((stat) => (
                    <Grid
                        key={stat.label}
                        size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}
                    >
                        <Card
                            variant="outlined"
                            sx={{
                                height: '100%',
                            }}
                        >
                            <CardContent>
                                <Stack spacing={1}>
                                    {/* Icon */}
                                    <Box>{stat.icon}</Box>

                                    {/* Value */}
                                    <Typography
                                        variant="h5"
                                        fontWeight={600}
                                    >
                                        {stat.value}
                                    </Typography>

                                    {/* Label */}
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {stat.label}
                                    </Typography>

                                    {/* Subtext */}
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        {stat.subText}
                                    </Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
