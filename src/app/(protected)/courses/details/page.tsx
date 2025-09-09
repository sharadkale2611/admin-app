'use client'
import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Divider,
    Chip,
    Button,
    Box,
    List,
    ListItem,
    ListItemText,
    Avatar,
    Paper,
    Grid
} from '@mui/material';
import { Edit, ArrowBack } from '@mui/icons-material';
import Link from 'next/link';

const courseDetails = {
    id: 1,
    title: 'Introduction to Computer Science',
    code: 'CS101',
    department: 'Computer Science',
    duration: '12 weeks',
    description: 'This course provides an introduction to the intellectual enterprises of computer science and the art of programming.',
    status: 'Active',
    instructors: [
        { id: 1, name: 'Dr. John Smith', email: 'john.smith@example.com' },
        { id: 2, name: 'Prof. Sarah Johnson', email: 'sarah.j@example.com' }
    ],
    createdAt: '2023-01-15',
    updatedAt: '2023-06-20'
};

export default function CourseDetails() {
    const router = useRouter();
    const { id } = useParams();

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Link href="/courses" passHref>
                            <Button startIcon={<ArrowBack />}>Back to Courses</Button>
                        </Link>
                        <Typography variant="h4" component="h1">
                            {courseDetails.title}
                        </Typography>
                        <Chip
                            label={courseDetails.status}
                            color={courseDetails.status === 'Active' ? 'success' : 'error'}
                            sx={{ ml: 'auto' }}
                        />
                    </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 8 }}>
                    <Card>
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="subtitle1" color="textSecondary">Course Code</Typography>
                                    <Typography variant="body1">{courseDetails.code}</Typography>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="subtitle1" color="textSecondary">Department</Typography>
                                    <Typography variant="body1">{courseDetails.department}</Typography>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="subtitle1" color="textSecondary">Duration</Typography>
                                    <Typography variant="body1">{courseDetails.duration}</Typography>
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="subtitle1" color="textSecondary">Description</Typography>
                                    <Typography variant="body1" paragraph>
                                        {courseDetails.description}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Instructors</Typography>
                        <List>
                            {courseDetails.instructors.map((instructor) => (
                                <ListItem key={instructor.id}>
                                    <Avatar sx={{ mr: 2 }}>{instructor.name.charAt(0)}</Avatar>
                                    <ListItemText
                                        primary={instructor.name}
                                        secondary={instructor.email}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>

                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Link href={`/courses/${id}/edit`} passHref>
                            <Button variant="contained" startIcon={<Edit />} sx={{ mt: 2 }}>
                                Edit Course
                            </Button>
                        </Link>
                    </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Card>
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="subtitle1" color="textSecondary">Created At</Typography>
                                    <Typography variant="body1">{courseDetails.createdAt}</Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="subtitle1" color="textSecondary">Last Updated</Typography>
                                    <Typography variant="body1">{courseDetails.updatedAt}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}
