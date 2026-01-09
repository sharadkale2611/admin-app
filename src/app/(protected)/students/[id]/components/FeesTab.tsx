'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Paper,
  Typography,
  Divider,
  Card,
  CardContent,
  Chip,
  Stack,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Grid,
} from '@mui/material';

import { fetchStudentPaymentsByStudentId } from '@/lib/features/studentPayment/studentPaymentThunk';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { updateStudentPayment }
  from '@/lib/features/studentPayment/studentPaymentThunk';


/* =====================================================
   UI MODELS
===================================================== */

type PaymentLogUI = {
  paidAmount: number;
  paymentMode?: string;
  paidDate?: string;
  transactionId?: string;
};

type PaymentCardUI = {
  studentPaymentId: number;
  courseName: string;

  installmentCount: number;
  amount: number;
  transactionId?: string;

  paidAmount?: number;
  paidDate?: string;
  paymentMode?: string;

  paymentStatus: 'PAID' | 'UNPAID';
  paymentLogs: PaymentLogUI[];
};

/* =====================================================
   PROPS
===================================================== */

type FeesTabProps = {
  studentId: number;
};

/* =====================================================
   COMPONENT
===================================================== */

export default function FeesTab({ studentId }: FeesTabProps) {
  const dispatch = useAppDispatch();

  const { payments, loading, error } = useAppSelector(state => ({
    payments: state.studentPayments.payments,
    loading: state.studentPayments.loading,
    error: state.studentPayments.error,
  }));

  const [selectedPayment, setSelectedPayment] =
    useState<PaymentCardUI | null>(null);

  const [payAmount, setPayAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (selectedPayment) {
      setPayAmount(selectedPayment.amount);
      setPaymentMode('');
    } else {
      setPayAmount(0);
      setPaymentMode('');
    }
  }, [selectedPayment]);


  const handleConfirmPayment = async () => {
    if (!selectedPayment) return;

    if (!payAmount || payAmount <= 0) {
      alert('Enter valid amount');
      return;
    }

    if (!paymentMode) {
      alert('Select payment mode');
      return;
    }

    try {
      setSubmitting(true);

      await dispatch(
        updateStudentPayment({
          studentPaymentId: selectedPayment.studentPaymentId,
          paidAmount: payAmount,
          paymentMode,
          paymentStatus: 'Success',
          paidDate: new Date().toISOString(),
        })
      ).unwrap();

      // ✅ Reload fees
      await dispatch(fetchStudentPaymentsByStudentId(studentId));

      // ✅ Reset right panel
      setSelectedPayment(null);
    } catch (err) {
      console.error(err);
      alert('Payment failed');
    } finally {
      setSubmitting(false);
    }
  };


  /* =====================================================
     FETCH PAYMENTS
  ===================================================== */

  useEffect(() => {
    if (studentId) {
      dispatch(fetchStudentPaymentsByStudentId(studentId));
    }
  }, [studentId, dispatch]);

  /* =====================================================
     DERIVE ACTIVE ENROLLMENT ID
  ===================================================== */

  const activeEnrollmentId = useMemo(() => {
    if (!payments.length) return null;
    return payments[0].studentEnrollmentId; // 👈 auto-pick
  }, [payments]);

  /* =====================================================
     MAP BACKEND → UI
  ===================================================== */

  const paymentCards: PaymentCardUI[] = useMemo(() => {
    if (!activeEnrollmentId) return [];

    return payments
      .filter(p => p.studentEnrollmentId === activeEnrollmentId)
      .map(p => ({
        studentPaymentId: p.studentPaymentId,
        courseName: p.courseName,

        installmentCount: p.installmentCount,
        amount: p.amount,

        paidAmount: p.amountPaid ?? undefined,
        transactionId: p.transactionId ?? undefined,
        paidDate: p.paidDate ?? undefined,
        paymentMode: p.paymentMode ?? undefined,

        paymentStatus:
          p.amountPaid && p.amountPaid > 0 ? 'PAID' : 'UNPAID',

        paymentLogs: (p.paymentLogs ?? []).map(log => ({
          paidAmount: log.paidAmount,
          paymentMode: log.paymentMode ?? undefined,
          paidDate: log.paidDate ?? undefined,
          transactionId: log.transactionId ?? undefined,
        })),
      }));
  }, [payments, activeEnrollmentId]);

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <Grid container spacing={3}>
      {/* LEFT */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">Fee Payments</Typography>
          <Typography variant="body2" color="text.secondary">
            Student ID : {studentId}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {loading && <CircularProgress size={24} />}

          {error && (
            <Typography color="error">
              {error.error || 'Failed to load payments'}
            </Typography>
          )}

          {!loading && paymentCards.length === 0 && (
            <Typography color="text.secondary">
              No installments found.
            </Typography>
          )}

          <Stack spacing={2}>
            {paymentCards.map(card => (
              <Card
                key={card.studentPaymentId}
                variant="outlined"
                sx={{
                  borderLeft:
                    card.paymentStatus === 'PAID'
                      ? '4px solid green'
                      : '4px solid orange',
                }}
              >
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="h6">
                      {card.courseName}
                    </Typography>

                    <Chip
                      label={card.paymentStatus}
                      color={
                        card.paymentStatus === 'PAID'
                          ? 'success'
                          : 'warning'
                      }
                      size="small"
                    />
                  </Stack>

                  <Divider sx={{ my: 1 }} />

                  <Typography variant="body2">
                    Installment #{card.installmentCount}
                  </Typography>

                  <Typography variant="body2">
                    Installment Amount : ₹{card.amount}
                  </Typography>

                  {card.paymentStatus === 'PAID' && (

                    <Typography variant="body2">
                      Transaction ID : {card.transactionId ?? "N/A"}
                    </Typography>

                  )}
                  {card.paymentStatus === 'UNPAID' && (
                    <Button
                      size="small"
                      variant="contained"
                      sx={{ mt: 1 }}
                      onClick={() => setSelectedPayment(card)}
                    >
                      Pay Now
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Paper>
      </Grid>

      {/* RIGHT */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">Pay Installment</Typography>
          <Divider sx={{ my: 2 }} />

          {!selectedPayment ? (
            <Typography color="text.secondary">
              Select an unpaid installment.
            </Typography>
          ) : (
            <>
              <Typography variant="subtitle2">
                {selectedPayment.courseName}
              </Typography>

              <Typography variant="body2">
                Installment #{selectedPayment.installmentCount}
              </Typography>

              <Typography variant="body2">
                Amount : ₹{selectedPayment.amount}
              </Typography>

              <Divider sx={{ my: 2 }} />

                <TextField
                  fullWidth
                  label="Pay Amount"
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  sx={{ mb: 2 }}
                />

                <TextField
                  select
                  fullWidth
                  label="Payment Mode"
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="UPI">UPI</MenuItem>
                  <MenuItem value="Card">Card</MenuItem>
                  <MenuItem value="Bank">Bank Transfer</MenuItem>
                </TextField>

                <Button
                  variant="contained"
                  fullWidth
                  color="success"
                  disabled={submitting}
                  onClick={handleConfirmPayment}
                >
                  {submitting ? 'Processing...' : 'Confirm Payment'}
                </Button>

            </>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}
