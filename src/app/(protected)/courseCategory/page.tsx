'use client' 
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
    Select 
} from '@mui/material'; 
import { 
    ArrowBack, 
    Edit, 
    Visibility, 
    Delete, 
    KeyboardArrowDown, 
    KeyboardArrowUp, 
    Add, 
    Category, 
    SwapVert, 
    CalendarMonth 
} from '@mui/icons-material'; 
import Link from 'next/link'; 
import { CourseCategoryDto, CourseCategoryResponseDto } from '@/lib/features/courseCategory/courseCategoryTypes'; 
import { useCourseCategoryViewModel } from '@/lib/features/courseCategory/useCourseCategoryViewModel'; 
import Swal from 'sweetalert2'; 
 
// Popup/Dialog Component for Add/Edit 
interface CourseCategoryDialogProps { 
    open: boolean; 
    onClose: () => void; 
    onSubmit: (data: CourseCategoryDto) => void; 
    editingCategory?: CourseCategoryResponseDto | null; 
    categories: CourseCategoryResponseDto[]; 
    loading?: boolean; 
} 
 
const CourseCategoryDialog: React.FC<CourseCategoryDialogProps> = ({ 
    open, 
    onClose, 
    onSubmit, 
    editingCategory, 
    categories, 
    loading = false 
}) => { 
    const [formData, setFormData] = useState<CourseCategoryDto>({ 
        courseCategoryName: editingCategory?.courseCategoryName || '', 
        status: editingCategory?.status ?? true, 
        courseCategoryOrder: editingCategory?.courseCategoryOrder ?? 1, 
        firmId: editingCategory?.firmId || null, 
        parentId: editingCategory?.parentId || null 
    }); 
 
    // Reset form data when editingCategory changes or dialog opens/closes 
    useEffect(() => { 
        if (open) { 
            setFormData({ 
                courseCategoryName: editingCategory?.courseCategoryName || '', 
                status: editingCategory?.status ?? true, 
                courseCategoryOrder: editingCategory?.courseCategoryOrder ?? 1, 
                firmId: editingCategory?.firmId || null, 
                parentId: editingCategory?.parentId || null 
            }); 
        } 
    }, [open, editingCategory]); 
 
    const handleSubmit = (e: React.FormEvent) => { 
        e.preventDefault(); 
        onSubmit(formData); 
    }; 
 
    const handleChange = (field: keyof CourseCategoryDto) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => { 
        let value: any = event.target.value; 
 
        // Handle different input types 
        if (field === 'courseCategoryOrder') { 
            value = parseInt(value) || 1; 
        } else if (field === 'status') { 
            value = event.target.checked; 
        } else if (field === 'parentId') { 
            value = value === '' ? null : parseInt(value); 
        } else if (field === 'firmId') { 
            value = value === '' ? null : parseInt(value); 
        } 
 
        setFormData(prev => ({ 
            ...prev, 
            [field]: value 
        })); 
    }; 
 
    return ( 
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth> 
            <DialogTitle> 
                {editingCategory ? 'Edit Course Category' : 'Add New Course Category'} 
            </DialogTitle> 
            <form onSubmit={handleSubmit}> 
                <DialogContent> 
                    <Stack spacing={3} sx={{ mt: 1 }}> 
                        <TextField 
                            label="Category Name" 
                            value={formData.courseCategoryName} 
                            onChange={(e) => handleChange('courseCategoryName')(e)} 
                            required 
                            fullWidth 
                        /> 
 
                        <TextField 
                            label="Order" 
                            type="number" 
                            value={formData.courseCategoryOrder} 
                            onChange={(e) => handleChange('courseCategoryOrder')(e)} 
                            required 
                            fullWidth 
                            inputProps={{ min: 1 }} 
                        /> 
 
                        <FormControl fullWidth> 
                            <InputLabel>Parent Category</InputLabel> 
                            <Select 
                                value={formData.parentId || ''} 
                                onChange={(e) => handleChange('parentId')(e)} 
                                label="Parent Category" 
                            > 
                                <MenuItem value="">None</MenuItem> 
                                {categories 
                                    .filter(cat => !editingCategory || cat.courseCategoryId !== editingCategory.courseCategoryId) 
                                    .map(category => ( 
                                        <MenuItem key={category.courseCategoryId} value={category.courseCategoryId}> 
                                            {category.courseCategoryName} 
                                        </MenuItem> 
                                    ))} 
                            </Select> 
                        </FormControl> 
 
                        <FormControlLabel 
                            control={ 
                                <Switch 
                                    checked={formData.status} 
                                    onChange={(e) => handleChange('status')(e)} 
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
                        disabled={loading || !formData.courseCategoryName.trim()} 
                    > 
                        {loading ? 'Saving...' : (editingCategory ? 'Update' : 'Create')} 
                    </Button> 
                </DialogActions> 
            </form> 
        </Dialog> 
    ); 
}; 
 
const CourseCategoryList: React.FC = () => { 
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm')); 
 
    // Use the ViewModel 
    const { 
        categories, 
        isLoading, 
        error, 
        handleDelete, 
        refetch, 
        createCourseCategory, 
        updateCourseCategory 
    } = useCourseCategoryViewModel(); 
 
    // State for UI controls 
    const [expandedRows, setExpandedRows] = useState<number[]>([]); 
    const [dialogOpen, setDialogOpen] = useState(false); 
    const [editingCategory, setEditingCategory] = useState<CourseCategoryResponseDto | null>(null); 
    const [submitting, setSubmitting] = useState(false); 
 
    const toggleRowExpand = (categoryId: number) => { 
        setExpandedRows(prev => 
            prev.includes(categoryId) 
                ? prev.filter(id => id !== categoryId) 
                : [...prev, categoryId] 
        ); 
    }; 
 
    const onDeleteCategory = async (categoryId: number, categoryName: string) => { 
        const result = await Swal.fire({ 
            title: 'Are you sure?', 
            text: `You are about to delete the category "${categoryName}". This action cannot be undone.`, 
            icon: 'warning', 
            showCancelButton: true, 
            confirmButtonColor: '#d33', 
            cancelButtonColor: '#3085d6', 
            confirmButtonText: 'Yes, delete it!', 
            cancelButtonText: 'Cancel', 
            reverseButtons: true 
        }); 
 
        if (result.isConfirmed) { 
            try { 
                const success = await handleDelete(categoryId, categoryName); 
                if (success) { 
                    await Swal.fire({ 
                        title: 'Deleted!', 
                        text: `"${categoryName}" has been deleted successfully.`, 
                        icon: 'success', 
                        timer: 2000, 
                        showConfirmButton: false 
                    }); 
                    refetch(); 
                } else { 
                    await Swal.fire({ 
                        title: 'Error!', 
                        text: 'Failed to delete the category. Please try again.', 
                        icon: 'error' 
                    }); 
                } 
            } catch (error) { 
                await Swal.fire({ 
                    title: 'Error!', 
                    text: 'An error occurred while deleting the category.', 
                    icon: 'error' 
                }); 
            } 
        } 
    }; 
    const handleOpenDialog = (category?: CourseCategoryResponseDto) => { 
        setEditingCategory(category || null); 
        setDialogOpen(true); 
    }; 
 
    const handleCloseDialog = () => { 
        setDialogOpen(false); 
        setEditingCategory(null); 
    }; 
 
    const handleSubmitCategory = async (data: CourseCategoryDto) => { 
        setSubmitting(true); 
        try { 
            if (editingCategory) { 
                await updateCourseCategory({ id: editingCategory.courseCategoryId, data }); 
            } else { 
                await createCourseCategory(data); 
            } 
            handleCloseDialog(); 
            refetch(); 
            // Collapse all categories after successful operation 
            setExpandedRows([]);             
        } catch (error) { 
            console.error('Failed to save category:', error); 
        } finally { 
            setSubmitting(false); 
        } 
    }; 
 
    if (isLoading) return <Box sx={{ p: 3 }}>Loading categories...</Box>; 
    if (error) return <Box sx={{ p: 3, color: 'error.main' }}>Error: {error}</Box>; 
 
    return ( 
        <Box sx={{ p: isMobile ? 1 : 3 }}> 
            {/* Header */} 
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}> 
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
                        Course Categories 
                    </Typography> 
                </Stack> 
                <Button 
                    variant="contained" 
                    startIcon={<Add />} 
                    size={isMobile ? 'small' : 'medium'} 
                    onClick={() => handleOpenDialog()} 
                > 
                    Add Category 
                </Button> 
            </Stack> 
 
            {/* Results count */} 
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}> 
                {categories.length} category{categories.length !== 1 ? 'ies' : ''} found 
            </Typography> 
 
            {/* Categories List */} 
            {categories.length === 0 ? ( 
                <Box sx={{ p: 4, textAlign: 'center', border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}> 
                    <Typography variant="h6" color="text.secondary"> 
                        No categories found 
                    </Typography> 
                    <Typography variant="body2" sx={{ mt: 1 }}> 
                        Create your first course category to get started 
                    </Typography> 
                    <Button 
                        variant="outlined" 
                        startIcon={<Add />} 
                        sx={{ mt: 2 }} 
                        onClick={() => handleOpenDialog()} 
                    > 
                        Create Category 
                    </Button> 
                </Box> 
            ) : ( 
                <Stack spacing={2}> 
                    {categories.map((category) => ( 
                        <Card key={category.courseCategoryId} elevation={2}> 
                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'space-between', 
                                    p: 2, 
                                    cursor: 'pointer', 
                                    '&:hover': { backgroundColor: 'action.hover' } 
                                }} 
                                onClick={() => toggleRowExpand(category.courseCategoryId)} 
                            > 
                                <Stack direction="row" alignItems="center" spacing={2} sx={{ flex: 1 }}> 
                                    <Avatar sx={{ bgcolor: 'primary.main' }}> 
                                        <Category /> 
                                    </Avatar> 
                                    <Box sx={{ flex: 1 }}> 
                                        <Typography variant="h6" component="div"> 
                                            {category.courseCategoryName} 
                                        </Typography> 
                                        <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}> 
                                            <Chip 
                                                label={category.status ? 'Active' : 'Inactive'} 
                                                color={category.status ? 'success' : 'error'} 
                                                size="small" 
                                            /> 
                                            {category.firmName && ( 
                                                <Chip 
                                                    label={category.firmName} 
                                                    variant="outlined" 
                                                    size="small" 
                                                /> 
                                            )} 
                                            {category.parentCategoryName && ( 
                                                <Chip 
                                                    label={`Parent: ${category.parentCategoryName}`} 
                                                    variant="outlined" 
                                                    size="small" 
                                                /> 
                                            )} 
 
                                            <Chip 
                                                label={ 
                                                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}> 
                                                        <CalendarMonth fontSize="small" /> 
                                                        {new Date(category.createdAt).toLocaleDateString('en-GB', { 
                                                            day: '2-digit', 
                                                            month: 'short', 
                                                            year: 'numeric', 
                                                        })} 
                                                    </span> 
                                                } 
                                                variant="outlined" 
                                                size="small" 
                                            />                                             
                                            <Chip 
                                                label={ 
                                                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}> 
                                                        <SwapVert fontSize="small" /> 
                                                        {category.courseCategoryOrder} 
                                                    </span> 
                                                } 
                                                variant="outlined" 
                                                size="small" 
                                            /> 
                                        </Stack> 
                                    </Box> 
                                </Stack> 
                                <IconButton size="small"> 
                                    {expandedRows.includes(category.courseCategoryId) 
                                        ? <KeyboardArrowUp /> 
                                        : <KeyboardArrowDown /> 
                                    } 
                                </IconButton> 
                            </Box> 
 
                            <Collapse in={expandedRows.includes(category.courseCategoryId)}> 
                                <CardContent sx={{ py: 1, px: 2 }}> 
                                    <Stack spacing={1} > 
                                        {category.firmName && ( 
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dotted gray' }}> 
                                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}> 
                                                    Firm 
                                                </Typography> 
                                                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>{category.firmName}</Typography> 
                                            </Box> 
                                        )} 
 
                                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}> 
                                            <Button 
                                                variant="outlined" 
                                                size="small" 
                                                startIcon={<Edit />} 
                                                color="primary" 
                                                fullWidth 
                                                onClick={() => handleOpenDialog(category)} 
                                            > 
                                                Edit 
                                            </Button> 
                                            <Button 
                                                variant="outlined" 
                                                size="small" 
                                                startIcon={<Delete />} 
                                                color="error" 
                                                fullWidth 
                                                onClick={() => onDeleteCategory( 
                                                    category.courseCategoryId, 
                                                    category.courseCategoryName 
                                                )} 
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
 
            {/* Add/Edit Dialog */} 
            <CourseCategoryDialog 
                open={dialogOpen} 
                onClose={handleCloseDialog} 
                onSubmit={handleSubmitCategory} 
                editingCategory={editingCategory} 
                categories={categories} 
                loading={submitting} 
            /> 
        </Box> 
    ); 
}; 
 
export default CourseCategoryList;