'use client';
// app/(protected)/modules/page.tsx

import React, { useState } from "react";
import {
    Box,
    Typography,
    IconButton,
    Button,
    Chip,
    Stack,
    Card,
    CardContent,
    Collapse,
    useMediaQuery,
    Theme,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControlLabel,
    Switch
} from "@mui/material";

import {
    ArrowBack,
    Edit,
    Delete,
    KeyboardArrowDown,
    KeyboardArrowUp,
    Add,
    Apps
} from "@mui/icons-material";

import Link from "next/link";
import Swal from "sweetalert2";

import { useModuleViewModel } from "@/lib/features/module/useModuleViewModel";
import { useCourseModuleContentViewModel } from "@/lib/features/courseModuleContent/useCourseModuleContentViewModel";
import { useCourseModuleViewModel } from "@/lib/features/courseModules/useCourseModuleViewModel";

import { useAppDispatch } from "@/lib/hooks";
import { ModuleDto, ModuleResponseDto } from "@/lib/features/module/moduleTypes";


// ============================================================
// MODULE DIALOG (UNCHANGED)
// ============================================================

interface ModuleDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: ModuleDto) => void;
    editingModule?: ModuleResponseDto | null;
    loading?: boolean;
}

const ModuleDialog: React.FC<ModuleDialogProps> = ({
    open,
    onClose,
    onSubmit,
    editingModule,
    loading = false
}) => {

    const [formData, setFormData] = useState<ModuleDto>({
        moduleName: editingModule?.moduleName || "",
        moduleDescription: editingModule?.moduleDescription || "",
        isActive: editingModule?.isActive ?? true
    });

    React.useEffect(() => {
        if (open) {
            setFormData({
                moduleName: editingModule?.moduleName || "",
                moduleDescription: editingModule?.moduleDescription || "",
                isActive: editingModule?.isActive ?? true
            });
        }
    }, [open, editingModule]);

    const handleChange = (field: keyof ModuleDto) => (e: any) => {
        const value = field === "isActive" ? e.target.checked : e.target.value;
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                {editingModule ? "Edit Module" : "Add New Module"}
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            label="Module Name"
                            value={formData.moduleName}
                            onChange={handleChange("moduleName")}
                            required
                            fullWidth
                        />

                        <TextField
                            label="Description"
                            value={formData.moduleDescription}
                            onChange={handleChange("moduleDescription")}
                            multiline
                            rows={3}
                            fullWidth
                        />

                        <FormControlLabel
                            control={<Switch checked={formData.isActive} onChange={handleChange("isActive")} />}
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
                        disabled={loading || !formData.moduleName.trim()}
                    >
                        {loading ? "Saving..." : editingModule ? "Update" : "Create"}
                    </Button>

                </DialogActions>
            </form>
        </Dialog>
    );
};


// ============================================================
// CONTENT DIALOG (NEW)
// ============================================================

const ContentDialog = ({ open, onClose, onSubmit }: any) => {

    const [form, setForm] = useState({
        contentName: "",
        contentDescription: "",
        durationInHrs: "",
        contentOrder: 1
    });

    const handleChange = (field: string) => (e: any) => {
        setForm(prev => ({ ...prev, [field]: e.target.value }));
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Add Course Content</DialogTitle>

            <DialogContent>
                <Stack spacing={2} mt={1}>
                    <TextField label="Content Name" onChange={handleChange("contentName")} />
                    <TextField label="Description" onChange={handleChange("contentDescription")} />
                    <TextField label="Duration (hrs)" onChange={handleChange("durationInHrs")} />
                    <TextField label="Order" onChange={handleChange("contentOrder")} />
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={() => onSubmit(form)}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};


// ============================================================
// MAIN PAGE
// ============================================================

const ModuleList: React.FC = () => {

    const dispatch = useAppDispatch();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

    const { modules, isLoading, error, createModule, updateModule, deleteModule, refetch } = useModuleViewModel();
    const { createContent } = useCourseModuleContentViewModel();
    const { courseModules } = useCourseModuleViewModel();

    const [expandedRows, setExpandedRows] = useState<number[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingModule, setEditingModule] = useState<ModuleResponseDto | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const [contentDialogOpen, setContentDialogOpen] = useState(false);
    const [selectedCourseModuleId, setSelectedCourseModuleId] = useState<number | null>(null);

    const toggleExpand = (id: number) => {
        setExpandedRows(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleSubmitModule = async (data: ModuleDto) => {
        setSubmitting(true);
        try {
            if (editingModule) {
                await updateModule({ id: editingModule.moduleId, data });
            } else {
                await createModule(data);
            }
            setDialogOpen(false);
            refetch();
        } finally {
            setSubmitting(false);
        }
    };

    // ⭐ FINAL SAVE WORKING
    const handleAddContent = async (data: any) => {

        console.log("SAVE CLICKED", selectedCourseModuleId);

        if (!selectedCourseModuleId) return;

        await createContent({
            courseModuleId: selectedCourseModuleId,
            contentName: data.contentName,
            contentDescription: data.contentDescription,
            durationInHrs: Number(data.durationInHrs),
            contentOrder: Number(data.contentOrder),
            status: "Active"
        });

        setContentDialogOpen(false);
    };

    const onDeleteModule = async (id: number, name: string) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `Delete module "${name}"?`,
            icon: "warning",
            showCancelButton: true
        });

        if (result.isConfirmed) {
            await deleteModule(id);
            refetch();
        }
    };

    if (isLoading) return <Box sx={{ p: 3 }}>Loading modules...</Box>;
    if (error) return <Box sx={{ p: 3 }}>Error: {error}</Box>;

    return (
        <Box sx={{ p: isMobile ? 1 : 3 }}>

            {/* HEADER */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <IconButton component={Link} href="/dashboard">
                        <ArrowBack />
                    </IconButton>

                    <Typography variant={isMobile ? "h5" : "h4"}>
                        Modules
                    </Typography>
                </Stack>

                <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>
                    Add Module
                </Button>
            </Stack>

            <Stack spacing={2}>
                {modules.map(m => {

                    const cm = courseModules.find((x: any) => x.moduleId === m.moduleId);

                    return (
                        <Card key={m.moduleId}>
                            <Box
                                sx={{
                                    p: 2,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    cursor: "pointer"
                                }}
                                onClick={() => toggleExpand(m.moduleId)}
                            >
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar sx={{ bgcolor: "primary.main" }}>
                                        <Apps />
                                    </Avatar>

                                    <Box>
                                        <Typography variant="h6">{m.moduleName}</Typography>

                                        <Chip
                                            label={m.isActive ? "Active" : "Inactive"}
                                            color={m.isActive ? "success" : "error"}
                                            size="small"
                                        />
                                    </Box>
                                </Stack>

                                <IconButton>
                                    {expandedRows.includes(m.moduleId)
                                        ? <KeyboardArrowUp />
                                        : <KeyboardArrowDown />}
                                </IconButton>
                            </Box>

                            <Collapse in={expandedRows.includes(m.moduleId)}>
                                <CardContent>

                                    <Stack direction="row" spacing={1}>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<Edit />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingModule(m);
                                                setDialogOpen(true);
                                            }}
                                        >
                                            Edit
                                        </Button>

                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            startIcon={<Delete />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteModule(m.moduleId, m.moduleName);
                                            }}
                                        >
                                            Delete
                                        </Button>
<Button
   variant="outlined"
   size="small"
   startIcon={<Apps />}
   component={Link}
   href={`/modules/${cm?.courseModuleId}`}
   onClick={(e) => e.stopPropagation()}
>
   Course Content
</Button>

                                    </Stack>

                                </CardContent>
                            </Collapse>
                        </Card>
                    );
                })}
            </Stack>

            <ModuleDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSubmit={handleSubmitModule}
                editingModule={editingModule}
                loading={submitting}
            />

            <ContentDialog
                open={contentDialogOpen}
                onClose={() => setContentDialogOpen(false)}
                onSubmit={handleAddContent}
            />

        </Box>
    );
};

export default ModuleList;
