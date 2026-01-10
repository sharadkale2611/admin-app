'use client';
import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    TextField,
    Button,
    Chip,
    IconButton,
    InputAdornment,
    FormControlLabel,
    Checkbox,
    Alert,
    Skeleton,
    Stack,
    Grid,
    Card,
    CardContent,
    CardActions,
    TablePagination,
} from '@mui/material';
import { Search, Refresh, FilterList, Edit, Delete } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCourseViewModel } from '@/lib/features/course/useCourseViewModel';
import { useDeleteCourse } from '@/lib/features/course/useDeleteCourse';
import type { Course } from '@/lib/features/course/courseTypes';

const CoursesPage: React.FC = () => {
    const router = useRouter();

    const {
        courses,
        isLoading,
        error,
        page,
        totalPages,
        totalCount,
        pageSize,
        searchTerm,
        statusFilter,
        handleSearch,
        handleStatusFilter,
        handleResetFilters,
        handlePageChange,
        refetch,
    } = useCourseViewModel();

    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
    const { handleDelete } = useDeleteCourse();
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    useEffect(() => {
        setLocalSearchTerm(searchTerm);
    }, [searchTerm]);

    const activeOnly = statusFilter === true;

    const handleToggleActive = () => {
        handleStatusFilter(activeOnly ? null : true);
    };

    const handleDeleteClick = async (course: Course) => {
        setIsDeleting(course.courseId);
        try {
            const success = await handleDelete(course.courseId, course.courseName);
            if (success) refetch();
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                }}
            >
                <Typography variant="h4">Courses</Typography>
                <Link href="/courses/create">
                    <Button variant="contained">Add Course</Button>
                </Link>
            </Box>

            {/* Filters */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                    <TextField
                        size="small"
                        placeholder="Search by Course Name"
                        value={localSearchTerm}
                        onChange={(e) => setLocalSearchTerm(e.target.value)}
                        onKeyDown={(e) =>
                            e.key === 'Enter' && handleSearch(localSearchTerm)
                        }
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button
                        variant="outlined"
                        startIcon={<Search />}
                        onClick={() => handleSearch(localSearchTerm)}
                    >
                        Search
                    </Button>

                    {/* <FormControlLabel
                        control={
                            <Checkbox
                                checked={activeOnly}
                                onChange={handleToggleActive}
                            />
                        }
                        label="Active Only"
                    /> */}

                    <Button
                        variant="outlined"
                        startIcon={<FilterList />}
                        onClick={handleResetFilters}
                    >
                        Reset
                    </Button>

                    <IconButton onClick={refetch} color="primary">
                        <Refresh />
                    </IconButton>
                </Stack>
            </Paper>

            {/* Error */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {typeof error === 'string' ? error : 'Something went wrong'}
                </Alert>
            )}

            {/* Cards */}
            {isLoading ? (
                <Grid container spacing={2}>
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                            <Skeleton variant="rectangular" height={200} />
                        </Grid>
                    ))}
                </Grid>
            ) : courses.length === 0 ? (
                <Alert severity="info">
                    {searchTerm ? 'No courses found matching your search' : 'No courses found'}
                </Alert>
            ) : (
                <Grid container spacing={2}>
                    {courses.map((course) => (
                        <Grid
                            key={course.courseId}
                            size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                        >
                            <Card
                                elevation={3}
                                sx={{
                                    height: 180,
                                    borderRadius: 2,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative',
                                    '&:hover': { boxShadow: 6 },
                                }}
                                onClick={() => router.push(`/courses/${course.courseId}`)}
                            >
                                <Box sx={{ position: 'absolute', right: 10, top: 10 }}>
                                    <Chip
                                        size="small"
                                        label={course.courseLevel}
                                        sx={{ mr: 1 }}
                                    />
                                    <Chip
                                        size="small"
                                        label={course.status ? 'Active' : 'Inactive'}
                                        color={course.status ? 'success' : 'error'}
                                    />
                                </Box>

                                <CardContent sx={{ mt: 3 }}>
                                    <Typography variant="h6" fontWeight={700}>
                                        {course.courseName}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary">
                                        {course.courseCategoryName}
                                    </Typography>
                                </CardContent>

                                <CardActions
                                    sx={{ mt: 'auto', px: 2, pb: 2 }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Button
                                        fullWidth
                                        size="small"
                                        variant="outlined"
                                        startIcon={<Edit />}
                                        component={Link}
                                        href={`/courses/${course.courseId}/edit`}
                                    >
                                        Edit
                                    </Button>

                                    <Button
                                        fullWidth
                                        size="small"
                                        variant="outlined"
                                        color="error"
                                        startIcon={<Delete />}
                                        disabled={isDeleting === course.courseId}
                                        onClick={() => handleDeleteClick(course)}
                                    >
                                        Delete
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <TablePagination
                    component="div"
                    count={totalCount}
                    page={page - 1}
                    onPageChange={(_, newPage) => handlePageChange(newPage + 1)}
                    rowsPerPage={pageSize}
                    rowsPerPageOptions={[pageSize]}
                />
            )}
        </Container>
    );
};

export default CoursesPage;