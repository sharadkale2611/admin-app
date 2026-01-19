'use client';

import { useEffect, useState } from 'react';
import { useAppSelector } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  Chip,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LoginIcon from '@mui/icons-material/Login';

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const { isAuthenticated, initialCheckDone } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // ⛔ Prevent SSR/client mismatch
  // if (!mounted || !initialCheckDone) return null;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #f9fafb 0%, #eef2ff 100%)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={5} alignItems="center" textAlign="center">
          {/* Logo / Brand */}
          <Stack direction="row" spacing={1} alignItems="center">
            <SchoolIcon color="primary" fontSize="large" />
            <Typography variant="h5" fontWeight={700}>
              Institute Admin
            </Typography>
          </Stack>

          {/* Headline */}
          <Typography
            variant="h3"
            fontWeight={800}
            lineHeight={1.2}
          >
            Manage Your Institute
            <br />
            <Box component="span" color="primary.main">
              Smarter. Faster. Secure.
            </Box>
          </Typography>

          {/* Subtext */}
          <Typography variant="h6" color="text.secondary">
            Attendance, Exams, Students, Courses & Batches —
            all in one powerful platform.
          </Typography>

          {/* Feature Chips */}
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            justifyContent="center"
          >
            {[
              'Attendance',
              'Exams',
              'Students',
              'Courses',
              'Batches',
              'Reports',
            ].map((item) => (
              <Chip key={item} label={item} />
            ))}
          </Stack>

          {/* CTA */}
          <Stack direction="row" spacing={2}>
            {isAuthenticated ? (
              <Button
                size="large"
                variant="contained"
                startIcon={<DashboardIcon />}
                onClick={() => router.push('/dashboard')}
                sx={{ px: 4, py: 1.5 }}
              >
                Go to Dashboard
              </Button>
            ) : (
              <Button
                size="large"
                variant="contained"
                startIcon={<LoginIcon />}
                onClick={() => router.push('/login')}
                sx={{ px: 4, py: 1.5 }}
              >
                Login
              </Button>
            )}

            {!isAuthenticated && (
              <Button
                size="large"
                variant="outlined"
                onClick={() => router.push('/login')}
                sx={{ px: 4, py: 1.5 }}
              >
                Get Started
              </Button>
            )}
          </Stack>

          {/* Footer hint */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 4 }}
          >
            Trusted by modern coaching institutes & schools
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
