'use client';

import { useEffect } from "react";
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
    Pagination,
} from "@mui/material";
import { Person, Email, Phone, Work } from "@mui/icons-material";

import { useStaffViewModel } from "@/lib/features/staff/useStaffViewModel";

/* =====================================================
   TEACHERS TAB
===================================================== */
export default function TeachersTab({
    courseId,
}: {
    courseId: number;
}) {
    const {
        staff,
        isLoading,
        error,
        page,
        totalPages,
        handlePositionChange,
        handlePageChange,
    } = useStaffViewModel();

    useEffect(() => {
        handlePositionChange("Teacher");
    }, [handlePositionChange]);

    /* -----------------------------------------------------
       Filter only teachers
    ----------------------------------------------------- */
    useEffect(() => {
        handlePositionChange("Teacher");
    }, [handlePositionChange]);

    /* -----------------------------------------------------
       UI STATES
    ----------------------------------------------------- */
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

    if (!staff.length) {
        return (
            <Typography color="text.secondary" sx={{ mt: 2 }}>
                No teachers found.
            </Typography>
        );
    }

    /* -----------------------------------------------------
       RENDER
    ----------------------------------------------------- */
    return (
        <Grid container spacing={3}>
            {/* =====================================================
         LEFT : TEACHER LIST
      ====================================================== */}
            <Grid size={{ xs: 12, md: 8 }}>
                <Stack spacing={2}>
                    {staff.map((teacher) => (
                        <Paper key={teacher.staffId} sx={{ p: 3 }}>
                            <Box display="flex" gap={2} alignItems="center">
                                <Avatar sx={{ bgcolor: "primary.main" }}>
                                    <Person />
                                </Avatar>

                                <Box flex={1}>
                                    <Typography variant="h6">
                                        {teacher.firstName} {teacher.lastName}
                                    </Typography>

                                    <Stack direction="row" spacing={1} mt={0.5}>
                                        <Chip
                                            label={teacher.position}
                                            size="small"
                                            color="primary"
                                        />
                                        <Chip
                                            label={teacher.isActive ? "Active" : "Inactive"}
                                            size="small"
                                            color={teacher.isActive ? "success" : "default"}
                                        />
                                    </Stack>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <InfoRow
                                        icon={<Email fontSize="small" />}
                                        label="Email"
                                        value={teacher.email}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <InfoRow
                                        icon={<Phone fontSize="small" />}
                                        label="Mobile"
                                        value={teacher.mobileNumber}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <InfoRow
                                        icon={<Work fontSize="small" />}
                                        label="Department"
                                        value={teacher.department}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    ))}
                </Stack>

                {/* PAGINATION */}
                {totalPages > 1 && (
                    <Box display="flex" justifyContent="center" mt={3}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={(_, value) => handlePageChange(value)}
                            color="primary"
                        />
                    </Box>
                )}
            </Grid>

            {/* =====================================================
         RIGHT : SUMMARY PANEL
      ====================================================== */}
            <Grid size={{ xs: 12, md: 4 }}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6">Teachers Summary</Typography>
                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle2">Total Teachers</Typography>
                    <Typography>{staff.length}</Typography>

                    <Typography variant="subtitle2" sx={{ mt: 1 }}>
                        Active Teachers
                    </Typography>
                    <Typography>
                        {staff.filter((t) => t.isActive).length}
                    </Typography>
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
