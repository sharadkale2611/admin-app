'use client'
import React from 'react';
import {
    Box,
    Typography,
    IconButton,
    Paper,
    Pagination,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Stack,
    SelectChangeEvent,
    useMediaQuery,
    Theme,
    CardContent,
    Collapse,
    TableSortLabel,
    Button,
    TextField,
    Avatar,
    Chip,
    Switch,
    FormControlLabel,
    Card,
    CardActions,
    Grid
} from '@mui/material';
import {
    ArrowBack,
    Edit,
    Visibility,
    Delete,
    KeyboardArrowDown,
    KeyboardArrowUp,
    Add,
    Search
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import Link from 'next/link';
import { useDeleteCourse } from '@/lib/features/course/useDeleteCourse';
import { useCourseViewModel } from '@/lib/features/course/useCourseViewModel';
import { Course, CourseLevel } from '@/lib/features/course/courseTypes';
import { useRouter } from 'next/navigation';


const CourseList: React.FC = () => {
    const router = useRouter();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    // Use the ViewModel
    const {
        courses,
        isLoading,
        error,
        page,
        totalPages,
        searchTerm,
        statusFilter,
        courseLevelFilter,
        categoryFilter,
        handleSearch,
        handleStatusFilter,
        handleCourseLevelFilter,
        handleCategoryFilter,
        handleResetFilters,
        handlePageChange,
        refetch
    } = useCourseViewModel();

    // State for UI controls
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [sortModel, setSortModel] = React.useState<GridSortModel>([{ field: 'courseId', sort: 'asc' }]);
    const [expandedRows, setExpandedRows] = React.useState<string[]>([]);
    const [localSearchTerm, setLocalSearchTerm] = React.useState(searchTerm);

    // Use the delete hook
    const { handleDelete } = useDeleteCourse();

    // Delete handler
    const onDeleteCourse = async (courseId: number, courseName: string) => {
        const success = await handleDelete(courseId, courseName);
        if (success) {
            refetch();
        }
    };

    const handleChangeRowsPerPage = (event: SelectChangeEvent) => {
        setRowsPerPage(Number(event.target.value));
        handlePageChange(1);
    };

    const handleSortModelChange = (newModel: GridSortModel) => {
        setSortModel(newModel);
    };

    const toggleRowExpand = (courseId: number) => {
        const idString = courseId.toString();
        setExpandedRows(prev =>
            prev.includes(idString) ? prev.filter(rowId => rowId !== idString) : [...prev, idString]
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch(localSearchTerm);
    };

    // Calculate current page data
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    // Sort data
    const sortedCourses = courses.length > 0 ? [...courses].sort((a, b) => {
        const sortItem = sortModel[0];
        if (!sortItem) return 0;

        const aValue = a?.[sortItem.field as keyof typeof a];
        const bValue = b?.[sortItem.field as keyof typeof b];

        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined) return sortItem.sort === 'asc' ? 1 : -1;
        if (bValue === undefined) return sortItem.sort === 'asc' ? -1 : 1;

        if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
            return sortItem.sort === 'asc'
                ? (aValue === bValue ? 0 : aValue ? -1 : 1)
                : (aValue === bValue ? 0 : aValue ? 1 : -1);
        }

        const aString = String(aValue || '');
        const bString = String(bValue || '');

        return sortItem.sort === 'asc'
            ? aString.localeCompare(bString)
            : bString.localeCompare(aString);
    }) : [];

    const currentCourses = sortedCourses.slice(startIndex, endIndex);

    // Columns configuration
    const columns: GridColDef<Course>[] = [
        {
            field: 'courseId',
            headerName: 'ID',
            width: 80,
            valueGetter: (value, row) => row?.courseId ?? '',
            renderHeader: () => {
                const isActive = sortModel[0]?.field === 'courseId';
                const direction = isActive ? sortModel[0]?.sort as 'asc' | 'desc' : undefined;

                return (
                    <TableSortLabel
                        active={isActive}
                        direction={direction}
                        onClick={() => {
                            setSortModel([{
                                field: 'courseId',
                                sort: isActive
                                    ? sortModel[0]?.sort === 'asc' ? 'desc' : 'asc'
                                    : 'asc'
                            }]);
                        }}
                    >
                        ID
                    </TableSortLabel>
                );
            }
        },
        {
            field: 'courseName',
            headerName: 'Course Name',
            flex: 1,
            valueGetter: (value, row) => row?.courseName || '',
            renderHeader: () => {
                const isActive = sortModel[0]?.field === 'courseName';
                const direction = isActive ? sortModel[0]?.sort as 'asc' | 'desc' : undefined;

                return (
                    <TableSortLabel
                        active={isActive}
                        direction={direction}
                        onClick={() => {
                            setSortModel([{
                                field: 'courseName',
                                sort: isActive
                                    ? sortModel[0]?.sort === 'asc' ? 'desc' : 'asc'
                                    : 'asc'
                            }]);
                        }}
                    >
                        Course Name
                    </TableSortLabel>
                );
            }
        },
        {
            field: 'courseCategoryName',
            headerName: 'Category',
            width: 150,
            valueGetter: (value, row) => row?.courseCategoryName || '',
        },
        {
            field: 'courseLevel',
            headerName: 'Level',
            width: 120,
            valueGetter: (value, row) => row?.courseLevel || '',
            renderCell: (params) => (
                <Chip
                    label={params.row?.courseLevel}
                    color={
                        params.row?.courseLevel === CourseLevel.Expert ? 'error' :
                            params.row?.courseLevel === CourseLevel.Intermediate ? 'warning' : 'info'
                    }
                    size="small"
                />
            ),
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 100,
            valueGetter: (value, row) => row?.status || false,
            renderCell: (params) => (
                <Chip
                    label={params.row?.status ? 'Active' : 'Inactive'}
                    color={params.row?.status ? 'success' : 'error'}
                    size="small"
                />
            ),
        },
        {
            field: 'courseOrder',
            headerName: 'Order',
            width: 80,
            valueGetter: (value, row) => row?.courseOrder || 0,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            width: 150,
            renderCell: (params) => (
                <Stack direction="row" spacing={0.5}>
                    <IconButton
                        size="small"
                        color="info"
                        component={Link}
                        href={`/courses/${params.row?.courseId}`}
                        disabled={!params.row?.courseId}
                    >
                        <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        color="primary"
                        component={Link}
                        href={`/courses/${params.row?.courseId}/edit`}
                        disabled={!params.row?.courseId}
                    >
                        <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDeleteCourse(
                            params.row.courseId,
                            params.row.courseName
                        )}
                        disabled={!params.row?.courseId}
                    >
                        <Delete fontSize="small" />
                    </IconButton>
                </Stack>
            )
        }
    ];

    if (isLoading) return <Box sx={{ p: 3 }}>Loading courses...</Box>;
    if (error) return <Box sx={{ p: 3, color: 'error.main' }}>Error: {error}</Box>;

    return (
        <Box sx={{ p: isMobile ? 1 : 3 }}>
            {/* Header */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <IconButton
                        aria-label="back"
                        size={isMobile ? 'small' : 'medium'}
                        component={Link}
                        href="/dashboard"
                    >
                        <ArrowBack fontSize={isMobile ? 'small' : 'medium'} />
                    </IconButton>
                    <Typography variant={isMobile ? 'h5' : 'h4'} component="h1">
                        Course Management
                    </Typography>
                </Stack>

            </Stack>





            {/* Desktop Card Grid */}
            {!isMobile ? (
                <Grid container spacing={2} sx={{ mb: 2 }}>

                    {/* CREATE NEW CARD */}
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}  >
                        <Card
                            elevation={3}
                            sx={{
                                height: 170,
                                borderRadius: 2,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: "pointer",
                                "&:hover": { boxShadow: 6 }
                            }}
                            onClick={() => router.push("/courses/create")}
                        >
                            <Stack alignItems="center" spacing={1}>
                                <Add fontSize="large" />
                                <Typography fontWeight={600}>Create New</Typography>
                            </Stack>
                        </Card>
                    </Grid>

                    {/* COURSE CARDS */}
                    {currentCourses.map(course => (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={course.courseId}>
                            <Card
                                elevation={3}
                                sx={{
                                    height: 170,
                                    borderRadius: 2,
                                    cursor: "pointer",
                                    display: "flex",
                                    flexDirection: "column",
                                    position: "relative",
                                    "&:hover": { boxShadow: 6 }
                                }}
                                onClick={() => router.push(`/courses/${course.courseId}`)}
                            >

                                {/* Top right chips */}
                                <Box sx={{ position: "absolute", right: 10, top: 10 }}>
                                    <Chip
                                        size="small"
                                        label={course.courseLevel}
                                        sx={{ mr: 1 }}
                                    />
                                    <Chip
                                        size="small"
                                        label={course.status ? "Active" : "Inactive"}
                                        color={course.status ? "success" : "error"}
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
                                    sx={{ mt: "auto", px: 2 }}
                                    onClick={(e) => e.stopPropagation()} // prevent card click
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
                                        onClick={() =>
                                            onDeleteCourse(course.courseId, course.courseName)
                                        }
                                    >
                                        Delete
                                    </Button>
                                </CardActions>

                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (

                /* Mobile Collapsible List */
                <Box component={Paper} elevation={3} sx={{ mb: 2 }}>
                    {currentCourses.map((course) => (
                        <Box key={course.courseId}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    p: 2,
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                    cursor: 'pointer',
                                    '&:hover': { backgroundColor: 'action.hover' }
                                }}
                                onClick={() => toggleRowExpand(course.courseId)}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                                        {course.courseName?.charAt(0)}
                                    </Avatar>
                                    <Box>
                                        <Typography fontWeight="bold">
                                            {course.courseName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {course.courseCategoryName}
                                        </Typography>
                                    </Box>
                                </Box>
                                <IconButton size="small">
                                    {expandedRows.includes(course.courseId.toString()) ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                </IconButton>
                            </Box>

                            <Collapse in={expandedRows.includes(course.courseId.toString())}>
                                <CardContent>
                                    <Stack spacing={2}>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Level</Typography>
                                            <Chip
                                                label={course.courseLevel}
                                                color={
                                                    course.courseLevel === CourseLevel.Expert ? 'error' :
                                                        course.courseLevel === CourseLevel.Intermediate ? 'warning' : 'info'
                                                }
                                                size="small"
                                            />
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Status</Typography>
                                            <Chip
                                                label={course.status ? 'Active' : 'Inactive'}
                                                color={course.status ? 'success' : 'error'}
                                                size="small"
                                            />
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Order</Typography>
                                            <Typography>{course.courseOrder}</Typography>
                                        </Box>
                                        <Stack direction="row" spacing={1}>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<Visibility />}
                                                fullWidth
                                                component={Link}
                                                href={`/courses/${course.courseId}`}
                                            >
                                                View
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<Edit />}
                                                color="primary"
                                                fullWidth
                                                component={Link}
                                                href={`/courses/${course.courseId}/edit`}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<Delete />}
                                                color="error"
                                                fullWidth
                                                onClick={() => onDeleteCourse(course.courseId, course.courseName)}
                                            >
                                                Delete
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Collapse>
                        </Box>
                    ))}
                </Box>
            )}

            {/* Bottom pagination */}
            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, newPage) => handlePageChange(newPage)}
                        color="primary"
                        shape="rounded"
                        size={isMobile ? 'small' : 'medium'}
                    />
                </Box>
            )}
        </Box>
    );
};

export default CourseList;