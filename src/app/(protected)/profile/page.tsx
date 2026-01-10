'use client';
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
    Typography
} from '@mui/material';
import {
    Lock,
    School,
    CalendarMonth,
    Phone,
    LocationOn,
    Description,
    Payment
} from '@mui/icons-material';

interface ProfileData {
    user: {
        userId: number;
        username: string;
        email: string | null;
        roles: string[];
        lastLoginAt: string;
        profileImage?: string;
    };
    firm: {
        firmId: number;
        firmName: string;
        firmCode: string;
        description?: string;
        logo?: string;
        location?: string;
        contactNumber?: string;
    };
    subscription: {
        plan: string;
        status: string;
        startDate: string;
        endDate: string;
        features: string[];
    };
    stats?: {
        courses: number;
        students: number;
        activeSessions: number;
    };
}

export default function ProfilePage() {
    const profileData: ProfileData = {
        user: {
            userId: 16,
            username: "admin",
            email: "admin@shiva.edu",
            roles: ["Admin"],
            lastLoginAt: "2025-08-11T08:30:56.9414144Z",
            profileImage: "/path/to/profile.jpg"
        },
        firm: {
            firmId: 23,
            firmName: "Shiva Training Institute",
            firmCode: "SHIVA",
            description: "Premier training institute for professional courses in technology and management.",
            logo: "/path/to/logo.png",
            location: "Bangalore, India",
            contactNumber: "+91 9876543210"
        },
        subscription: {
            plan: "Enterprise",
            status: "Active",
            startDate: "2025-01-01",
            endDate: "2025-12-31",
            features: [
                "Unlimited Courses",
                "500 Student Capacity",
                "Advanced Analytics",
                "Priority Support"
            ]
        },
        stats: {
            courses: 24,
            students: 342,
            activeSessions: 8
        }
    };

    return (
        <Box component="main" sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Institute Profile
            </Typography>

            <Grid container spacing={3}>
                {/* User Profile Section */}
                <Grid size={{ xs: 12, md: 4 }} >
                    <Card elevation={3}>
                        <CardContent>
                            <Stack alignItems="center" spacing={2}>
                                <Avatar
                                    src={profileData.user.profileImage}
                                    sx={{ width: 120, height: 120, mb: 2 }}
                                />
                                <Typography variant="h5" component="div">
                                    {profileData.user.username}
                                </Typography>
                                <Typography color="text.secondary" component="div">
                                    {profileData.user.email}
                                </Typography>

                                <Stack direction="row" spacing={1} sx={{ my: 1 }}>
                                    {profileData.user.roles.map(role => (
                                        <Chip key={role} label={role} color="primary" size="small" />
                                    ))}
                                </Stack>

                                <Typography variant="body2" color="text.secondary" component="div">
                                    Last login: {new Date(profileData.user.lastLoginAt).toLocaleString()}
                                </Typography>

                                <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                                    Edit Profile
                                </Button>
                                <Button variant="outlined" fullWidth startIcon={<Lock />}>
                                    Change Password
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Firm Details Section */}
                <Grid size={{ xs: 12, md: 4 }} >
                    <Card elevation={3}>
                        <CardContent>
                            <Typography variant="h5" component="h2" gutterBottom>
                                <School sx={{ verticalAlign: 'middle', mr: 1 }} />
                                Institute Details
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="subtitle1" component="h3">
                                        Basic Information
                                    </Typography>
                                    <Stack spacing={1} sx={{ mt: 1 }} component="div">
                                        <Typography component="div">
                                            <strong>Name:</strong> {profileData.firm.firmName}
                                        </Typography>
                                        <Typography component="div">
                                            <strong>Code:</strong> {profileData.firm.firmCode}
                                        </Typography>
                                        <Typography component="div">
                                            <LocationOn fontSize="small" color="action" />
                                            {profileData.firm.location}
                                        </Typography>
                                        <Typography component="div">
                                            <Phone fontSize="small" color="action" />
                                            {profileData.firm.contactNumber}
                                        </Typography>
                                    </Stack>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="subtitle1" component="h3">
                                        Description
                                    </Typography>
                                    <Paper variant="outlined" sx={{ p: 2, mt: 1, minHeight: 100 }}>
                                        <Typography component="div">{profileData.firm.description}</Typography>
                                    </Paper>
                                </Grid>
                            </Grid>

                            <Button variant="outlined" sx={{ mt: 2 }} startIcon={<Description />}>
                                View Institute Documents
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Subscription Section */}
                    <Card elevation={3} sx={{ mt: 3 }}>
                        <CardContent>
                            <Typography variant="h5" component="h2" gutterBottom>
                                <Payment sx={{ verticalAlign: 'middle', mr: 1 }} />
                                Subscription Plan
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Stack spacing={1} component="div">
                                        <Typography component="div">
                                            <strong>Plan:</strong> {profileData.subscription.plan}
                                        </Typography>
                                        <Typography component="div">
                                            <strong>Status:</strong>
                                            <Chip
                                                label={profileData.subscription.status}
                                                color={profileData.subscription.status === 'Active' ? 'success' : 'error'}
                                                size="small"
                                                sx={{ ml: 1 }}
                                            />
                                        </Typography>
                                        <Typography component="div">
                                            <CalendarMonth fontSize="small" color="action" />
                                            <strong>Start:</strong> {profileData.subscription.startDate}
                                        </Typography>
                                        <Typography component="div">
                                            <CalendarMonth fontSize="small" color="action" />
                                            <strong>End:</strong> {profileData.subscription.endDate}
                                        </Typography>
                                    </Stack>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="subtitle1" component="h3">
                                        Features
                                    </Typography>
                                    <Stack spacing={1} sx={{ mt: 1 }} component="div">
                                        {profileData.subscription.features.map((feature, index) => (
                                            <Typography key={index} sx={{ display: 'flex', alignItems: 'center' }} component="div">
                                                <Box component="span" sx={{
                                                    width: 8,
                                                    height: 8,
                                                    bgcolor: 'primary.main',
                                                    borderRadius: '50%',
                                                    mr: 1
                                                }} />
                                                {feature}
                                            </Typography>
                                        ))}
                                    </Stack>
                                </Grid>
                            </Grid>

                            <Button variant="contained" sx={{ mt: 2 }}>
                                Upgrade Plan
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Statistics Section */}
            <Grid container spacing={3} sx={{ mt: 1 }}>
                {profileData.stats && Object.entries(profileData.stats).map(([key, value]) => (
                    <Grid key={key} size={{ xs: 12, md: 6, sm:6 }}>
                        <Card elevation={3}>
                            <CardContent>
                                <Typography variant="h6" color="text.secondary" component="h3">
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </Typography>
                                <Typography variant="h3" component="div">
                                    {value}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}