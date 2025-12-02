'use client';
import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Switch,
    Stack
} from "@mui/material";

// DTO (Updated)
interface BatchDto {
    batchId?: number | null;
    batchName: string;
    firmId: number | null;
    status: boolean;
    createdAt?: string | null;
    updatedAt?: string | null;
    isDeleted?: boolean;
}

interface FirmDto {
    firmId: number;
    firmName: string;
}

// FORM COMPONENT (Updated)
const BatchForm = ({
    open,
    onClose,
    onSubmit,
    editingData,
    firms,
    loading = false
}: {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: BatchDto) => void;
    editingData?: BatchDto | null;
    firms: FirmDto[];
    loading?: boolean;
}) => {

    const [formData, setFormData] = useState<BatchDto>({
        batchId: editingData?.batchId || null,
        batchName: editingData?.batchName || "",
        firmId: editingData?.firmId || null,
        status: editingData?.status ?? true,
    });

    useEffect(() => {
        if (open) {
            setFormData({
                batchId: editingData?.batchId || null,
                batchName: editingData?.batchName || "",
                firmId: editingData?.firmId || null,
                status: editingData?.status ?? true,
            });
        }
    }, [open, editingData]);

    const handleChange =
        (field: keyof BatchDto) =>
        (event: any) => {
            let value = event.target.value;

            if (field === "firmId") value = value === "" ? null : parseInt(value);
            if (field === "status") value = event.target.checked;

            setFormData((prev) => ({ ...prev, [field]: value }));
        };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {editingData ? "Edit Batch" : "Add New Batch"}
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Stack spacing={3}>

                        {formData.batchId !== null && (
                            <TextField
                                label="Batch ID"
                                value={formData.batchId}
                                fullWidth
                                disabled
                            />
                        )}

                        <TextField
                            label="Batch Name"
                            value={formData.batchName}
                            onChange={handleChange("batchName")}
                            required
                            fullWidth
                        />

                        <FormControl fullWidth>
                            <InputLabel>Firm</InputLabel>
                            <Select
                                label="Firm"
                                value={formData.firmId || ""}
                                onChange={handleChange("firmId")}
                            >
                                <MenuItem value="">None</MenuItem>
                                {firms.map((firm) => (
                                    <MenuItem key={firm.firmId} value={firm.firmId}>
                                        {firm.firmName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.status}
                                    onChange={handleChange("status")}
                                />
                            }
                            label="Active"
                        />
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading || !formData.batchName.trim()}
                    >
                        {loading ? "Saving..." : editingData ? "Update" : "Create"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

// PAGE COMPONENT (Updated)
export default function AddBatchPage() {

    const [open, setOpen] = useState(true);

    const firms: FirmDto[] = [
        { firmId: 1, firmName: "Firm A" },
        { firmId: 2, firmName: "Firm B" }
    ];

    const handleSubmit = (data: BatchDto) => {
        console.log("Form submitted:", data);
        setOpen(false);
    };

    return (
        <div>
            <h2>Add Batch</h2>

            <BatchForm
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={handleSubmit}
                firms={firms}
            />
        </div>
    );
}
