"use client";

import React, { useState, useEffect } from "react";
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
    FormControlLabel,
    Switch,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField
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

import { CourseModuleDto, CourseModuleResponseDto } from "@/lib/features/courseModules/courseModuleTypes";
import { useCourseModuleViewModel } from "@/lib/features/courseModules/useCourseModuleViewModel";
import { Course } from "@/lib/features/course/courseTypes";
import { ModuleResponseDto } from "@/lib/features/module/moduleTypes";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { fetchCoursesListOptions } from "@/lib/features/course/courseThunks";
import { fetchModules } from "@/lib/features/module/moduleThunks";

// ------------------------------------------------------------
// Dialog for Create / Edit with dropdowns
// ------------------------------------------------------------
interface CMDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: CourseModuleDto) => void;
    editing?: CourseModuleResponseDto | null;
    loading?: boolean;
    coursesDropdown: Course[];
    modulesDropdown: ModuleResponseDto[];
}

const CourseModuleDialog: React.FC<CMDialogProps> = ({
    open,
    onClose,
    onSubmit,
    editing,
    loading = false,
}) => {
    const [formData, setFormData] = useState<CourseModuleDto>({
        courseId: editing?.courseId ?? 0,
        moduleId: editing?.moduleId ?? 0,
        moduleOrder: editing?.moduleOrder ?? 1,
        isActive: editing?.isActive ?? true
    });

const dispatch = useDispatch<AppDispatch>();

// const coursesDropdown = useSelector((state: RootState) => state.courses.courses);

const coursesDropdown = useSelector((state: RootState) => {
    const courses = state.courses.courses;
    console.log('hiii', courses);
    
    console.log("coursesDropdown from Redux:", courses);
    return courses;
});


const modulesDropdown = useSelector((state: RootState) => state.modules.modules);


useEffect(() => {
    dispatch(fetchCoursesListOptions()); // fetch courses
    dispatch(fetchModules()); // if you have a modules thunk
}, [dispatch]);



    useEffect(() => {
        if (open) {
            setFormData({
                courseId: editing?.courseId ?? (coursesDropdown[0]?.courseId ?? 0),
                moduleId: editing?.moduleId ?? (modulesDropdown[0]?.moduleId ?? 0),
                moduleOrder: editing?.moduleOrder ?? 1,
                isActive: editing?.isActive ?? true
            });
        }
    }, [open, editing, coursesDropdown, modulesDropdown]);

    const handleChange = (field: keyof CourseModuleDto) => (e: any) => {
        const value = field === "isActive" ? e.target.checked : Number(e.target.value);
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{editing ? "Edit Course Module" : "Add Course Module"}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <FormControl fullWidth required>
                            <InputLabel>Course</InputLabel>
                            <Select
                                value={formData.courseId}
                                onChange={handleChange("courseId")}
                                label="Course"
                            >
                                {coursesDropdown.map((c: Course) => (
                                    <MenuItem key={c.courseId} value={c.courseId}>
                                        {c.courseName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth required>
                            <InputLabel>Module</InputLabel>
                            <Select
                                value={formData.moduleId}
                                onChange={handleChange("moduleId")}
                                label="Module"
                            >
                                {modulesDropdown.map((m: ModuleResponseDto) => (
                                    <MenuItem key={m.moduleId} value={m.moduleId}>
                                        {m.moduleName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            label="Module Order"
                            type="number"
                            value={formData.moduleOrder}
                            onChange={handleChange("moduleOrder")}
                            required
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
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? "Saving..." : editing ? "Update" : "Create"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

// ------------------------------------------------------------
// Main Page
// ------------------------------------------------------------
const CourseModulePage = () => {
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
    const {
        courseModules,
        isLoading,
        error,
        createCourseModule,
        updateCourseModule,
        deleteCourseModule,
        refetch
    } = useCourseModuleViewModel();

    // TODO: replace with your own courses/modules hooks
    const [coursesDropdown, setCoursesDropdown] = useState<Course[]>([]);
    const [modulesDropdown, setModulesDropdown] = useState<ModuleResponseDto[]>([]);

    useEffect(() => {
        // Fetch courses and modules here
        // Example: setCoursesDropdown(fetchedCourses);
        // Example: setModulesDropdown(fetchedModules);
    }, []);

    const [expandedRows, setExpandedRows] = useState<number[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingRow, setEditingRow] = useState<CourseModuleResponseDto | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const toggleExpand = (id: number) => {
        setExpandedRows(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const openDialog = (row?: CourseModuleResponseDto) => {
        setEditingRow(row || null);
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setEditingRow(null);
    };

    const handleSubmit = async (data: CourseModuleDto) => {
        setSubmitting(true);
        try {
            if (editingRow) {
                await updateCourseModule({ id: editingRow.courseModuleId, data });
            } else {
                await createCourseModule(data);
            }
            closeDialog();
            refetch();
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: "Delete this entry?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true
        });
        if (result.isConfirmed) {
            await deleteCourseModule(id);
            refetch();
            Swal.fire("Deleted!", "Course module removed.", "success");
        }
    };

    if (isLoading) return <Box sx={{ p: 3 }}>Loading...</Box>;
    if (error) return <Box sx={{ p: 3 }}>Error: {error}</Box>;

    return (
        <Box sx={{ p: isMobile ? 1 : 3 }}>
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <IconButton component={Link} href="/dashboard">
                        <ArrowBack />
                    </IconButton>
                    <Typography variant={isMobile ? "h5" : "h4"}>
                        Course Modules
                    </Typography>
                </Stack>

                <Button variant="contained" startIcon={<Add />} onClick={() => openDialog()}>
                    Add Course Module
                </Button>
            </Stack>

            <Typography sx={{ mb: 2 }} color="text.secondary">
                {courseModules.length} record(s)
            </Typography>

            <Stack spacing={2}>
                {courseModules.map((cm: CourseModuleResponseDto) => (
                    <Card key={cm.courseModuleId} elevation={2}>
                        <Box
                            sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                            onClick={() => toggleExpand(cm.courseModuleId)}
                        >
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar sx={{ bgcolor: "primary.main" }}><Apps /></Avatar>
                                <Box>
                                    <Typography variant="h6">{cm.courseName} — {cm.moduleName}</Typography>
                                    <Chip label={cm.isActive ? "Active" : "Inactive"} color={cm.isActive ? "success" : "error"} size="small" sx={{ mt: 0.5 }} />
                                </Box>
                            </Stack>
                            <IconButton>
                                {expandedRows.includes(cm.courseModuleId) ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                            </IconButton>
                        </Box>

                        <Collapse in={expandedRows.includes(cm.courseModuleId)}>
                            <CardContent sx={{ py: 1 }}>
                                <Typography variant="caption">Module Order</Typography>
                                <Typography sx={{ mb: 2 }}>{cm.moduleOrder}</Typography>
                                <Typography variant="caption">Created At: {new Date(cm.createdAt).toLocaleString()}</Typography>
                                <Typography variant="caption" sx={{ display: "block" }}>Updated At: {cm.updatedAt ? new Date(cm.updatedAt).toLocaleString() : "—"}</Typography>

                                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                                    <Button variant="outlined" size="small" startIcon={<Edit />} onClick={() => openDialog(cm)}>Edit</Button>
                                    <Button variant="outlined" size="small" color="error" startIcon={<Delete />} onClick={() => handleDelete(cm.courseModuleId)}>Delete</Button>
                                </Stack>
                            </CardContent>
                        </Collapse>
                    </Card>
                ))}
            </Stack>

            <CourseModuleDialog
                open={dialogOpen}
                onClose={closeDialog}
                onSubmit={handleSubmit}
                editing={editingRow}
                loading={submitting}
                coursesDropdown={coursesDropdown}
                modulesDropdown={modulesDropdown}
            />

        </Box>
    );
};

export default CourseModulePage;
