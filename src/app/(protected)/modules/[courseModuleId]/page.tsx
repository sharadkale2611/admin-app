'use client';

import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Button,
    Stack,
    Card,
    CardContent,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    Chip
} from "@mui/material";

import { ArrowBack, Add, Apps, Edit, Delete } from "@mui/icons-material";
import Link from "next/link";
import { useParams } from "next/navigation";
import Swal from "sweetalert2";

import { useCourseModuleContentViewModel } from "@/lib/features/courseModuleContent/useCourseModuleContentViewModel";
import { useCourseModuleViewModel } from "@/lib/features/courseModules/useCourseModuleViewModel";


/* ============================================================
   CONTENT DIALOG
============================================================ */

const ContentDialog = ({ open, onClose, onSubmit, editing }: any) => {

    const [form, setForm] = useState({
        contentName: "",
        contentDescription: "",
        durationInHrs: "",
        contentOrder: "",
    });

    useEffect(() => {
        if (!open) return;

        if (editing) {
            setForm({
                contentName: editing.contentName ?? "",
                contentDescription: editing.contentDescription ?? "",
                durationInHrs: String(editing.durationInHrs ?? ""),
                contentOrder: String(editing.contentOrder ?? ""),
            });
        } else {
            setForm({
                contentName: "",
                contentDescription: "",
                durationInHrs: "",
                contentOrder: "",
            });
        }
    }, [editing, open]);

    const handleChange = (field: string) => (e: any) => {
        setForm(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleSave = () => {
        onSubmit(form);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                {editing ? "Edit Course Content" : "Add Course Content"}
            </DialogTitle>

            <DialogContent>
                <Stack spacing={2} mt={1}>
                    <TextField label="Content Name" value={form.contentName} onChange={handleChange("contentName")} />
                    <TextField label="Description" value={form.contentDescription} onChange={handleChange("contentDescription")} />
                    <TextField label="Duration (hrs)" value={form.durationInHrs} onChange={handleChange("durationInHrs")} />
                    <TextField label="Order" value={form.contentOrder} onChange={handleChange("contentOrder")} />
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSave}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};


/* ============================================================
   MAIN PAGE
============================================================ */

const CourseContentPage = () => {

    const params = useParams();
    const courseModuleId = Number(params.courseModuleId);

    const { contents, createContent, updateContent, deleteContent, refetch } =
        useCourseModuleContentViewModel();

    const { courseModules } = useCourseModuleViewModel();

    const [openDialog, setOpenDialog] = useState(false);
    const [editingContent, setEditingContent] = useState<any>(null);

    const currentModule = courseModules?.find(
        (x: any) => Number(x.courseModuleId) === Number(courseModuleId)
    );

    const filteredContents =
        contents?.filter(
            (x: any) => Number(x.courseModuleId) === Number(courseModuleId)
        ) || [];

    useEffect(() => {
        refetch();
    }, [courseModuleId]);

    const handleAddContent = async (data: any) => {

        if (editingContent) {

            await updateContent({
                id: editingContent.courseModuleContentId,
                data: {
                    ...data,
                    courseModuleId,
                    durationInHrs: Number(data.durationInHrs),
                    contentOrder: Number(data.contentOrder),
                    status: "Active"
                }
            });

            Swal.fire("Updated", "Course Content Updated", "success");

        } else {

            await createContent({
                courseModuleId,
                contentName: data.contentName,
                contentDescription: data.contentDescription,
                durationInHrs: Number(data.durationInHrs),
                contentOrder: Number(data.contentOrder),
                status: "Active"
            });

            Swal.fire("Success", "Course Content Added Successfully", "success");
        }

        setOpenDialog(false);
        setEditingContent(null);

        setTimeout(() => {
            refetch();
        }, 0);
    };


    const handleDeleteContent = async (id: number) => {

        const res = await Swal.fire({
            title: "Delete Content?",
            icon: "warning",
            showCancelButton: true
        });

        if (!res.isConfirmed) return;

        await deleteContent(id);

        Swal.fire("Deleted", "Course Content Removed", "success");

        refetch();
    };

    return (
        <Box sx={{ p: 3 }}>

            {/* HEADER */}
            <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <IconButton component={Link} href="/modules">
                    <ArrowBack />
                </IconButton>

                <Typography variant="h4">
                    Course Contents
                </Typography>
            </Stack>

            {/* TOP MODULE CARD */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Apps color="primary" />
                        <Box>
                            <Typography variant="h6">
                                {currentModule?.moduleName || "Module"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {currentModule?.courseName || ""}
                            </Typography>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>

            <Grid container spacing={3}>

                {/* LEFT SIDE */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Stack spacing={2}>
                        {filteredContents.length ? (
                            filteredContents.map((c: any) => (
                                <Card key={c.courseModuleContentId}>
                                    <CardContent>

                                        {/* ⭐ TITLE + EDIT DELETE SAME LINE */}
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">

                                            <Typography fontWeight={600}>
                                                {c.contentName}
                                            </Typography>

                                            <Stack direction="row" spacing={1}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => {
                                                        setEditingContent(c);
                                                        setOpenDialog(true);
                                                    }}
                                                >
                                                    <Edit fontSize="small" />
                                                </IconButton>

                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDeleteContent(c.courseModuleContentId)}
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Stack>

                                        </Stack>

                                        <Typography variant="body2" color="text.secondary">
                                            {c.contentDescription || "—"}
                                        </Typography>

                                        <Stack direction="row" spacing={1} mt={1}>
                                            <Chip label={`${c.durationInHrs} hrs`} size="small" />
                                            <Chip label={c.status} color="success" size="small" />
                                        </Stack>

                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Typography>No content added yet</Typography>
                        )}
                    </Stack>
                </Grid>

                {/* RIGHT SIDE */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card>
                        <CardContent>

                            <Typography variant="h6" mb={2}>
                                Course Content Actions
                            </Typography>

                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<Add />}
                                onClick={() => {
                                    setEditingContent(null);
                                    setOpenDialog(true);
                                }}
                            >
                                Add Course Content
                            </Button>

                            <Typography mt={3}>
                                Total Contents : {filteredContents.length}
                            </Typography>

                        </CardContent>
                    </Card>
                </Grid>

            </Grid>

            <ContentDialog
                open={openDialog}
                onClose={() => {
                    setOpenDialog(false);
                    setEditingContent(null);
                }}
                onSubmit={handleAddContent}
                editing={editingContent}
            />

        </Box>
    );
};

export default CourseContentPage;
