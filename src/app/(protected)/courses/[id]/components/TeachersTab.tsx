'use client';

import { useMemo } from "react";
import {
    Grid,
    Paper,
    Typography,
    Divider,
    Box,
    Chip,
    Avatar,
    Stack,
    CircularProgress,
} from "@mui/material";
import { Person, Work } from "@mui/icons-material";

import { useTrainersByCourseViewModel } from "@/lib/features/staff/useTrainersByCourseViewModel";

/* =====================================================
   TEACHERS TAB
===================================================== */
export default function TeachersTab({
    courseId,
}: {
    courseId: number;
}) {
    const { trainers, isLoading, error } = useTrainersByCourseViewModel(courseId ?? null);

    const uniqueTrainerCount = useMemo(
        () => new Set((trainers || []).map((t) => t.staffId)).size,
        [trainers]
    );

    const moduleCount = useMemo(
        () => new Set((trainers || []).map((t) => t.moduleId)).size,
        [trainers]
    );

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error" sx={{ mt: 2 }}>
                {error}
            </Typography>
        );
    }

    if (!trainers || !trainers.length) {
        return (
            <Typography color="text.secondary" sx={{ mt: 2 }}>
                No trainers found for this course.
            </Typography>
        );
    }

    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
                <Stack spacing={2}>
                    {trainers.map((trainer) => (
                        <Paper key={`${trainer.staffId}-${trainer.moduleId}`} sx={{ p: 3 }}>
                            <Box display="flex" gap={2} alignItems="center">
                                <Avatar sx={{ bgcolor: "primary.main" }}>
                                    <Person />
                                </Avatar>

                                <Box flex={1}>
                                    <Typography variant="h6">
                                        {trainer.trainerName}
                                    </Typography>

                                    <Stack direction="row" spacing={1} mt={0.5} flexWrap="wrap">
                                        <Chip label={trainer.moduleName} size="small" color="primary" />
                                        <Chip label={trainer.position} size="small" variant="outlined" />
                                    </Stack>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <InfoRow icon={<Work fontSize="small" />} label="Module" value={trainer.moduleName} />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <InfoRow label="Staff ID" value={trainer.staffId} />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <InfoRow label="Email" value={trainer.email} />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <InfoRow label="Mobile" value={trainer.mobileNumber} />
                                </Grid>
                            </Grid>
                        </Paper>
                    ))}
                </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6">Teachers Summary</Typography>
                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle2">Total Trainers</Typography>
                    <Typography>{uniqueTrainerCount}</Typography>

                    <Typography variant="subtitle2" sx={{ mt: 1 }}>Modules Covered</Typography>
                    <Typography>{moduleCount}</Typography>

                    <Typography variant="subtitle2" sx={{ mt: 1 }}>Trainer-Module Pairs</Typography>
                    <Typography>{trainers.length}</Typography>
                </Paper>
            </Grid>
        </Grid>
    );
}

/* =====================================================
   SMALL INFO ROW
===================================================== */
function InfoRow({
    label,
    value,
    icon,
}: {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
}) {
    return (
        <Box display="flex" alignItems="center" gap={1}>
            {icon}
            <Box>
                <Typography variant="subtitle2" color="text.secondary">
                    {label}
                </Typography>
                <Typography variant="body2">{value || "N/A"}</Typography>
            </Box>
        </Box>
    );
}
