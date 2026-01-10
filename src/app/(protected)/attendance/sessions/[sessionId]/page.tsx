//  src/app/(protected) / attendance / sessions / [sessionId] / page.tsx

import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
    Box,
    CircularProgress,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import AttendanceHeader from "./components/AttendanceHeader";
import AttendanceSummary from "./components/AttendanceSummary";
import AttendanceTable from "./components/AttendanceTable";
import { AttendanceFilterProvider } from "./_context/AttendanceFilterContext";

/**
 * Page Props
 */
interface AttendanceDetailsPageProps {
    params: {
        sessionId: string;
    };
}

/**
 * Attendance Details Page (Server Component)
 */
export default async function AttendanceDetailsPage({
    params,
}: AttendanceDetailsPageProps) {
    const sessionId = Number(params.sessionId);

    if (isNaN(sessionId)) {
        notFound();
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* ================= HEADER ================= */}
            <Suspense fallback={<HeaderSkeleton />}>
                <AttendanceHeader sessionId={sessionId} />
            </Suspense>

            <Divider sx={{ my: 2 }} />

            {/* ================= SUMMARY ================= */}
            <Suspense fallback={<SummarySkeleton />}>
                <AttendanceSummary sessionId={sessionId} />
            </Suspense>

            <Divider sx={{ my: 2 }} />

            {/* ================= TABLE ================= */}
            <Suspense fallback={<TableSkeleton />}>
                <AttendanceTable sessionId={sessionId} />
            </Suspense>
        </Box>
    );
}

/* =========================================================
   Skeletons (keep UX smooth)
   ========================================================= */

function HeaderSkeleton() {
    return (
        <Stack spacing={1}>
            <Typography variant="h6">Loading session...</Typography>
            <CircularProgress size={24} />
        </Stack>
    );
}

function SummarySkeleton() {
    return (
        <Stack direction="row" spacing={2}>
            {[1, 2, 3, 4, 5].map((i) => (
                <Box
                    key={i}
                    sx={{
                        width: 120,
                        height: 60,
                        bgcolor: "grey.100",
                        borderRadius: 1,
                    }}
                />
            ))}
        </Stack>
    );
}

function TableSkeleton() {
    return (
        <AttendanceFilterProvider>

        <Box
            sx={{
                height: 400,
                bgcolor: "grey.100",
                borderRadius: 1,
            }}
        />
        </AttendanceFilterProvider>
    );
}
