'use client';

import { useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    Paper,
    Stack,
    TextField,
    Typography
} from '@mui/material';

import {
    Lock,
    School,
    CalendarMonth,
    Phone,
    LocationOn,
    Description,
    Payment,
    Verified,
    Security
} from '@mui/icons-material';
import { useAppDispatch } from '@/lib/hooks';
import { changePassword } from '@/lib/features/auth/authThunks';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/hooks';


export default function ProfilePage() {
    const [showChangePassword, setShowChangePassword] = useState(false);
    const dispatch = useAppDispatch(); // ✅ ADD THIS
   const router = useRouter();
    const { user } = useAppSelector((state) => state.auth);

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

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

        // Redirect to login page
        router.push('/login');

    } catch (error: any) {
        alert(error?.message || 'Failed to change password');
    }
};


    return (
        <Box component="main" sx={{ p: 3 }}>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Stack direction="row" spacing={3} alignItems="center">
                    <Avatar sx={{ width: 80, height: 80 }}>
                        <School />
                    </Avatar>
                    <Box>
                        <Typography variant="h4">{user?.firmName || '—'}</Typography>
                        {/* <Typography variant="h4">Shiva Training Institute</Typography> */}
                        <Stack direction="row" spacing={1} mt={1}>
                            <Chip label="Active" color="success" />
                            <Chip label="Verified" color="primary" icon={<Verified />} />
                        </Stack>
                    </Box>
                </Stack>
            </Paper>

            <Grid container spacing={3}>
                {/* ADMIN ACCOUNT */}
                <Grid size={{xs:12, md:4}}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                <Security /> Admin Account
                            </Typography>
                           
                           <Typography><strong>Username:</strong> {user?.username || '—'}</Typography>
                           <Typography><strong>Email:</strong> {user?.email || '—'}</Typography>

                            {/* <Typography><strong>Username:</strong> admin</Typography>
                            <Typography><strong>Email:</strong> admin@shiva.edu</Typography> */}

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
                                                    currentPassword: e.target.value
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
                                                    newPassword: e.target.value
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
                                                    confirmPassword: e.target.value
                                                })
                                            }
                                        />

                                        <Stack direction="row" spacing={1}>
                                            <Button
                                                variant="contained"
                                                color="primary"
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

                {/* FIRM INFO */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                <School /> Firm Details
                            </Typography>
                            <Typography><LocationOn fontSize="small" /> Bangalore, India</Typography>
                            <Typography><Phone fontSize="small" /> +91 9876543210</Typography>
                            
                        </CardContent>
                    </Card>
                </Grid>

                {/* SUBSCRIPTION */}
                {/* <Grid size={{ xs: 12, md: 4 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                <Payment /> Subscription
                            </Typography>
                            <Typography><strong>Plan:</strong> Enterprise</Typography>
                            <Typography><CalendarMonth fontSize="small" /> Valid till 31 Dec 2025</Typography>
                            <Divider sx={{ my: 2 }} />
                            <Button variant="contained" fullWidth>
                                Manage Billing
                            </Button>
                        </CardContent>
                    </Card>
                </Grid> */}
            </Grid>
        </Box>
    );
}
