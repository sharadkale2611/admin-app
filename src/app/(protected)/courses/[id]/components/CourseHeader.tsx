import { Course } from "@/lib/features/course/courseTypes";
import { ArrowBack, Cancel, CheckCircle } from "@mui/icons-material";
import { Box, Button, Chip, Typography } from "@mui/material";
import Link from "next/link";

// components/CourseHeader.tsx
export function CourseHeader({ course }: { course: Course }) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Link href="/courses">
                    <Button startIcon={<ArrowBack />} variant="outlined" size="small">
                        Back
                    </Button>
                </Link>
                <Typography variant="h4">Course Details</Typography>
            </Box>

            <Chip
                label={course.status ? 'Active' : 'Inactive'}
                color={course.status ? 'success' : 'error'}
                icon={course.status ? <CheckCircle /> : <Cancel />}
            />
        </Box>
    );
}
