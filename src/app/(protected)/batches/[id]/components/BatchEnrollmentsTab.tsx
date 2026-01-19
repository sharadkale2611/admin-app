'use client';

import React from 'react';
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
    Alert
} from '@mui/material';

import PersonIcon from '@mui/icons-material/Person';

import { useAppSelector } from '@/lib/hooks';
import { useStudentBatchAssignmentsByBatch } from '@/lib/features/studentBatchAssignment/useStudentBatchAssignmentsByBatch';

export default function BatchEnrollmentsTab() {
    const { currentBatch } = useAppSelector(state => state.batches);

    const {
        assignments,
        isLoading,
        error,
        refetch
    } = useStudentBatchAssignmentsByBatch(currentBatch?.batchId);

    if (!currentBatch) return null;

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

            {/* Empty */}
            {!isLoading && !error && assignments.length === 0 && (
                <Typography color="text.secondary">
                    No students enrolled in this batch.
                </Typography>
            )}

            {/* Student List */}
            {!isLoading && !error && assignments.length > 0 && (
                <List disablePadding>
                    {assignments.map((item) => {
                        const imageUrl = item.profileImagePath
                            ? item.profileImagePath.startsWith('http')
                                ? item.profileImagePath
                                : `${process.env.NEXT_PUBLIC_API_BASE_URL}${item.profileImagePath}`
                            : null;

                        return (
                            <ListItem
                                key={item.studentBatchAssignmentId}
                                divider
                            >
                                <ListItemAvatar>
                                    <Avatar src={imageUrl || undefined}>
                                        {!imageUrl && <PersonIcon />}
                                    </Avatar>
                                </ListItemAvatar>

                                <ListItemText
                                    primary={item.studentName || 'Unnamed Student'}
                                    secondary={`Assigned on ${new Date(
                                        item.assignmentDate
                                    ).toLocaleDateString()}`}
                                />
                            </ListItem>
                        );
                    })}

                </List>
            )}
        </Paper>
    );
}
