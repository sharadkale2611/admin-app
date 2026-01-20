'use client';
import { useEffect } from "react";
import { fetchFirmById } from "@/lib/features/firm/firmThunks";
import { useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import {
  Lock,
  School,
  Phone,
  LocationOn,
  Verified,
  Security,
  PhotoCamera,
} from '@mui/icons-material';

import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { changePassword } from '@/lib/features/auth/authThunks';
import { uploadFirmLogo } from '@/lib/features/firm/firmThunks';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { user } = useAppSelector((state) => state.auth);
  const { currentFirm } = useAppSelector((state) => state.firms);

  useEffect(() => {
  if (!user?.firmId) return;

  dispatch(fetchFirmById(user.firmId.toString()));
}, [user?.firmId, dispatch]);

  /* ---------------- PASSWORD ---------------- */
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  /* ---------------- FIRM LOGO ---------------- */
  const [uploading, setUploading] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  console.log("handleLogoChange fired");

  if (!e.target.files?.[0]) {
    console.log("No file selected");
    return;
  }

  console.log("Selected file:", e.target.files[0].name);

  if (!currentFirm) {
    console.log("No currentFirm");
    return;
  }

  const file = e.target.files[0];

  try {
    setUploading(true);

    await dispatch(
      uploadFirmLogo({
        firmId: currentFirm.firmId,
        file,
      })
    ).unwrap();

    alert("Firm logo updated successfully");
  } catch (err: any) {
    alert(err?.message || "Failed to upload logo");
  } finally {
    setUploading(false);
  }
};


  /* ---------------- PASSWORD CHANGE ---------------- */
  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New password and confirm password do not match');
      return;
    }

    try {
      await dispatch(
        changePassword({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        })
      ).unwrap();

      alert('Password changed successfully');
      router.push('/login');
    } catch (error: any) {
      alert(error?.message || 'Failed to change password');
    }
  };

  return (
    <Box component="main" sx={{ p: 3 }}>
      {/* ================= HEADER ================= */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" spacing={3} alignItems="center">
          {/* -------- Firm Logo -------- */}
          <Box sx={{ position: 'relative', width: 80, height: 80 }}>
            <Avatar
              sx={{ width: 80, height: 80 }}
             src={
  currentFirm?.firmLogoImagePath
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${currentFirm.firmLogoImagePath}`
    : undefined
}
            >
              {!currentFirm?.firmLogoImagePath && <School />}
            </Avatar>

            <IconButton
              size="small"
              disabled={uploading}
              onClick={() => logoInputRef.current?.click()}
              sx={{
                position: 'absolute',
                bottom: -6,
                right: -6,
                bgcolor: 'background.paper',
                boxShadow: 1,
              }}
            >
              <PhotoCamera fontSize="small" />
            </IconButton>

            <input
              ref={logoInputRef}
              hidden
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
            />
          </Box>

          {/* -------- Firm Info -------- */}
          <Box>
            <Typography variant="h4">
              {user?.firmName || '—'}
            </Typography>

            <Stack direction="row" spacing={1} mt={1}>
              <Chip label="Active" color="success" />
              <Chip label="Verified" color="primary" icon={<Verified />} />
            </Stack>
          </Box>
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        {/* ================= ADMIN ACCOUNT ================= */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Security /> Admin Account
              </Typography>

              <Typography>
                <strong>Username:</strong> {user?.username || '—'}
              </Typography>
              <Typography>
                <strong>Firm Code:</strong> {user?.firmCode || '—'}
              </Typography>
              <Typography>
                <strong>Email:</strong> {user?.email || '—'}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {!showChangePassword && (
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Lock />}
                  onClick={() => setShowChangePassword(true)}
                >
                  Change Password
                </Button>
              )}

              {showChangePassword && (
                <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Change Password
                  </Typography>

                  <Stack spacing={2}>
                    <TextField
                      label="Current Password"
                      type="password"
                      fullWidth
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value,
                        })
                      }
                    />

                    <TextField
                      label="New Password"
                      type="password"
                      fullWidth
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                    />

                    <TextField
                      label="Confirm New Password"
                      type="password"
                      fullWidth
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value,
                        })
                      }
                    />

                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        onClick={handlePasswordChange}
                      >
                        Update Password
                      </Button>
                      <Button
                        variant="text"
                        onClick={() => setShowChangePassword(false)}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* ================= FIRM DETAILS ================= */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <School /> Firm Details
              </Typography>

              <Typography>
                <LocationOn fontSize="small" /> Bangalore, India
              </Typography>
              <Typography>
                <Phone fontSize="small" /> +91 9876543210
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
