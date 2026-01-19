// src/app/(protected)/discountCodes/page.tsx

'use client';
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Collapse
} from '@mui/material';
import { Add, Edit, Delete, Discount, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import Swal from 'sweetalert2';
import { useDiscountCodeViewModel } from '@/lib/features/discountCode/useDiscountCodeViewModel';
import { DiscountCodeDto, DiscountCodeResponseDto } from '@/lib/features/discountCode/discountCodeTypes';

// Dialog for Add/Edit
interface DiscountCodeDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DiscountCodeDto) => void;
  editingCode?: DiscountCodeResponseDto | null;
  loading?: boolean;
}

const DiscountCodeDialog: React.FC<DiscountCodeDialogProps> = ({
    open,
    onClose,
    onSubmit,
    editingCode,
    loading = false
}) => {
    const [formData, setFormData] = useState<DiscountCodeDto>({
        code: '',
        description: '',
        discountType: 'Percentage',
        discountValue: 0,
        isActive: true,
        startDate: '',
        endDate: ''
    });

    React.useEffect(() => {
        if (editingCode) {
            // Format dates to YYYY-MM-DD for the date input
            const formatDate = (dateStr?: string | null) => {
                if (!dateStr) return '';
                const d = new Date(dateStr);
                const month = `${d.getMonth() + 1}`.padStart(2, '0');
                const day = `${d.getDate()}`.padStart(2, '0');
                const year = d.getFullYear();
                return `${year}-${month}-${day}`;
            };

            setFormData({
                code: editingCode.code,
                description: editingCode.description || '',
                discountType: editingCode.discountType || 'Percentage',
                discountValue: editingCode.discountValue || 0,
                isActive: editingCode.isActive ?? true,
                startDate: formatDate(editingCode.startDate),
                endDate: formatDate(editingCode.endDate)
            });
        } else {
            // Reset for new entry
            setFormData({
                code: '',
                description: '',
                discountType: 'Percentage',
                discountValue: 0,
                isActive: true,
                startDate: '',
                endDate: ''
            });
        }
    }, [editingCode, open]);



    const handleChange = (field: keyof DiscountCodeDto) =>
        (e: React.ChangeEvent<HTMLInputElement> | any) => {
            let value: any = e.target.value;
            if (field === 'isActive') {
                value = e.target.checked;
            }
            setFormData(prev => ({ ...prev, [field]: value }));
        };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };


  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editingCode ? 'Edit Discount Code' : 'Add Discount Code'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              label="Code"
              value={formData.code}
              onChange={handleChange('code')}
              required
              fullWidth
            />
            <TextField
              label="Description"
              value={formData.description}
              onChange={handleChange('description')}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Discount Type</InputLabel>
              <Select
                value={formData.discountType}
                onChange={handleChange('discountType')}
                label="Discount Type"
              >
                <MenuItem value="Percentage">Percentage</MenuItem>
                <MenuItem value="FixedAmount">Fixed Amount</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Discount Value"
              type="number"
              value={formData.discountValue}
              onChange={handleChange('discountValue')}
              fullWidth
            />
            <TextField
              label="Start Date"
              type="date"
              value={formData.startDate || ''}
              onChange={handleChange('startDate')}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Date"
              type="date"
              value={formData.endDate || ''}
              onChange={handleChange('endDate')}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={handleChange('isActive')}
                />
              }
              label="Active"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Saving...' : editingCode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// List Component
const DiscountCodeList: React.FC = () => {
  const { codes, isLoading, error, refetch, createDiscountCode, updateDiscountCode, handleDelete } =
    useDiscountCodeViewModel();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<DiscountCodeResponseDto | null>(null);
  const [expanded, setExpanded] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const toggleExpand = (id: number) => {
    setExpanded(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleOpenDialog = (code?: DiscountCodeResponseDto) => {
    setEditingCode(code || null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingCode(null);
    setDialogOpen(false);
  };

  const handleSubmit = async (data: DiscountCodeDto) => {
    setSubmitting(true);
    try {
      if (editingCode) {
        await updateDiscountCode({ id: editingCode.discountCodeId, data });
      } else {
        await createDiscountCode(data);
      }
      handleCloseDialog();
      refetch();
    } catch (err) {
      console.error('Failed to save discount code', err);
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (id: number, code: string) => {
    const result = await Swal.fire({
      title: 'Delete Discount Code?',
      text: `Are you sure you want to delete "${code}" ? `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      const success = await handleDelete(id);
      if (success) {
        Swal.fire('Deleted!', `"${code}" has been deleted.`, 'success');
        refetch();
      }
    }
  };

  if (isLoading) return <Box sx={{ p: 3 }}>Loading discount codes...</Box>;
  if (error) return <Box sx={{ p: 3, color: 'error.main' }}>Error: {error}</Box>;

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h4">Discount Codes</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Discount Code
        </Button>
      </Stack>

      {codes.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 5, border: '1px dashed gray', borderRadius: 2 }}>
          <Typography>No discount codes found.</Typography>
          <Button sx={{ mt: 2 }} variant="outlined" onClick={() => handleOpenDialog()}>
            Create First Code
          </Button>
        </Box>
      ) : (
        <Stack spacing={2}>
          {codes.map(code => (
            <Card key={code.discountCodeId}>
              <Box
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}
                onClick={() => toggleExpand(code.discountCodeId)}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Discount />
                  <Typography variant="h6">{code.code}</Typography>
                  <Chip
                    label={code.isActive ? 'Active' : 'Inactive'}
                    color={code.isActive ? 'success' : 'error'}
                    size="small"
                  />
                </Stack>
                <IconButton size="small">
                  {expanded.includes(code.discountCodeId) ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                </IconButton>
              </Box>
              <Collapse in={expanded.includes(code.discountCodeId)}>
                <CardContent>
                          <Typography variant="body2" sx={{ fontStyle: 'italic', padding:2, mb:2, borderRadius:'22px', background:'#e0e0e0' }} >{code.description}</Typography>
                  <Typography variant="body2" marginBottom={2}>
                    Type: {code.discountType} | Value: {code.discountValue}
                  </Typography>

                  {code.startDate && 
                              <Typography variant="body2" marginBottom={2}>Start: &nbsp;
                              {new Date(code.startDate).toLocaleDateString('en-GB', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                              })}
                            </Typography>}
                  {code.endDate && 
                            <Typography variant="body2">End: &nbsp; 
                              {new Date(code.endDate).toLocaleDateString('en-GB', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                              })}                    
                            </Typography>}

                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Button size="small" variant="outlined" startIcon={<Edit />} onClick={() => handleOpenDialog(code)}>
                      Edit
                    </Button>
                    <Button size="small" variant="outlined" color="error" startIcon={<Delete />} onClick={() => onDelete(code.discountCodeId, code.code)}>
                      Delete
                    </Button>
                  </Stack>
                </CardContent>
              </Collapse>
            </Card>
          ))}
        </Stack>
      )}

      <DiscountCodeDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        editingCode={editingCode}
        loading={submitting}
      />
    </Box>
  );
};

export default DiscountCodeList;
