'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Divider, Stack } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';

import DashboardHeader from './components/DashboardHeader';
import DashboardStats from './components/DashboardStats';
import AttendanceOverview from './components/AttendanceOverview';
import ActionRequired from './components/ActionRequired';
import QuickActions from './components/QuickActions';
import RecentActivity from './components/RecentActivity';
import {
  fetchAdminDashboardSummary,
 
} from '@/lib/features/dashboard/dashboardThunks';

export default function Dashboard() {
    const router = useRouter();
      const dispatch = useAppDispatch();

   const { isAuthenticated, initialCheckDone, user } = useAppSelector(
    state => state.auth
);

    useEffect(() => {
        if (initialCheckDone && !isAuthenticated) {
            router.push('/login?redirect=/dashboard');
        }
    }, [initialCheckDone, isAuthenticated, router]);

   useEffect(() => {
    if (
        initialCheckDone &&
        isAuthenticated &&
       user?.roles?.includes('Admin')
    ) {
        dispatch(fetchAdminDashboardSummary());
        
    }
}, [
    dispatch,
    initialCheckDone,
    isAuthenticated,
    user?.roles,
]);

    if (!initialCheckDone) {
        return <div>Loading dashboard...</div>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Stack spacing={3}>
                {/* Header */}
                <DashboardHeader />

                {/* KPI Cards */}
                <DashboardStats />

                <Divider />

                {/* Attendance + Actions */}
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={3}
                >
                    <AttendanceOverview />
                    {/* <ActionRequired /> */}
                    {/* Recent Activity */}
                    <RecentActivity />

                </Stack>

                <Divider />

                {/* Quick Actions */}
                {/* <QuickActions /> */}

                <Divider />

                {/* Recent Activity */}
                {/* <RecentActivity /> */}
            </Stack>
        </Box>
    );
}
