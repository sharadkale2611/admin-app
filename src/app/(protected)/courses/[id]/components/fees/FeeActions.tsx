import { Button, Divider, Paper, Stack, Typography } from "@mui/material";

type FeeActionsProps = {
    feesExist: boolean;
    onAddEdit: () => void;
    createdAt?: string;
    updatedAt?: string;
    isEditingFees?: boolean;
};

export function FeeActions({
    feesExist,
    onAddEdit,
    createdAt,
    updatedAt,
    isEditingFees = false,
}: FeeActionsProps) {
    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Fee Actions</Typography>

            {!isEditingFees && (
                <Stack spacing={2} sx={{ my: 3 }}>
                    <Button variant="contained" onClick={onAddEdit}>
                        {feesExist ? "Edit Fees" : "Add Fees"}
                    </Button>
                </Stack>
            )}

            <Divider />

            <Typography variant="subtitle2" sx={{ mt: 2 }}>
                System Info
            </Typography>

            <Typography variant="body2">
                Created: {createdAt || "—"}
            </Typography>

            <Typography variant="body2">
                Updated: {updatedAt || "—"}
            </Typography>
        </Paper>
    );
}
