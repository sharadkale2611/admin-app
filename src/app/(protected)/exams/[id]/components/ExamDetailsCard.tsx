import {
    Paper,
    Typography,
    Box,
    Chip,
    Button,
    Divider,
    Grid,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";
import { formatDateTime } from "@/lib/utils/dateUtils";

type Props = {
    exam: any;
    courseName: string;
    moduleName: string;
};

export function ExamDetailsCard({ exam, courseName, moduleName }: Props) {
    return (
        <Paper sx={{ p: 3 }}>
            {/* ===== Header ===== */}
            <Box display="flex" alignItems="flex-start" gap={2}>
                {/* Title + Subtitle */}
                <Box flexGrow={1} minWidth={0}>
                    <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{ wordBreak: "break-word" }}
                    >
                        {exam.examName}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        {courseName} • {moduleName}
                    </Typography>
                </Box>

                {/* Edit Action */}
                <Button
                    size="small"
                    variant="outlined"
                    startIcon={<EditIcon fontSize="small" />}
                    component={Link}
                    href={`/exams/${exam.examId}/edit`}
                    sx={{ whiteSpace: "nowrap", mt: 0.5 }}
                >
                    Edit
                </Button>
            </Box>

            {/* Status row (decoupled from title) */}
            <Box display="flex" justifyContent="flex-end" mt={1}>
                <Chip
                    size="small"
                    label={exam.isActive ? "Active" : "Inactive"}
                    color={exam.isActive ? "success" : "default"}
                    variant={exam.isActive ? "filled" : "outlined"}
                />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* ===== Details Grid ===== */}
            <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                        Duration
                    </Typography>
                    <Typography fontWeight={500}>
                        {exam.examDurationHrs} hrs
                    </Typography>
                </Grid>

                <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                        Exam Date/Time
                    </Typography>
                    <Typography fontWeight={500}>
                        {formatDateTime(exam.examDateTime, "—")}
                    </Typography>
                </Grid>

                <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                        Total Marks
                    </Typography>
                    <Typography fontWeight={500}>
                        {exam.examTotalMarks}
                    </Typography>
                </Grid>

                <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                        Passing Marks
                    </Typography>
                    <Typography fontWeight={500}>
                        {exam.examPassingMarks}
                    </Typography>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Typography variant="caption" color="text.secondary">
                        Description
                    </Typography>
                    <Typography>
                        {exam.examDescription || "—"}
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    );
}
