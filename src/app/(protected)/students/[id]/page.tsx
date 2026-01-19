'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';

import { ArrowBack } from '@mui/icons-material';

import { useStudentDetailsViewModel } from '@/lib/features/student/useStudentDetailsViewModel';

// Tabs
import StudentDetailsTab from './components/StudentDetailsTab';
import AdmissionsTab from './components/AdmissionsTab';
import FeesTab from './components/FeesTab';
import AttendanceTab from './components/AttendanceTab';
import PerformanceTab from './components/PerformanceTab';
import BatchesTab from './components/BatchesTab';

/* ---------------- TAB PANEL ---------------- */
function TabPanel({
  children,
  value,
  index,
}: {
  children: React.ReactNode;
  value: number;
  index: number;
}) {
  return value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null;
}

export default function StudentDetailsPage() {
  const { id } = useParams();
  const studentId = id as string;

  const { student, isLoading, error } =
    useStudentDetailsViewModel(studentId);

  const [tabIndex, setTabIndex] = useState(0);

  if (!student) return null;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* ---------- HEADER ---------- */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Link href="/students">
            <Button startIcon={<ArrowBack />} variant="outlined" size="small">
              Back
            </Button>
          </Link>

          <Typography variant="h4">
            {student.firstName} {student.lastName}
          </Typography>
        </Box>

        <Chip
          label={student.isActive ? 'Active' : 'Inactive'}
          color={student.isActive ? 'success' : 'error'}
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
          <Tab label="Student Details" />
          <Tab label="Admissions" />
          <Tab label="Fees" />
          <Tab label="Batches" />
          <Tab label="Attendance" />
          <Tab label="Performance" />
        </Tabs>
      </Paper>

      {/* ---------- TAB CONTENT ---------- */}
      <TabPanel value={tabIndex} index={0}>
        <StudentDetailsTab
          student={student}
          isLoading={isLoading}
          error={error}
        />
      </TabPanel>

      <TabPanel value={tabIndex} index={1}>
        <AdmissionsTab studentId={Number(student.studentId)} />
      </TabPanel>

      <TabPanel value={tabIndex} index={2}>
        <FeesTab studentId={Number(student.studentId)} enrollmentId={1} />
      </TabPanel>
      <TabPanel value={tabIndex} index={3}>
        <BatchesTab studentId={Number(student.studentId)} />
      </TabPanel>

      <TabPanel value={tabIndex} index={4}>
        <AttendanceTab studentId={Number(student.studentId)} />
      </TabPanel>
      

      <TabPanel value={tabIndex} index={5}>
        <PerformanceTab studentId={Number(student.studentId)} />
      </TabPanel>
    </Container>
  );
}
