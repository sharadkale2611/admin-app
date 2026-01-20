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
import PercentIcon from '@mui/icons-material/Percent';
import SchoolIcon from '@mui/icons-material/School';
import EventAvailableIcon from '@mui/icons-material/EventAvailable'; 
import { useAppSelector } from '@/lib/hooks';

export default function DashboardStats() {
  const { summary, loading } = useAppSelector(
    state => state.dashboard
  );

  if (loading && !summary) {
    return <Typography>Loading stats...</Typography>;
  }

  const stats = [
    {
      label: 'Total Students',
      value: summary?.totalStudents ?? '—',
      icon: <PeopleIcon color="primary" />,
      subText: 'Across all batches',
    },
    {
      label: 'Active Batches',
      value: summary?.activeBatches ?? '—',
      icon: <GroupsIcon color="secondary" />,
      subText: 'Currently running',
    },

    { label: 'Staff Present Today', 
        value: '0',
         icon: <EventAvailableIcon color="success" />, 
         subText: 'Marked attendance',
    },
    {
      label: 'Attendance Today',
      value: summary
        ? `${summary.attendancePercentage}%`
        : '—',
      icon: <PercentIcon color="warning" />,
      subText: 'Overall presence',
    },
    {
      label: 'Upcoming Exams',
      value: summary?.upcomingExams ?? '—',
      icon: <SchoolIcon color="info" />,
      subText: 'Next 7 days',
    },
  ];

  return (
    <Box>
      <Grid container spacing={2}>
        {stats.map(stat => (
          <Grid
            key={stat.label}
            size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
          >
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Stack spacing={1}>
                  <Box>{stat.icon}</Box>

                  <Typography variant="h5" fontWeight={600}>
                    {stat.value}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {stat.label}
                  </Typography>

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
