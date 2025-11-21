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

// DTO
interface ClassRoomDto {
    classRoomId?: number | null;
    classRoomName: string;
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

// FORM COMPONENT
const ClassRoomForm = ({
    open,
    onClose,
    onSubmit,
    editingData,
    firms,
    loading = false
}: {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: ClassRoomDto) => void;
    editingData?: ClassRoomDto | null;
    firms: FirmDto[];
    loading?: boolean;
}) => {

    const [formData, setFormData] = useState<ClassRoomDto>({
        classRoomId: editingData?.classRoomId || null,
        classRoomName: editingData?.classRoomName || "",
        firmId: editingData?.firmId || null,
        status: editingData?.status ?? true,
    });

    useEffect(() => {
        if (open) {
            setFormData({
                classRoomId: editingData?.classRoomId || null,
                classRoomName: editingData?.classRoomName || "",
                firmId: editingData?.firmId || null,
                status: editingData?.status ?? true,
            });
        }
    }, [open, editingData]);

    const handleChange =
        (field: keyof ClassRoomDto) =>
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
                {editingData ? "Edit Classroom" : "Add New Classroom"}
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Stack spacing={3}>

                        {formData.classRoomId !== null && (
                            <TextField
                                label="ClassRoom ID"
                                value={formData.classRoomId}
                                fullWidth
                                disabled
                            />
                        )}

                        <TextField
                            label="Classroom Name"
                            value={formData.classRoomName}
                            onChange={handleChange("classRoomName")}
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
                        disabled={loading || !formData.classRoomName.trim()}
                    >
                        {loading ? "Saving..." : editingData ? "Update" : "Create"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

// PAGE COMPONENT
export default function AddClassRoomPage() {

    const [open, setOpen] = useState(true);

    const firms: FirmDto[] = [
        { firmId: 1, firmName: "Firm A" },
        { firmId: 2, firmName: "Firm B" }
    ];

    const handleSubmit = (data: ClassRoomDto) => {
        console.log("Form submitted:", data);
        setOpen(false);
    };

    return (
        <div>
            <h2>Add Classroom</h2>

            <ClassRoomForm
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={handleSubmit}
                firms={firms}
            />
        </div>
    );
}
