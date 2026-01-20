'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Cancel, Save } from '@mui/icons-material';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

import api from '@/lib/services/apiService';
import API_ENDPOINTS from '@/lib/config/apiConfig';

import type { Batch } from '@/lib/features/batch/batchTypes';
import type { Staff } from '@/lib/features/staff/staffTypes';
import type { ModuleResponseDto } from '@/lib/features/module/moduleTypes';

type CreateAttendanceSessionDto = {
  batchId: number;
  staffId: number;
  moduleId: number;
};

type ApiSession = {
  sessionId: number;
  batchId: number;
  staffId: number;
  moduleId: number;
  sessionDate?: string;
};

type CreateAttendanceSessionResponseData = {
  session?: ApiSession;
  Session?: ApiSession;
  studentsMarked?: number;
  StudentsMarked?: number;
};

export default function CreateAttendanceSessionPage() {
  const router = useRouter();

  const [batches, setBatches] = useState<Batch[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [modules, setModules] = useState<ModuleResponseDto[]>([]);

  const [formData, setFormData] = useState({
    batchId: '',
    staffId: '',
    moduleId: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setError(null);

        const [batchesRes, staffRes, modulesRes] = await Promise.all([
          api.get<Batch[]>(API_ENDPOINTS.BATCHES.GET_LIST, {
            withCredentials: true,
          }),
          api.get<Staff[]>(API_ENDPOINTS.STAFF.GET_LIST, {
            withCredentials: true,
          }),
          api.get<ModuleResponseDto[]>(API_ENDPOINTS.MODULES.GET_LIST, {
            withCredentials: true,
          }),
        ]);

        if (!active) return;

        setBatches(batchesRes.data ?? []);
        setStaff(staffRes.data ?? []);
        setModules(modulesRes.data ?? []);
      } catch (e: any) {
        if (!active) return;
        setError(e?.message || 'Failed to load dropdown data');
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  const selectedBatch = useMemo(() => {
    const id = Number(formData.batchId);
    if (!id) return null;
    return batches.find((b) => b.batchId === id) ?? null;
  }, [batches, formData.batchId]);

  const handleChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const next = { ...prev, [name]: value } as typeof prev;

      if (name === 'batchId') {
        const batchId = Number(value);
        const batch = batches.find((b) => b.batchId === batchId);

        // if batch has a moduleId, prefill it (still editable)
        if (batch?.moduleId) {
          next.moduleId = String(batch.moduleId);
        }
      }

      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.batchId || !formData.staffId || !formData.moduleId) {
        throw new Error('Please select Batch, Staff, and Module');
      }

      const payload: CreateAttendanceSessionDto = {
        batchId: Number(formData.batchId),
        staffId: Number(formData.staffId),
        moduleId: Number(formData.moduleId),
      };

      const res = await api.post<CreateAttendanceSessionResponseData>(
        API_ENDPOINTS.ATTENDANCE_SESSIONS.POST_CREATE,
        payload,
        { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
      );

      if (!res?.success) {
        throw new Error(res?.error || res?.message || 'Failed to create session');
      }

      const data = res.data;
      const session = data?.session ?? (data as any)?.Session;

      if (!session?.sessionId) {
        throw new Error('Session created but sessionId missing in response');
      }

      const msg = res.message || 'Attendance session created successfully';

      // If API says already exists, treat as info (but still redirect)
      const isAlreadyExists = msg.toLowerCase().includes('already exists');

      if (isAlreadyExists) {
        toast.info(msg);
        await Swal.fire({
          icon: 'info',
          title: 'Session already exists',
          text: msg,
          confirmButtonColor: '#3085d6',
        });
      } else {
        toast.success(msg);
        await Swal.fire({
          icon: 'success',
          title: 'Session Ready',
          text: msg,
          confirmButtonColor: '#3085d6',
          timer: 1500,
          showConfirmButton: false,
        });
      }

      router.push(`/attendance/sessions/${session.sessionId}`);
    } catch (err: any) {
      const message = err?.message || err?.error || 'Server error';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Create Attendance Session
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Create today’s session for a batch and start marking attendance.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, color: 'text.secondary' }}>
                Session Details
              </Typography>
            </Grid>

            {/* Batch */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Batch</InputLabel>
                <Select
                  name="batchId"
                  label="Batch"
                  value={formData.batchId}
                  onChange={handleChange}
                  disabled={loading}
                  required
                >
                  <MenuItem value="">-- Select Batch --</MenuItem>
                  {batches.map((b) => (
                    <MenuItem key={b.batchId} value={String(b.batchId)}>
                      {b.batchCode}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Staff */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Staff</InputLabel>
                <Select
                  name="staffId"
                  label="Staff"
                  value={formData.staffId}
                  onChange={handleChange}
                  disabled={loading}
                  required
                >
                  <MenuItem value="">-- Select Staff --</MenuItem>
                  {staff.map((s) => (
                    <MenuItem key={s.staffId} value={String(s.staffId)}>
                      {s.firstName} {s.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Module */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Module</InputLabel>
                <Select
                  name="moduleId"
                  label="Module"
                  value={formData.moduleId}
                  onChange={handleChange}
                  disabled={loading}
                  required
                >
                  <MenuItem value="">-- Select Module --</MenuItem>
                  {modules.map((m) => (
                    <MenuItem key={m.moduleId} value={String(m.moduleId)}>
                      {m.moduleName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Preview */}
            <Grid size={{ xs: 12 }}>
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'grey.200' }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Selected Batch: <b>{selectedBatch?.batchCode ?? '—'}</b>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Session Date: <b>Today</b>
                  </Typography>
                </Stack>
              </Box>
            </Grid>

            {/* Buttons */}
            <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
              <Stack direction="row" spacing={2}>
                <Button
                  component={Link}
                  href="/attendance/sessions"
                  variant="outlined"
                  color="secondary"
                  startIcon={<Cancel />}
                  size="small"
                  disabled={loading}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  size="small"
                  disabled={loading}
                >
                  {loading ? 'Creating…' : 'Create Session'}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}
