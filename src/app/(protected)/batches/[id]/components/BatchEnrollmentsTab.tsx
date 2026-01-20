'use client';

import React, { useEffect, useState } from 'react';
import {
    Paper,
    Typography,
    Divider,
    Box,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    CircularProgress,
    Alert,
    Button,
    Snackbar,
} from '@mui/material';

import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useStudentBatchAssignmentsByBatch } from '@/lib/features/student/useStudentBatchAssignmentsByBatch';
import { createSBA } from '@/lib/features/studentBatchAssignment/studentBatchAssignmentThunks';

export default function BatchEnrollmentsTab() {
    const dispatch = useAppDispatch();
    const { currentBatch } = useAppSelector(state => state.batches);

    const {
        assignments,
        isLoading,
        error,
        refetch
    } = useStudentBatchAssignmentsByBatch(currentBatch?.batchId);

    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error';
    }>({
        open: false,
        message: '',
        severity: 'success',
    });

    useEffect(() => {
        console.log('Assignments:', assignments);
    }, [assignments]);

    if (!currentBatch) return null;

    // ✅ Split data
    const assignedStudents = assignments.filter(
        a => a.studentBatchAssignmentId !== null
    );

    const availableStudents = assignments.filter(
        a => a.studentBatchAssignmentId === null
    );

    const todayIsoDate = () =>
        new Date().toISOString().split('T')[0];

    const handleAssign = async (item: any) => {
        try {
            await dispatch(
                createSBA({
                    studentEnrollmentId: item.studentEnrollmentId,
                    batchId: currentBatch.batchId,
                    assignmentDate: todayIsoDate(),
                    assignmentType: 'fresh',
                    remark: null,
                    isActive: true,
                })
            ).unwrap();

            setSnackbar({
                open: true,
                message: 'Student assigned successfully',
                severity: 'success',
            });

            refetch();
        } catch (err: any) {
            setSnackbar({
                open: true,
                message: err?.error || 'Failed to assign student',
                severity: 'error',
            });
        }
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6">
                Enrolled Students
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Loading */}
            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={28} />
                </Box>
            )}

            {/* Error */}
            {error && (
                <Alert severity="error">
                    {error.error || 'Failed to load batch students'}
                </Alert>
            )}

            {/* Assigned Students */}
            {!isLoading && !error && assignedStudents.length === 0 && (
                <Typography color="text.secondary">
                    No students enrolled in this batch.
                </Typography>
            )}

            {!isLoading && !error && assignedStudents.length > 0 && (
                <List disablePadding>
                    {assignedStudents.map((item) => {
                        const imageUrl = item.profileImagePath
                            ? item.profileImagePath.startsWith('http')
                                ? item.profileImagePath
                                : `${process.env.NEXT_PUBLIC_API_BASE_URL}${item.profileImagePath}`
                            : null;

                        return (
                            <ListItem
                                key={item.studentBatchAssignmentId!}
                                divider
                            >
                                <ListItemAvatar>
                                    <Avatar src={imageUrl || undefined}>
                                        {!imageUrl && <PersonIcon />}
                                    </Avatar>
                                </ListItemAvatar>

                                <ListItemText
                                    primary={item.studentName}
                                    secondary={`Assigned on ${new Date(
                                        item.assignmentDate!
                                    ).toLocaleDateString()}`}
                                />
                            </ListItem>
                        );
                    })}
                </List>
            )}

            {/* Available Students */}
            {!isLoading && !error && availableStudents.length > 0 && (
                <>
                    <Divider sx={{ my: 3 }} />

                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Available Students
                    </Typography>

                    <List disablePadding>
                        {availableStudents.map((item) => {
                            const imageUrl = item.profileImagePath
                                ? item.profileImagePath.startsWith('http')
                                    ? item.profileImagePath
                                    : `${process.env.NEXT_PUBLIC_API_BASE_URL}${item.profileImagePath}`
                                : null;

                            return (
                                <ListItem
                                    key={item.studentEnrollmentId}
                                    divider
                                    secondaryAction={
                                        <Button
                                            size="small"
                                            variant="contained"
                                            startIcon={<AddIcon />}
                                            onClick={() => handleAssign(item)}
                                        >
                                            Assign
                                        </Button>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar src={imageUrl || undefined}>
                                            {!imageUrl && <PersonIcon />}
                                        </Avatar>
                                    </ListItemAvatar>

                                    <ListItemText
                                        primary={item.studentName}
                                        secondary="Not assigned to this batch"
                                    />
                                </ListItem>
                            );
                        })}
                    </List>
                </>
            )}

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Paper>
    );
}
