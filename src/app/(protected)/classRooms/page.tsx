'use client';

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
    Switch,
    MenuItem,
    FormControl,
    InputLabel,
    Select
} from "@mui/material";
import {
    ArrowBack,
    Edit,
    Delete,
    KeyboardArrowDown,
    KeyboardArrowUp,
    Add,
    School
} from "@mui/icons-material";
import Link from "next/link";
import Swal from "sweetalert2";
import { useClassRoomViewModel } from "@/lib/features/classRoom/useClassRoomViewModel";
import { ClassRoomDto, ClassRoomResponseDto } from "@/lib/features/classRoom/classRoomTypes";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchFirms } from "@/lib/features/firm/firmThunks";

// ---- Dialog Component ----
interface ClassRoomDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: ClassRoomDto) => void;
    editingClassRoom?: ClassRoomResponseDto | null;
    loading?: boolean;
}

const ClassRoomDialog: React.FC<ClassRoomDialogProps> = ({
    open,
    onClose,
    onSubmit,
    editingClassRoom,
    loading = false
}) => {
    // const { firms } = useAppSelector((state) => state.firms);
    const firmId = useAppSelector((state) => state.auth.user?.firmId);

    const [formData, setFormData] = useState<ClassRoomDto>({
        classRoomName: editingClassRoom?.classRoomName || "",
        status: editingClassRoom?.status ?? true,
        firmId: editingClassRoom?.firmId ?? firmId ?? null
    });


    React.useEffect(() => {
        if (open) {
            setFormData({
                classRoomName: editingClassRoom?.classRoomName || "",
                status: editingClassRoom?.status ?? true,
                firmId: editingClassRoom?.firmId ?? firmId ?? null
            });
        }
    }, [open, editingClassRoom, firmId]);

    const handleChange = (field: keyof ClassRoomDto) => (e: any) => {
        let value = field === "status" 
            ? e.target.checked 
            : e.target.value;

        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

     const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {editingClassRoom ? "Edit Classroom" : "Add New Classroom"}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>

                        {/* Hidden field for firmId */}
                        <input type="hidden" value={formData.firmId ?? ''} />


                        <TextField
                            label="Classroom Name"
                            value={formData.classRoomName}
                            onChange={handleChange("classRoomName")}
                            required
                            fullWidth
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.status}
                                    onChange={handleChange("status") as any}
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
                        {loading ? "Saving..." : editingClassRoom ? "Update" : "Create"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

// ---- Main Page Component ----
const ClassRoomList: React.FC = () => {
    const dispatch = useAppDispatch();
    const { firms } = useAppSelector((state) => state.firms);
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

    React.useEffect(() => {
      dispatch(fetchFirms({}));
    }, [dispatch]);

    const {
        classRooms,
        isLoading,
        error,
        createClassRoom,
        updateClassRoom,
        handleDelete,
        refetch
    } = useClassRoomViewModel();

    const [expandedRows, setExpandedRows] = useState<number[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingClassRoom, setEditingClassRoom] = useState<ClassRoomResponseDto | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const toggleRowExpand = (id: number) => {
        setExpandedRows(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleOpenDialog = (classRoom?: ClassRoomResponseDto) => {
        setEditingClassRoom(classRoom || null);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingClassRoom(null);
    };

    const handleSubmitClassRoom = async (data: ClassRoomDto) => {
        setSubmitting(true);
        try {
            if (editingClassRoom) {
                await updateClassRoom({ id: editingClassRoom.classRoomId, data });
            } else {
                await createClassRoom(data);
            }
            handleCloseDialog();
            refetch();
            setExpandedRows([]);
        } catch (err) {
            console.error("Failed to save classroom:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const onDeleteClassRoom = async (id: number, name: string) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `You are about to delete the classroom "${name}". This action cannot be undone.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
            reverseButtons: true
        });

        if (result.isConfirmed) {
            const success = await handleDelete(id);
            if (success) {
                await Swal.fire({
                    title: "Deleted!",
                    text: `"${name}" has been deleted successfully.`,
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
                refetch();
            } else {
                await Swal.fire({
                    title: "Error!",
                    text: "Failed to delete the classroom. Please try again.",
                    icon: "error"
                });
            }
        }
    };

    if (isLoading) return <Box sx={{ p: 3 }}>Loading classrooms...</Box>;
    if (error) return <Box sx={{ p: 3, color: "error.main" }}>Error: {error}</Box>;

    return (
        <Box sx={{ p: isMobile ? 1 : 3 }}>
            {/* Header */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <IconButton
                        aria-label="back"
                        size={isMobile ? "small" : "medium"}
                        component={Link}
                        href="/dashboard"
                    >
                        <ArrowBack fontSize={isMobile ? "small" : "medium"} />
                    </IconButton>
                    <Typography variant={isMobile ? "h5" : "h4"} component="h1">
                        ClassRooms
                    </Typography>
                </Stack>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    size={isMobile ? "small" : "medium"}
                    onClick={() => handleOpenDialog()}
                >
                    Add Classroom
                </Button>
            </Stack>

            {/* Count */}
            <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
                {classRooms.length} classroom{classRooms.length !== 1 ? "s" : ""} found
            </Typography>

            {/* List */}
            {classRooms.length === 0 ? (
                <Box sx={{ p: 4, textAlign: "center", border: "1px dashed", borderColor: "divider", borderRadius: 2 }}>
                    <Typography variant="h6" color="text.secondary">
                        No classrooms found
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Create your first classroom to get started
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<Add />}
                        sx={{ mt: 2 }}
                        onClick={() => handleOpenDialog()}
                    >
                        Create Classroom
                    </Button>
                </Box>
            ) : (
                <Stack spacing={2}>
                    {classRooms.map(room => (
                        <Card key={room.classRoomId} elevation={2}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    p: 2,
                                    cursor: "pointer",
                                    "&:hover": { backgroundColor: "action.hover" }
                                }}
                                onClick={() => toggleRowExpand(room.classRoomId)}
                            >
                                <Stack direction="row" alignItems="center" spacing={2} sx={{ flex: 1 }}>
                                    <Avatar sx={{ bgcolor: "primary.main" }}>
                                        <School />
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="h6" component="div">
                                            {room.classRoomName}
                                        </Typography>
                                        <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                                            <Chip
                                                label={room.status ? "Active" : "Inactive"}
                                                color={room.status ? "success" : "error"}
                                                size="small"
                                            />
                                            {room.firmName && (
                                                <Chip
                                                    label={room.firmName}
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            )}
                                        </Stack>
                                    </Box>
                                </Stack>
                                <IconButton size="small">
                                    {expandedRows.includes(room.classRoomId)
                                        ? <KeyboardArrowUp />
                                        : <KeyboardArrowDown />}
                                </IconButton>
                            </Box>

                            <Collapse in={expandedRows.includes(room.classRoomId)}>
                                <CardContent sx={{ py: 1, px: 2 }}>
                                    <Stack spacing={1}>
                                        {room.firmName && (
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dotted gray" }}>
                                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                                                    Firm
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                                                    {room.firmName}
                                                </Typography>
                                            </Box>
                                        )}

                                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<Edit />}
                                                color="primary"
                                                fullWidth
                                                onClick={() => handleOpenDialog(room)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<Delete />}
                                                color="error"
                                                fullWidth
                                                onClick={() => onDeleteClassRoom(room.classRoomId, room.classRoomName)}
                                            >
                                                Delete
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Collapse>
                        </Card>
                    ))}
                </Stack>
            )}

            {/* Dialog */}
            <ClassRoomDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                onSubmit={handleSubmitClassRoom}
                editingClassRoom={editingClassRoom}
                loading={submitting}
            />
        </Box>
    );
};

export default ClassRoomList;
