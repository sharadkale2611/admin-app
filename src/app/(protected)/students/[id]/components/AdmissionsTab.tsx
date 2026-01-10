'use client';

import React, { useMemo, useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Chip,
  Divider,
  Stack,
  CircularProgress,
} from '@mui/material';

import {
  Add,
  School,
  Event,
  Payments,
  Info,
} from '@mui/icons-material';

import CreateAdmissionForStudent from './CreateAdmissionForStudent';
import { useAdmissionsViewModel } from '@/lib/features/admission/useAdmissionsViewModel';
import { PaymentStatus } from '@/lib/features/admission/admissionTypes';

/* =====================================================
   MAIN COMPONENT
===================================================== */
export default function AdmissionsTab({ studentId }: { studentId: number }) {
  const [showCreateAdmission, setShowCreateAdmission] = useState(false);

  const {
    admissions,
    isLoading,
    error,
  } = useAdmissionsViewModel();

  /* =====================================================
     FILTER ADMISSIONS FOR THIS STUDENT ONLY
  ===================================================== */
  const studentAdmissions = useMemo(
    () =>
      admissions.filter(
        a => a.studentId === studentId
      ),
    [admissions, studentId]
  );

  const formatDate = (date?: string) =>
    date
      ? new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      : 'N/A';

  const getPaymentColor = (status: PaymentStatus | string) => {
    switch (status) {
      case PaymentStatus.Paid:
        return 'success';
      case PaymentStatus.PartiallyPaid:
        return 'warning';
      case PaymentStatus.Pending:
      case PaymentStatus.Overdue:
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Grid container spacing={3}>
      {/* =====================================================
          LEFT COLUMN — LIST OR CREATE FORM
      ====================================================== */}
      <Grid size={{ xs: 12, md: 8 }}>
        {/* ================= LOADING ================= */}
        {isLoading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}

        {/* ================= ERROR ================= */}
        {error && (
          <Typography color="error.main">
            {error}
          </Typography>
        )}

        {/* ================= ADMISSION LIST ================= */}
        {!isLoading && !showCreateAdmission && (
          <Stack spacing={2}>
            {studentAdmissions.length === 0 && (
              <Paper sx={{ p: 3 }}>
                <Typography color="text.secondary">
                  No admissions found for this student.
                </Typography>
              </Paper>
            )}

            {studentAdmissions.map(admission => (
              <Paper
                key={admission.studentEnrollmentId}
                sx={{ p: 3 }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h6">
                    {admission.courseName}
                  </Typography>

                  <Chip
                    label={admission.paymentStatus}
                    color={getPaymentColor(admission.paymentStatus)}
                    size="small"
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <InfoRow
                      icon={<School fontSize="small" />}
                      label="Enrollment Type"
                      value={admission.enrollmentType}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <InfoRow
                      icon={<Event fontSize="small" />}
                      label="Enrollment Date"
                      value={formatDate(admission.enrollmentDate)}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <InfoRow
                      icon={<Payments fontSize="small" />}
                      label="Final Amount"
                      value={`₹ ${admission.finalAmount}`}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <InfoRow
                      icon={<Payments fontSize="small" />}
                      label="Paid Amount"
                      value={`₹ ${admission.paidAmount}`}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <InfoRow
                      icon={<Info fontSize="small" />}
                      label="Remarks"
                      value={admission.remarks || '—'}
                    />
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Stack>
        )}

        {/* ================= CREATE ADMISSION ================= */}
        {showCreateAdmission && (
          <CreateAdmissionForStudent
            studentId={studentId}
            onCancel={() => setShowCreateAdmission(false)}
            onSuccess={() => setShowCreateAdmission(false)}
          />
        )}
      </Grid>

      {/* =====================================================
          RIGHT COLUMN — ACTIONS (UNCHANGED)
      ====================================================== */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper sx={{ p: 3 }} elevation={2}>
          <Typography variant="h6" gutterBottom>
            Actions
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Stack spacing={2}>
            <Button
              variant="contained"
              startIcon={<Add />}
              fullWidth
              onClick={() => setShowCreateAdmission(true)}
              disabled={showCreateAdmission}
            >
              Add Admission
            </Button>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}

/* =====================================================
   SMALL REUSABLE INFO ROW
===================================================== */
function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}) {
  return (
    <Box display="flex" alignItems="center" gap={1}>
      {icon}
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body2">
          {value}
        </Typography>
      </Box>
    </Box>
  );
}
