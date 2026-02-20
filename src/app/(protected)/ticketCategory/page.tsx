'use client';
import React, { useEffect, useState } from 'react';
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
    Select,
} from '@mui/material';
import {
    ArrowBack,
    Edit,
    Delete,
    KeyboardArrowDown,
    KeyboardArrowUp,
    Add,
    Category,
    CalendarMonth,
} from '@mui/icons-material';
import Link from 'next/link';
import Swal from 'sweetalert2';

interface TicketCategory {
    categoryId: number;
    firmId: number;
    firmName: string;
    name: string;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string | null;
    isDeleted: boolean;
}

interface TicketCategoryFormData {
    name: string;
    firmId: number | '';
    isActive: boolean;
}

interface TicketCategoryDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: TicketCategoryFormData) => void;
    editingCategory?: TicketCategory | null;
    firms: { id: number; name: string }[];
    loading?: boolean;
}

const TicketCategoryDialog: React.FC<TicketCategoryDialogProps> = ({
    open,
    onClose,
    onSubmit,
    editingCategory,
    firms,
    loading = false,
}) => {
    const [formData, setFormData] = useState<TicketCategoryFormData>({
        name: editingCategory?.name || '',
        firmId: editingCategory?.firmId || '',
        isActive: editingCategory?.isActive ?? true,
    });

    useEffect(() => {
        if (open) {
            setFormData({
                name: editingCategory?.name || '',
                firmId: editingCategory?.firmId || '',
                isActive: editingCategory?.isActive ?? true,
            });
        }
    }, [open, editingCategory]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange =
        (field: keyof TicketCategoryFormData) =>
        (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
            let value: any = event.target.value;

            if (field === 'firmId') {
                value = value === '' ? '' : parseInt(value);
            } else if (field === 'isActive') {
                value = event.target.checked;
            }

            setFormData(prev => ({
                ...prev,
                [field]: value,
            }));
        };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {editingCategory ? 'Edit Ticket Category' : 'Add New Ticket Category'}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            label="Category Name"
                            value={formData.name}
                            onChange={e => handleChange('name')(e)}
                            required
                            fullWidth
                        />

                        <FormControl fullWidth required>
                            <InputLabel>Firm</InputLabel>
                            <Select
                                value={formData.firmId}
                                onChange={e => handleChange('firmId')(e)}
                                label="Firm"
                            >
                                <MenuItem value="">Select Firm</MenuItem>
                                {firms.map(firm => (
                                    <MenuItem key={firm.id} value={firm.id}>
                                        {firm.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.isActive}
                                    onChange={e => handleChange('isActive')(e)}
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
                        disabled={
                            loading ||
                            !formData.name.trim() ||
                            formData.firmId === '' ||
                            formData.firmId === null
                        }
                    >
                        {loading ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

const TicketCategoryList: React.FC = () => {
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const firms = [
        { id: 1, name: 'Revolution Academy' },
        { id: 2, name: 'Tech Corp' },
        { id: 3, name: 'Global Education' },
    ];

    const [categories, setCategories] = useState<TicketCategory[]>([
        {
            categoryId: 1,
            firmId: 1,
            firmName: 'Revolution Academy',
            name: 'General Support',
            isActive: true,
            createdAt: new Date('2025-01-10').toISOString(),
            updatedAt: null,
            isDeleted: false,
        },
        {
            categoryId: 2,
            firmId: 2,
            firmName: 'Tech Corp',
            name: 'Billing',
            isActive: true,
            createdAt: new Date('2025-02-05').toISOString(),
            updatedAt: null,
            isDeleted: false,
        },
        {
            categoryId: 3,
            firmId: 1,
            firmName: 'Revolution Academy',
            name: 'Technical Issue',
            isActive: false,
            createdAt: new Date('2025-03-15').toISOString(),
            updatedAt: null,
            isDeleted: false,
        },
    ]);

    const [expandedRows, setExpandedRows] = useState<number[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<TicketCategory | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const visibleCategories = categories.filter(c => !c.isDeleted);

    const toggleRowExpand = (categoryId: number) => {
        setExpandedRows(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId],
        );
    };

    const handleOpenDialog = (category?: TicketCategory) => {
        setEditingCategory(category || null);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingCategory(null);
    };

    const handleSubmitCategory = async (data: TicketCategoryFormData) => {
        setSubmitting(true);
        try {
            const firm = firms.find(f => f.id === data.firmId);

            if (editingCategory) {
                setCategories(prev =>
                    prev.map(cat =>
                        cat.categoryId === editingCategory.categoryId
                            ? {
                                  ...cat,
                                  name: data.name,
                                  firmId: data.firmId as number,
                                  firmName: firm?.name || '',
                                  isActive: data.isActive,
                                  updatedAt: new Date().toISOString(),
                              }
                            : cat,
                    ),
                );
            } else {
                const nextId =
                    (categories.length
                        ? Math.max(...categories.map(c => c.categoryId))
                        : 0) + 1;

                const newCategory: TicketCategory = {
                    categoryId: nextId,
                    firmId: data.firmId as number,
                    firmName: firm?.name || '',
                    name: data.name,
                    isActive: data.isActive,
                    createdAt: new Date().toISOString(),
                    updatedAt: null,
                    isDeleted: false,
                };

                setCategories(prev => [...prev, newCategory]);
            }

            handleCloseDialog();
            setExpandedRows([]);
        } finally {
            setSubmitting(false);
        }
    };

    const onDeleteCategory = async (categoryId: number, name: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete the ticket category "${name}". This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            setCategories(prev =>
                prev.map(cat =>
                    cat.categoryId === categoryId ? { ...cat, isDeleted: true } : cat,
                ),
            );
            await Swal.fire({
                title: 'Deleted!',
                text: `"${name}" has been deleted successfully.`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
            });
        }
    };

    return (
        <Box sx={{ p: isMobile ? 1 : 3 }}>
            {/* Header */}
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 3 }}
            >
                <Stack direction="row" alignItems="center" spacing={2}>
                    <IconButton
                        aria-label="back"
                        size={isMobile ? 'small' : 'medium'}
                        component={Link}
                        href="/dashboard"
                    >
                        <ArrowBack fontSize={isMobile ? 'small' : 'medium'} />
                    </IconButton>
                    <Typography variant={isMobile ? 'h5' : 'h4'} component="h1">
                        Ticket Categories
                    </Typography>
                </Stack>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    size={isMobile ? 'small' : 'medium'}
                    onClick={() => handleOpenDialog()}
                >
                    Add Ticket Category
                </Button>
            </Stack>

            {/* Results count */}
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                {visibleCategories.length} category
                {visibleCategories.length !== 1 ? 'ies' : ''} found
            </Typography>

            {/* Categories List */}
            {visibleCategories.length === 0 ? (
                <Box
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        border: '1px dashed',
                        borderColor: 'divider',
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" color="text.secondary">
                        No ticket categories found
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Create your first ticket category to get started
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<Add />}
                        sx={{ mt: 2 }}
                        onClick={() => handleOpenDialog()}
                    >
                        Create Ticket Category
                    </Button>
                </Box>
            ) : (
                <Stack spacing={2}>
                    {visibleCategories.map(category => (
                        <Card key={category.categoryId} elevation={2}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    p: 2,
                                    cursor: 'pointer',
                                    '&:hover': { backgroundColor: 'action.hover' },
                                }}
                                onClick={() => toggleRowExpand(category.categoryId)}
                            >
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={2}
                                    sx={{ flex: 1 }}
                                >
                                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                                        <Category />
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="h6" component="div">
                                            {category.name}
                                        </Typography>
                                        <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                                            <Chip
                                                label={
                                                    category.isActive ? 'Active' : 'Inactive'
                                                }
                                                color={
                                                    category.isActive ? 'success' : 'error'
                                                }
                                                size="small"
                                            />

                                            {category.firmName && (
                                                <Chip
                                                    label={category.firmName}
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            )}

                                            <Chip
                                                label={
                                                    <span
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px',
                                                        }}
                                                    >
                                                        <CalendarMonth fontSize="small" />
                                                        {new Date(
                                                            category.createdAt,
                                                        ).toLocaleDateString('en-GB', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        })}
                                                    </span>
                                                }
                                                variant="outlined"
                                                size="small"
                                            />
                                        </Stack>
                                    </Box>
                                </Stack>
                                <IconButton size="small">
                                    {expandedRows.includes(category.categoryId) ? (
                                        <KeyboardArrowUp />
                                    ) : (
                                        <KeyboardArrowDown />
                                    )}
                                </IconButton>
                            </Box>

                            <Collapse
                                in={expandedRows.includes(category.categoryId)}
                                timeout="auto"
                                unmountOnExit
                            >
                                <CardContent sx={{ py: 1, px: 2 }}>
                                    <Stack spacing={1}>
                                        {category.firmName && (
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    borderBottom: '1px dotted gray',
                                                }}
                                            >
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{ fontSize: '0.75rem' }}
                                                >
                                                    Firm
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{ fontSize: '0.875rem' }}
                                                >
                                                    {category.firmName}
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
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    handleOpenDialog(category);
                                                }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<Delete />}
                                                color="error"
                                                fullWidth
                                                onClick={async e => {
                                                    e.stopPropagation();
                                                    await onDeleteCategory(
                                                        category.categoryId,
                                                        category.name,
                                                    );
                                                }}
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

            <TicketCategoryDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                onSubmit={handleSubmitCategory}
                editingCategory={editingCategory}
                firms={firms}
                loading={submitting}
            />
        </Box>
    );
};

export default TicketCategoryList;