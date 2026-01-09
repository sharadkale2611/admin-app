import { Button, Divider, Grid, Paper, Stack, TextField, Typography } from "@mui/material";
import React from "react";

type FeeFormProps = {
    formData: any;
    totalFee: number;
    onNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isSubmitting?: boolean;
    onCancel?: () => void;
    onSubmit: (e: React.FormEvent) => void;
};

export const FeeForm = React.memo(function FeeForm({
    formData,
    totalFee,
    onNumberChange,
    isSubmitting = false,
    onCancel,
    onSubmit,
}: FeeFormProps) {
    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Fee Structure</Typography>
            <Divider sx={{ my: 2 }} />

            <form onSubmit={onSubmit}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Fee Amount (₹)"
                            size="small"
                            type="number"
                            name="feeAmount"
                            value={formData?.feeAmount ?? ""}
                            onChange={onNumberChange}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="GST Percentage (%)"
                            size="small"
                            type="number"
                            name="gstPercentage"
                            value={formData?.gstPercentage ?? ""}
                            onChange={onNumberChange}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Total Installments"
                            size="small"
                            type="number"
                            name="totalInstallments"
                            value={formData?.totalInstallments ?? ""}
                            onChange={onNumberChange}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Typography fontWeight="bold">
                            Total Fee: ₹ {totalFee}
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Stack direction="row" spacing={2}>
                            {onCancel && (
                                <Button variant="outlined" onClick={onCancel}>
                                    Cancel
                                </Button>
                            )}
                            <Button type="submit" variant="contained" disabled={isSubmitting}>
                                Save Fees
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
});
