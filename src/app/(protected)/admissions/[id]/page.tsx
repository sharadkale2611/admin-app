"use client";

import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";
import { ArrowBack, Edit } from "@mui/icons-material";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchAdmissionById } from "@/lib/features/admission/admissionThunks";
import { clearCurrentAdmission } from "@/lib/features/admission/admissionSlice";

const ViewAdmissionPage = () => {
  const { id } = useParams<{ id: string }>();
  const admissionId = Number(id);

  const dispatch = useDispatch<AppDispatch>();
  const { currentAdmission, loading } = useSelector(
    (state: RootState) => state.admissions
  );

  useEffect(() => {
    if (!isNaN(admissionId)) {
      dispatch(fetchAdmissionById(admissionId));
    }

    return () => {
      dispatch(clearCurrentAdmission());
    };
  }, [admissionId, dispatch]);

  const formatDate = (dateStr: string | null) =>
    dateStr ? dateStr.split("T")[0] : "—";

  if (loading || isNaN(admissionId)) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!currentAdmission) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>No admission found.</Typography>
      </Box>
    );
  }

  const adm = currentAdmission;

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
        <Stack direction="row" spacing={2}>
          <Button
            startIcon={<ArrowBack />}
            component={Link}
            href="/admissions"
            variant="outlined"
          >
            Back
          </Button>
          <Typography variant="h4">Admission Details</Typography>
        </Stack>

        <Button
          startIcon={<Edit />}
          variant="contained"
          component={Link}
          href={`/admissions/${adm.studentEnrollmentId}/edit`}
        >
          Edit
        </Button>
      </Stack>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Basic Information
        </Typography>

        <Stack spacing={1}>
          <Typography><strong>ID:</strong> {adm.studentEnrollmentId}</Typography>
          <Typography><strong>Student Name:</strong> {adm.studentName}</Typography>
          <Typography><strong>Course:</strong> {adm.courseName}</Typography>
          <Typography><strong>Enrollment Type:</strong> {adm.enrollmentType}</Typography>

          <Typography sx={{ display: "flex", gap: 1 }}>
            <strong>Payment Status:</strong>
            <Chip
              label={adm.paymentStatus}
              size="small"
              color={
                adm.paymentStatus === "Paid"
                  ? "success"
                  : adm.paymentStatus === "Pending"
                    ? "warning"
                    : "error"
              }
            />
          </Typography>

          <Typography><strong>Final Amount:</strong> ₹{adm.finalAmount}</Typography>
          <Typography><strong>Paid Amount:</strong> ₹{adm.paidAmount}</Typography>

          <Typography sx={{ display: "flex", gap: 1 }}>
            <strong>Status:</strong>
            <Chip
              label={adm.status ? "Active" : "Inactive"}
              size="small"
              color={adm.status ? "success" : "error"}
            />
          </Typography>

          <Typography>
            <strong>Enrollment Date:</strong> {formatDate(adm.enrollmentDate)}
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default ViewAdmissionPage;
