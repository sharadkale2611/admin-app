'use client';

// src/app/(protected)/courses/[id]/components/ModulesTab.tsx
import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Divider,
    Grid,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import { useModuleViewModel } from "@/lib/features/module/useModuleViewModel";
import { useCourseModuleViewModel } from "@/lib/features/courseModules/useCourseModuleViewModel";

type ModuleItem = {
    id: number;
    name: string;
};

export function ModulesTab({ course }: { course: any }) {
    const courseId = course.courseId;

    const {
        modules: allModules,
        createModule,
        updateModule,
        refetch: refetchModules,
    } = useModuleViewModel();

    const {
        courseModules,
        createCourseModule,
        deleteCourseModule,
        refetch: refetchCourseModules,
    } = useCourseModuleViewModel();

    /* ---------------- STATE ---------------- */

    const [isEditingModules, setIsEditingModules] = useState(false);
    const [isAddingModule, setIsAddingModule] = useState(false);

    const [newModuleName, setNewModuleName] = useState("");

    const [editingModuleId, setEditingModuleId] = useState<number | null>(null);
    const [editingModuleName, setEditingModuleName] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const [selectedModuleIds, setSelectedModuleIds] = useState<number[]>([]);

    /* ---------------- DERIVED DATA ---------------- */

    const assignedModuleIds = useMemo(
        () =>
            courseModules
                ?.filter(
                    (x) => x.courseId === courseId && !x.isDeleted
                )
                ?.map((x) => x.moduleId) ?? [],
        [courseModules, courseId]
    );

    const assignedModules: ModuleItem[] = useMemo(() => {
        return courseModules
            .filter(x => x.courseId === courseId && !x.isDeleted)
            .map(cm => {
                const mod = allModules.find(m => m.moduleId === cm.moduleId);
                return mod
                    ? { id: mod.moduleId, name: mod.moduleName }
                    : null;
            })
            .filter(Boolean) as ModuleItem[];
    }, [courseModules, allModules, courseId]);


    const visibleModules: ModuleItem[] = isEditingModules
        ? allModules.map((m) => ({
            id: m.moduleId,
            name: m.moduleName,
        }))
        : assignedModules;

    /* ---------------- EFFECTS ---------------- */

    useEffect(() => {
        setSelectedModuleIds(assignedModuleIds);
    }, [assignedModuleIds]);

    /* ---------------- HANDLERS ---------------- */

    const toggleModule = (id: number) => {
        setSelectedModuleIds((prev) =>
            prev.includes(id)
                ? prev.filter((x) => x !== id)
                : [...prev, id]
        );
    };

    const handleSaveAssignments = async () => {
        setIsSaving(true);

        const toAdd = selectedModuleIds.filter(
            (id) => !assignedModuleIds.includes(id)
        );

        const toRemove = assignedModuleIds.filter(
            (id) => !selectedModuleIds.includes(id)
        );

        try {
            for (let i = 0; i < toAdd.length; i++) {
                await createCourseModule({
                    courseId,
                    moduleId: toAdd[i],
                    moduleOrder: i + 1,
                    isActive: true,
                });
            }

            for (const moduleId of toRemove) {
                const rec = courseModules.find(
                    (x) =>
                        x.courseId === courseId &&
                        x.moduleId === moduleId
                );

                if (rec) {
                    await deleteCourseModule(rec.courseModuleId);
                }
            }

            await refetchCourseModules();
            setIsEditingModules(false);
        } catch (err) {
            console.error("Failed to save module assignments", err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddModule = async () => {
        if (!newModuleName.trim()) return;

        setIsSaving(true);
        try {
            const res = await createModule({
                moduleName: newModuleName.trim(),
                moduleDescription: "",
                isActive: true,
            });

            await refetchModules();

            setSelectedModuleIds((prev) => [
                ...prev,
                res.module.moduleId,
            ]);

            setNewModuleName("");
            setIsAddingModule(false);
        } finally {
            setIsSaving(false);
        }
    };

    const startEditModule = (module: ModuleItem) => {
        setEditingModuleId(module.id);
        setEditingModuleName(module.name);
    };

    const saveEditModule = async () => {
        if (!editingModuleName.trim() || editingModuleId === null) return;

        setIsSaving(true);
        try {
            await updateModule({
                id: editingModuleId,
                data: {
                    moduleName: editingModuleName.trim(),
                    moduleDescription: "",
                    isActive: true,
                },
            });

            await refetchModules();
            setEditingModuleId(null);
            setEditingModuleName("");
        } finally {
            setIsSaving(false);
        }
    };

    /* ---------------- UI ---------------- */

    return (
        <Grid container spacing={3}>
            {/* LEFT */}
            <Grid size={{ xs: 12, md: 8 }}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6">Course Modules</Typography>
                    <Divider sx={{ my: 2 }} />

                    <Stack spacing={1}>
                        {visibleModules.map((module) => {
                            const isSelected = selectedModuleIds.includes(module.id);
                            const isEditingThis = editingModuleId === module.id;

                            return (
                                <Box
                                    key={module.id}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        px: 2,
                                        py: 1.2,
                                        border: "1px solid",
                                        borderColor: "divider",
                                        borderRadius: 1,
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        {isEditingModules && (
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => toggleModule(module.id)}
                                            />
                                        )}

                                        {isEditingThis ? (
                                            <TextField
                                                size="small"
                                                value={editingModuleName}
                                                onChange={(e) =>
                                                    setEditingModuleName(e.target.value)
                                                }
                                                autoFocus
                                            />
                                        ) : (
                                            <Typography>{module.name}</Typography>
                                        )}
                                    </Box>

                                    {!isEditingModules && !isEditingThis && (
                                        <Button size="small" onClick={() => startEditModule(module)}>
                                            Edit
                                        </Button>
                                    )}

                                    {isEditingThis && (
                                        <Stack direction="row" spacing={1}>
                                            <Button
                                                size="small"
                                                onClick={saveEditModule}
                                                disabled={isSaving}
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                size="small"
                                                color="secondary"
                                                onClick={() => setEditingModuleId(null)}
                                                disabled={isSaving}
                                            >
                                                Cancel
                                            </Button>
                                        </Stack>
                                    )}
                                </Box>
                            );
                        })}
                    </Stack>

                    {!visibleModules.length && (
                        <Alert severity="info" sx={{ mt: 2 }}>
                            No modules assigned to this course.
                        </Alert>
                    )}
                </Paper>
            </Grid>

            {/* RIGHT */}
            <Grid size={{ xs: 12, md: 4 }}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6">Module Actions</Typography>

                    <Stack spacing={2} sx={{ my: 3 }}>
                        {!isEditingModules && !isAddingModule && (
                            <>
                                <Button
                                    variant="contained"
                                    onClick={() => setIsEditingModules(true)}
                                >
                                    Edit Modules
                                </Button>

                                <Button
                                    variant="outlined"
                                    onClick={() => setIsAddingModule(true)}
                                >
                                    Add New Module
                                </Button>
                            </>
                        )}

                        {isEditingModules && (
                            <>
                                <Button
                                    variant="contained"
                                    onClick={handleSaveAssignments}
                                    disabled={isSaving}
                                >
                                    Save Changes
                                </Button>

                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => setIsEditingModules(false)}
                                >
                                    Cancel
                                </Button>
                            </>
                        )}

                        {isAddingModule && (
                            <>
                                <TextField
                                    size="small"
                                    label="Module Name"
                                    value={newModuleName}
                                    onChange={(e) => setNewModuleName(e.target.value)}
                                    autoFocus
                                />

                                <Button
                                    variant="contained"
                                    disabled={!newModuleName.trim()}
                                    onClick={handleAddModule}
                                >
                                    Save Module
                                </Button>

                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => setIsAddingModule(false)}
                                >
                                    Cancel
                                </Button>
                            </>
                        )}
                    </Stack>

                    <Divider />

                    <Typography variant="body2" sx={{ mt: 2 }}>
                        Total Assigned Modules: {selectedModuleIds.length}
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    );
}
