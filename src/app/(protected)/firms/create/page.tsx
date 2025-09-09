'use client'
import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Stack,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Divider,
    useMediaQuery,
    Theme,
    IconButton,
    SelectChangeEvent,
    Snackbar,
    Alert,
    Grid,
    Card,
    CardContent
} from '@mui/material';
import { ArrowBack, Save, Cancel } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { createFirm } from '@/lib/features/firm/firmThunks';

interface FormData {
    firmName: string;
    firmCode: string;
    isActive: boolean;
}

const CreateFirmPage: React.FC = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.firms);
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const [formData, setFormData] = useState<FormData>({
        firmName: '',
        firmCode: '',
        isActive: true
    });
    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    useEffect(() => {
        if (error) {
            setSnackbarMessage(error);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    }, [error]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name as string]: value === 'true'
        }));
    };

    const validate = (): boolean => {
        const newErrors: Partial<FormData> = {};

        if (!formData.firmName.trim()) {
            newErrors.firmName = 'Firm name is required';
        } else if (formData.firmName.length > 100) {
            newErrors.firmName = 'Firm name must be 100 characters or less';
        }

        if (formData.firmCode && formData.firmCode.length > 20) {
            newErrors.firmCode = 'Firm code must be 20 characters or less';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const result = await dispatch(createFirm(formData)).unwrap();

            // This will only execute if the promise was fulfilled
            setSnackbarMessage(result.message || 'Firm created successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setTimeout(() => router.push('/firms'), 1500);
        } catch (err) {
            // Error handled by useEffect
        }
    };

    const handleCancel = () => router.push('/firms');
    const handleSnackbarClose = () => setSnackbarOpen(false);

    return (
        <Box sx={{
            maxWidth: 800,
            mx: 'auto',
            p: isMobile ? 2 : 3,
            animation: 'fadeIn 0.3s ease-in-out'
        }}>
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <IconButton onClick={() => router.push('/firms')} size="small">
                    <ArrowBack fontSize="small" />
                </IconButton>
                <Typography variant="h6" component="h1" fontWeight={600}>
                    Create New Firm
                </Typography>
            </Stack>

            <Card elevation={2} sx={{ borderRadius: 2 }}>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Firm Name"
                                    name="firmName"
                                    value={formData.firmName}
                                    onChange={handleInputChange}
                                    error={!!errors.firmName}
                                    helperText={errors.firmName}
                                    required
                                    inputProps={{ maxLength: 100 }}
                                    disabled={loading}
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid size={{xs:12, md:6}} >
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Firm Code (Optional)"
                                    name="firmCode"
                                    value={formData.firmCode}
                                    onChange={handleInputChange}
                                    error={!!errors.firmCode}
                                    helperText={errors.firmCode || 'Max 20 characters'}
                                    inputProps={{ maxLength: 20 }}
                                    disabled={loading}
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        name="isActive"
                                        value={formData.isActive.toString()}
                                        onChange={handleSelectChange}
                                        label="Status"
                                        disabled={loading}
                                        variant="outlined"
                                    >
                                        <MenuItem value="true">Active</MenuItem>
                                        <MenuItem value="false">Inactive</MenuItem>
                                    </Select>
                                    <FormHelperText>Set firm's active status</FormHelperText>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12}}>
                                <Divider sx={{ my: 1 }} />
                                <Stack direction="row" spacing={2} justifyContent="flex-end">
                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        startIcon={<Cancel fontSize="small" />}
                                        onClick={handleCancel}
                                        size="small"
                                        disabled={loading}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        startIcon={<Save fontSize="small" />}
                                        size="small"
                                        disabled={loading}
                                    >
                                        {loading ? 'Saving...' : 'Save Firm'}
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                    elevation={6}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CreateFirmPage;