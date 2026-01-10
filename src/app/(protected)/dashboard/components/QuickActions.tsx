'use client';

import {
    Box,
    Card,
    CardContent,
    Grid,
    Button,
    Typography,
    Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { useRouter } from 'next/navigation';

const actions = [
    {
        label: 'Create Attendance Session',
        icon: <HowToRegIcon />,
        path: '/attendance/sessions',
        color: 'primary',
    },
    {
        label: 'Add Student',
        icon: <AddIcon />,
        path: '/students/create',
        color: 'success',
    },
    {
        label: 'Create Batch',
        icon: <GroupWorkIcon />,
        path: '/batches/create',
        color: 'secondary',
    },
    {
        label: 'Schedule Exam',
        icon: <EventNoteIcon />,
        path: '/exams/create',
        color: 'warning',
    },
];

export default function QuickActions() {
    const router = useRouter();

    return (
        <Card variant="outlined">
            <CardContent>
                <Stack spacing={2}>
                    <Typography variant="h6">
                        Quick Actions
                    </Typography>

                    <Grid container spacing={2}>
                        {actions.map((action) => (
                            <Grid
                                key={action.label}
                                size={{ xs: 12, sm: 6, md: 3 }}
                            >
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={action.icon}
                                    color={action.color as any}
                                    sx={{
                                        height: 56,
                                        justifyContent: 'flex-start',
                                    }}
                                    onClick={() => router.push(action.path)}
                                >
                                    {action.label}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </Stack>
            </CardContent>
        </Card>
    );
}
