'use client';

import React, { useState } from "react";
import {
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
    Stack,
    Box
} from "@mui/material";

import {
    Search,
    Refresh,
    Visibility,
    Edit,
    Delete,
    FilterList
} from "@mui/icons-material";

import Link from "next/link";

import { useStudentViewModel } from "@/lib/features/student/useStudentViewModel";
import { Student, ApiError } from "@/lib/features/student/studentTypes";
import { useDeleteStudent } from "@/lib/features/student/useDeleteStudent";

/* ---------- ERROR RENDER ---------- */
function renderErrorContent(error: ApiError | null) {
    if (!error) return null;
    if (error.error) return <div>{error.error}</div>;
    if (Array.isArray(error.errors)) {
        return error.errors.map((e, i) => (
            <div key={i}>{typeof e === "string" ? e : JSON.stringify(e)}</div>
        ));
    }
    return null;
}

export default function StudentsTable() {
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
    const { handleDelete } = useDeleteStudent();
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleDeleteClick = async (student: Student) => {
        setIsDeleting(student.studentId);
        const success = await handleDelete(
            student.studentId,
            `${student.firstName} ${student.lastName}`
        );
        if (success) refetch();
        setIsDeleting(null);
    };

    return (
        <>
            {/* FILTERS */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                    <TextField
                        size="small"
                        placeholder="Search students..."
                        value={localSearchTerm}
                        onChange={(e) => setLocalSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            )
                        }}
                    />

                    <Button
                        variant="outlined"
                        onClick={() => handleSearch(localSearchTerm)}
                        startIcon={<Search />}
                    >
                        Search
                    </Button>

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={activeOnly}
                                onChange={handleToggleActive}
                            />
                        }
                        label="Active Only"
                    />

                    <Button
                        variant="outlined"
                        onClick={handleResetFilters}
                        startIcon={<FilterList />}
                    >
                        Reset
                    </Button>

                    <IconButton onClick={refetch}>
                        <Refresh />
                    </IconButton>
                </Stack>
            </Paper>

            {/* ERROR */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {renderErrorContent(error)}
                </Alert>
            )}

            {/* TABLE */}
            <Paper elevation={2}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Code</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Created</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        {Array.from({ length: 7 }).map((_, j) => (
                                            <TableCell key={j}>
                                                <Skeleton />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : students.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        No students found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                students.map((student) => (
                                    <TableRow key={student.studentId} hover>
                                        <TableCell>{student.studentCode}</TableCell>
                                        <TableCell>
                                            {student.firstName} {student.lastName}
                                        </TableCell>
                                        <TableCell>{student.email || "-"}</TableCell>
                                        <TableCell>{student.mobileNumber || "-"}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={student.isActive ? "Active" : "Inactive"}
                                                color={student.isActive ? "success" : "error"}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {new Date(student.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1}>
                                                <Link href={`/students/${student.studentId}`}>
                                                    <IconButton size="small">
                                                        <Visibility />
                                                    </IconButton>
                                                </Link>
                                                <Link href={`/students/${student.studentId}/edit`}>
                                                    <IconButton size="small">
                                                        <Edit />
                                                    </IconButton>
                                                </Link>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    disabled={isDeleting === student.studentId}
                                                    onClick={() => handleDeleteClick(student)}
                                                >
                                                    {isDeleting === student.studentId ? (
                                                        <Skeleton variant="circular" width={20} height={20} />
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

                <TablePagination
                    component="div"
                    count={students.length * totalPages}
                    page={page - 1}
                    onPageChange={(_, newPage) => handlePageChange(newPage + 1)}
                    rowsPerPage={10}
                    rowsPerPageOptions={[10]}
                />
            </Paper>
        </>
    );
}
