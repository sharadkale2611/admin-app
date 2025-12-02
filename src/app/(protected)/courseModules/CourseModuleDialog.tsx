// ------------------------------------------------------------
// CourseModuleDialog with dropdowns
// ------------------------------------------------------------
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
    TextField
} from "@mui/material";
import { CourseModuleDto, CourseModuleResponseDto } from "@/lib/features/courseModules/courseModuleTypes";
import React, { useState, useEffect } from "react";
import { Course } from "@/lib/features/course/courseTypes";
import { ModuleResponseDto } from "@/lib/features/module/moduleTypes";

interface CMDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: CourseModuleDto) => void;
    editing?: CourseModuleResponseDto | null;
    loading?: boolean;
    coursesDropdown: Course[];
    modulesDropdown: ModuleResponseDto[];
}

export const CourseModuleDialog: React.FC<CMDialogProps> = ({
    open,
    onClose,
    onSubmit,
    editing,
    loading = false,
    coursesDropdown,
    modulesDropdown
}) => {
    const [formData, setFormData] = useState<CourseModuleDto>({
        courseId: editing?.courseId ?? 0,
        moduleId: editing?.moduleId ?? 0,
        moduleOrder: editing?.moduleOrder ?? 1,
        isActive: editing?.isActive ?? true
    });

    useEffect(() => {
        console.log("CourseModuleDialog - coursesDropdown:", coursesDropdown);
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
                                {coursesDropdown.map(c => (
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
                                {modulesDropdown.map(m => (
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
