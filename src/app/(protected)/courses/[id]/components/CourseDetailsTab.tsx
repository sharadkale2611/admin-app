import { formatDate } from "@/lib/utils/dateUtils";
import { Business, CalendarToday, Category, Edit, School, TrendingUp, Update } from "@mui/icons-material";
import { Avatar, Box, Button, Chip, Divider, Grid, Paper, Stack, Typography } from "@mui/material";
import { gridFilteredTopLevelRowCountSelector } from "@mui/x-data-grid";
import Link from "next/link";

// components/CourseDetailsTab.tsx
export function CourseDetailsTab({ 
    course,
    courseId }: {
        course: any;
        courseId: number;
    }) {


    const getLevelColor = (
        level: string
    ): 'success' | 'warning' | 'error' | 'default' => {
        switch (level) {
            case 'Beginner':
                return 'success';
            case 'Intermediate':
                return 'warning';
            case 'Expert':
                return 'error';
            default:
                return 'default';
        }
    };

    return (
        <Grid container spacing={3}>
            {/* LEFT */}
            <Grid size={{ xs: 12, md: 8 }}>
                <Paper sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                            <School />
                        </Avatar>
                        <Box>
                            <Typography variant="h5">{course.courseName}</Typography>
                            <Chip
                                label={course.courseLevel}
                                color={getLevelColor(course.courseLevel)}
                                size="small"
                            />

                        </Box>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Typography variant="body1" color="text.secondary" paragraph>
                        {course.courseDescription || 'No description available'}
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Category color="primary" />{' '}
                            {course.courseCategoryName || 'N/A'}
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TrendingUp color="primary" /> {course.courseLevel}
                        </Grid>

                        {course.firmName && (
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Business color="primary" /> {course.firmName}
                            </Grid>
                        )}
                    </Grid>
                </Paper>
            </Grid>

            {/* RIGHT */}
            <Grid size={{ xs: 12, md: 4 }}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6">Actions</Typography>

                    <Stack spacing={2} sx={{ my: 2 }}>
                        <Link href={`/courses/${courseId}/edit`}>
                            <Button fullWidth variant="contained" startIcon={<Edit />}>
                                Edit Course
                            </Button>
                        </Link>
                    </Stack>

                    <Divider />

                    <Typography variant="body2" sx={{ mt: 2 }}>
                        <CalendarToday fontSize="small" /> Created:{' '}
                        {formatDate(course.createdAt)}
                    </Typography>
                    <Typography variant="body2">
                        <Update fontSize="small" /> Updated:{' '}
                        {formatDate(course.updatedAt)}
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    );
}
