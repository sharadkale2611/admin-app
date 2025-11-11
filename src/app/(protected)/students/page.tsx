'use client'
import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    Button,
    Chip,
    IconButton,
    InputAdornment,
    FormControlLabel,
    Checkbox,
    Alert,
    Skeleton,
    Stack
} from '@mui/material';
import {
    Search,
    Add,
    Refresh,
    Visibility,
    Edit,
    Delete,
    FilterList
} from '@mui/icons-material';
import Link from 'next/link';
import { useStudentViewModel } from '@/lib/features/student/useStudentViewModel';
import { ApiError, Student } from '@/lib/features/student/studentTypes';
import { useDeleteStudent } from '@/lib/features/student/useDeleteStudent';

function renderErrorContent(error: ApiError | null) {
    if (!error) return null;

    // Render the main error message if exists
    if (error.error) return <div>{error.error}</div>;

    // Render array of errors if exists
    if (Array.isArray(error.errors)) {
        return error.errors.map((e, i) => (
            <div key={i}>{typeof e === 'string' ? e : JSON.stringify(e)}</div>
        ));
    }

    return null;
}


export default function StudentsPage() {
    const {
        students,
        isLoading,
        error,
        page,
        totalPages,
        searchTerm,
        activeOnly,
        handleSearch,
        handleToggleActive,
        handleResetFilters,
        handlePageChange,
        refetch
    } = useStudentViewModel();

    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
    const { handleDelete } = useDeleteStudent(); // Use the delete hook
    const [isDeleting, setIsDeleting] = useState<string | null>(null); // Track which student is being deleted


    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSearchTerm(event.target.value);
    };

    const handleSearchSubmit = () => {
        handleSearch(localSearchTerm);
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleSearchSubmit();
        }
    };

    const handleDeleteClick = async (student: Student) => {
        setIsDeleting(student.studentId);
        try {
            const success = await handleDelete(
                student.studentId,
                `${student.firstName} ${student.lastName}`
            );

            if (success) {
                // Refresh the data after successful deletion
                refetch();
            }
        } catch (error) {
            console.error('Delete error:', error);
        } finally {
            setIsDeleting(null);
        }
    };


    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Students
                </Typography>
                <Link href="/students/create" passHref>
                    <Button variant="contained" startIcon={<Add />}>
                        Add Student
                    </Button>
                </Link>
            </Box>

            {/* Filters */}
            <Paper sx={{ p: 3, mb: 3 }} elevation={1}>
                <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                    <TextField
                        placeholder="Search students..."
                        value={localSearchTerm}
                        onChange={handleSearchChange}
                        onKeyPress={handleKeyPress}
                        size="small"
                        sx={{ minWidth: 250 }}
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
                        onClick={handleSearchSubmit}
                        startIcon={<Search />}
                    >
                        Search
                    </Button>

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={activeOnly}
                                onChange={handleToggleActive}
                                color="primary"
                            />
                        }
                        label="Active Only"
                    />

                    <Button
                        variant="outlined"
                        onClick={handleResetFilters}
                        startIcon={<FilterList />}
                    >
                        Reset Filters
                    </Button>

                    <IconButton onClick={refetch} color="primary">
                        <Refresh />
                    </IconButton>
                </Stack>
            </Paper>

            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {renderErrorContent(error)}
                </Alert>
            )}

            {/* Content */}
            <Paper elevation={2}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Student Code</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Date of Birth</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Created</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                // Loading skeletons
                                Array.from(new Array(5)).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell><Skeleton variant="text" /></TableCell>
                                        <TableCell><Skeleton variant="text" /></TableCell>
                                        <TableCell><Skeleton variant="text" /></TableCell>
                                        <TableCell><Skeleton variant="text" /></TableCell>
                                        <TableCell><Skeleton variant="text" /></TableCell>
                                        <TableCell><Skeleton variant="text" /></TableCell>
                                        <TableCell><Skeleton variant="text" /></TableCell>
                                        <TableCell><Skeleton variant="text" width={100} /></TableCell>
                                    </TableRow>
                                ))
                            ) : students.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                        <Typography variant="body1" color="text.secondary">
                                            {searchTerm ? 'No students found matching your search' : 'No students found'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                students.map((student: Student) => (
                                    <TableRow key={student.studentId} hover>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="medium">
                                                {student.studentCode}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {student.firstName} {student.lastName}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{student.email || '-'}</TableCell>
                                        <TableCell>{student.mobileNumber || '-'}</TableCell>
                                        <TableCell>
                                            {student.dateOfBirth ? formatDate(student.dateOfBirth) : '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={student.isActive ? 'Active' : 'Inactive'}
                                                color={student.isActive ? 'success' : 'error'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{formatDate(student.createdAt)}</TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1}>
                                                <Link href={`/students/${student.studentId}`} passHref>
                                                    <IconButton size="small" color="primary">
                                                        <Visibility />
                                                    </IconButton>
                                                </Link>
                                                <Link href={`/students/${student.studentId}/edit`} passHref>
                                                    <IconButton size="small" color="secondary">
                                                        <Edit />
                                                    </IconButton>
                                                </Link>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDeleteClick(student)}
                                                    disabled={isDeleting === student.studentId}
                                                >
                                                    {isDeleting === student.studentId ? (
                                                        <Skeleton variant="circular" width={24} height={24} />
                                                    ) : (
                                                        <Delete />
                                                    )}
                                                </IconButton>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Pagination */}
                <TablePagination
                    component="div"
                    count={students.length * totalPages}
                    page={page - 1}
                    onPageChange={(_, newPage) => handlePageChange(newPage + 1)}
                    rowsPerPage={10}
                    onRowsPerPageChange={() => { }}
                    rowsPerPageOptions={[10]}
                />
            </Paper>
        </Container>
    );
}