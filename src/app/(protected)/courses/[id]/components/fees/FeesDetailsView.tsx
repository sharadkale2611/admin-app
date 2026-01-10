'use client';

import {
    Box,
    Divider,
    Grid,
    Paper,
    Typography,
} from '@mui/material';

interface FeesDetailsViewProps {
    feeAmount: number;
    gstPercentage: number;
    totalInstallments: number;
    createdAt?: string | null;
    updatedAt?: string | null;
}

export default function FeesDetailsView({
    feeAmount,
    gstPercentage,
    totalInstallments,
    createdAt,
    updatedAt,
}: FeesDetailsViewProps) {
    const gstAmount = (feeAmount * gstPercentage) / 100;
    const totalFee = feeAmount + gstAmount;

    const formatDate = (date?: string | null) =>
        date
            ? new Date(date).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            })
            : 'N/A';

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Course Fees</Typography>
            <Divider sx={{ my: 2 }} />

            <Grid container spacing={3}>
                {/* Fee Amount */}
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography color="text.secondary">Base Fee</Typography>
                    <Typography variant="h6">₹ {feeAmount}</Typography>
                </Grid>

                {/* GST */}
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography color="text.secondary">GST</Typography>
                    <Typography variant="h6">{gstPercentage}%</Typography>
                </Grid>

                {/* Installments */}
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography color="text.secondary">Installments</Typography>
                    <Typography variant="h6">{totalInstallments}</Typography>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Divider />
                </Grid>

                {/* GST Amount */}
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography color="text.secondary">GST Amount</Typography>
                    <Typography>₹ {gstAmount}</Typography>
                </Grid>

                {/* Total Fee */}
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography fontWeight={600}>Total Fee</Typography>
                    <Typography fontWeight={600} color="primary">
                        ₹ {totalFee}
                    </Typography>
                </Grid>
            </Grid>

            {/* {(createdAt || updatedAt) && (
                <>
                    <Divider sx={{ my: 3 }} />
                    <Box>
                        <Typography variant="caption" color="text.secondary">
                            Created: {formatDate(createdAt)}
                        </Typography>
                        <br />
                        <Typography variant="caption" color="text.secondary">
                            Updated: {formatDate(updatedAt)}
                        </Typography>
                    </Box>
                </>
            )} */}
        </Paper>
    );
}
