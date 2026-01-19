'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import {
  Container,
  Typography,
  Chip,
  Button,
  Box,
  Paper,
  Skeleton,
  Alert,
  Tabs,
  Tab
} from '@mui/material';

import { ArrowBack, CheckCircle, Cancel } from '@mui/icons-material';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';

// Thunks
import { fetchBatchById } from '@/lib/features/batch/batchThunks';
import { fetchBatchSchedules } from '@/lib/features/batchSchedules/batchScheduleThunks';
import { fetchAllStaff } from '@/lib/features/staff/staffThunks';
import { fetchClassRooms } from '@/lib/features/classRoom/classRoomThunks';

// Tabs
import BatchDetailsTab from './components/BatchDetailsTab';
import SavedSchedulesTab from './components/SavedSchedulesTab';
import BatchEnrollmentsTab from './components/BatchEnrollmentsTab';

/* ---------------- TAB PANEL ---------------- */
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  if (value !== index) return null;
  return <Box sx={{ pt: 3 }}>{children}</Box>;
}

/* ---------------- PAGE ---------------- */
export default function BatchDetailsPage() {
  const { id } = useParams();
  const batchId = Number(id);

  const dispatch = useAppDispatch();

  const { currentBatch, loading, error } = useAppSelector(
    state => state.batches
  );

  const [tabIndex, setTabIndex] = React.useState(0);

  /* ---------- FETCH DATA ---------- */
  useEffect(() => {
    if (!batchId) return;

    dispatch(fetchBatchById(batchId));
    dispatch(fetchBatchSchedules(batchId));
    dispatch(fetchAllStaff());
    dispatch(fetchClassRooms());
  }, [batchId]);

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Skeleton variant="rectangular" height={400} />
      </Container>
    );
  }

  /* ---------- ERROR ---------- */
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">Failed to load batch details.</Alert>
        <Link href="/batches">
          <Button startIcon={<ArrowBack />} sx={{ mt: 2 }}>
            Back to Batches
          </Button>
        </Link>
      </Container>
    );
  }

  if (!currentBatch) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning">Batch not found.</Alert>
      </Container>
    );
  }

  /* ---------- UI ---------- */
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* ---------- HEADER ---------- */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Link href="/batches">
            <Button startIcon={<ArrowBack />} variant="outlined" size="small">
              Back
            </Button>
          </Link>

          <Typography variant="h4">
            Batch Details
          </Typography>
        </Box>

        <Chip
          label={currentBatch.isActive ? 'Active' : 'Inactive'}
          color={currentBatch.isActive ? 'success' : 'error'}
          icon={currentBatch.isActive ? <CheckCircle /> : <Cancel />}
        />
      </Box>

      {/* ---------- TABS ---------- */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabIndex}
          onChange={(_, v) => setTabIndex(v)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Batch Details" />
          <Tab label="Batch Schedules" />
          <Tab label="Batch Enrollments" />
        </Tabs>
      </Paper>

      {/* =====================================================
          TAB 1 : BATCH DETAILS
      ====================================================== */}
      <TabPanel value={tabIndex} index={0}>
        <BatchDetailsTab batchId={batchId} />
      </TabPanel>

      {/* =====================================================
          TAB 2 : SCHEDULE INFO
      ====================================================== */}
      <TabPanel value={tabIndex} index={1}>
        <SavedSchedulesTab batchId={batchId} />
      </TabPanel>

      {/* =====================================================
          TAB 3 : SAVED SCHEDULES
      ====================================================== */}
      <TabPanel value={tabIndex} index={2}>
        <BatchEnrollmentsTab />
      </TabPanel>
      
    </Container>
  );
}
