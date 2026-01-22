'use client';

import {
    Card,
    CardContent,
    Typography,
    Chip,
    Box,
    Stack,
    Button,
    CardActions
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import Link from "next/link";
import { Batch } from "@/lib/features/batch/batchTypes";
import { useRouter } from "next/navigation";

interface Props {
    batch: Batch;
    onDelete: (batch: Batch) => void;
    isDeleting: boolean;
}

export default function BatchCard({ batch, onDelete, isDeleting }: Props) {
    const router = useRouter();

    const handleViewDetails = () => {
        console.log("Navigating to batch details for:", batch.batchId);
        router.push(`/batches/${batch.batchId}`);
    }

    return (
        <Card
            elevation={3}
            onClick={handleViewDetails}
            sx={{
                height: "100%",
                borderRadius: 2,
                position: "relative",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                    boxShadow: 6,
                    transform: "translateY(-2px)"
                }
            }}
        >
            {/* Status */}
            <Chip
                label={batch.isActive ? "Active" : "Inactive"}
                color={batch.isActive ? "success" : "error"}
                size="small"
                sx={{ position: "absolute", right: 12, top: 12 }}
            />

            <CardContent>
                {/* Batch Code */}
                <Typography variant="caption" color="text.secondary">
                    #{batch.batchCode}
                </Typography>

                {/* Module Name */}
                <Typography variant="h6" fontWeight={700} sx={{ mt: 1 }}>
                    {batch.moduleName || "-"}
                </Typography>

                {/* Date Range */}
                <Typography variant="body2" sx={{ mt: 1 }}>
                    {batch.startDate && batch.endDate ? (
                        <>
                            {new Date(batch.startDate).toLocaleDateString()}{" "}
                            <strong>to</strong>{" "}
                            {new Date(batch.endDate).toLocaleDateString()}
                        </>
                    ) : (
                        <Typography
                            component="span"
                            variant="body2"
                            sx={{ color: "error.main", fontWeight: 500 }}
                        >
                            Batch Not Scheduled
                        </Typography>
                    )}
                </Typography>


                {/* Duration */}
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                    Batch Duration: {batch.batchDurationInHr ?? "-"} Hrs
                </Typography>

                {/* Trainer */}
                <Typography
                    variant="body2"
                    color="primary"
                    sx={{ mt: 1 }}
                >
                    Trainer Name: {batch.trainerName ?? "-"}
                </Typography>

                {/* Classroom */}
                <Typography variant="body2">
                    Classroom: {batch.classRoomName || "Online"}
                </Typography>
            </CardContent>

            {/* Actions */}
            <CardActions
                sx={{ px: 2, pb: 2 }}
                onClick={(e) => e.stopPropagation()} // 🚨 IMPORTANT
            >
                {/* <Button
                    fullWidth
                    size="small"
                    variant="outlined"
                    startIcon={<Edit />}
                    component={Link}
                    href={`/batches/${batch.batchId}/edit`}
                >
                    Edit
                </Button> */}

                <Button
                    fullWidth
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    disabled={isDeleting}
                    onClick={() => onDelete(batch)}
                >
                    Delete
                </Button>
            </CardActions>
        </Card>
    );
}
