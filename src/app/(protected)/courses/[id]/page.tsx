'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import {
    Container,
    Typography,
    Chip,
    Button,
    Box,
    Paper,
    Grid,
    Skeleton,
    Alert,
    Divider,
    Stack,
    Avatar,
    Tabs,
    Tab,
    TextField,
    Card,
    CardContent
} from '@mui/material';

import {
    ArrowBack,
    Edit,
    Category,
    School,
    TrendingUp,
    CalendarToday,
    Update,
    Business,
    CheckCircle,
    Cancel
} from '@mui/icons-material';

import { useCourseDetailsViewModel } from '@/lib/features/course/useCourseDetailsViewModel';

/* ---------------- TAB PANEL HELPER ---------------- */
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

interface FeeFormData {
    feeAmount: number;
    gstPercentage: number;
    totalInstallments: number;
    branchId?: number | null;
}


function TabPanel({ children, value, index }: TabPanelProps) {
    if (value !== index) return null;
    return <Box sx={{ pt: 3 }}>{children}</Box>;
}

/* ---------------- MAIN COMPONENT ---------------- */
export default function CourseDetails() {
    const { id } = useParams();
    const { course, isLoading, error } = useCourseDetailsViewModel(id as string);

    const [tabIndex, setTabIndex] = React.useState(0);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

   
    
    

    const formatDate = (dateString?: string | null) =>
        dateString
            ? new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })
            : 'Not specified';

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'Beginner':
                return 'success';
            case 'Intermediate':
                return 'warning';
            case 'Expert':
                return 'error';
            default:
                return 'default';
        }
    };

    /* ---------- STATIC FEES (TEMP) ---------- */
    const feeDetails = {
        feeAmount: 25000,
        gstPercentage: 18,
        installments: 3
    };


    const feesExist = true; // later from API

    const [isEditingFees, setIsEditingFees] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const [formData, setFormData] = React.useState<FeeFormData>({
        feeAmount: feeDetails.feeAmount,
        gstPercentage: feeDetails.gstPercentage,
        totalInstallments: feeDetails.installments,
        branchId: null
    });

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value === '' ? '' : Number(value)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // simulate API call
        setTimeout(() => {
            console.log('Fee Data Submitted:', formData);
            setIsSubmitting(false);
            setIsEditingFees(false);
        }, 800);
    };


    const gstAmount = (feeDetails.feeAmount * feeDetails.gstPercentage) / 100;
    const totalFee = feeDetails.feeAmount + gstAmount;

    function FeeDetailsView({ feeDetails, gstAmount, totalFee }: any) {
        return (
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6">Course Fees</Typography>
                <Divider sx={{ my: 2 }} />

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography color="text.secondary">Fee Amount</Typography>
                        <Typography variant="h6">₹ {feeDetails.feeAmount}</Typography>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography color="text.secondary">GST</Typography>
                        <Typography variant="h6">{feeDetails.gstPercentage}%</Typography>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography color="text.secondary">Installments</Typography>
                        <Typography variant="h6">{feeDetails.installments}</Typography>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Divider sx={{ my: 2 }} />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography color="text.secondary">Base Fee</Typography>
                        <Typography>₹ {feeDetails.feeAmount}</Typography>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography color="text.secondary">GST Amount</Typography>
                        <Typography>₹ {gstAmount}</Typography>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography fontWeight="bold">Total Fee</Typography>
                        <Typography fontWeight="bold" color="primary">
                            ₹ {totalFee}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        );
    }

    function FeeForm({
        formData,
        totalFee,
        isSubmitting,
        onCancel,
        onSubmit
    }: any) {
        return (
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6">Fee Structure</Typography>
                <Divider sx={{ my: 2 }} />

                <form onSubmit={onSubmit}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Fee Configuration
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Fee Amount (₹)"
                                size="small"
                                type="number"
                                required
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="GST Percentage (%)"
                                size="small"
                                type="number"
                                required
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Total Installments"
                                size="small"
                                type="number"
                                helperText="1–12 installments allowed"
                            />
                        </Grid>

                        {/* SUMMARY */}
                        <Grid size={{ xs: 12 }}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Fee Summary
                                    </Typography>

                                    <Grid container spacing={1}>
                                        <Grid size={{ xs: 6 }}>Total Fee</Grid>
                                        <Grid size={{ xs: 6 }} textAlign="right">
                                            <Typography fontWeight="bold" color="primary">
                                                ₹ {totalFee}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* ACTIONS */}
                        <Grid size={{ xs: 12 }}>
                            <Stack direction="row" spacing={2}>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={onCancel}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={isSubmitting}
                                >
                                    Save Fees
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        );
    }

    function FeeActions({
        feesExist,
        onAddEdit,
        createdAt,
        updatedAt
    }: any) {
        return (
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6">Fee Actions</Typography>

                <Stack spacing={2} sx={{ my: 3 }}>
                    <Button
                        variant="contained"
                        onClick={onAddEdit}
                    >
                        {feesExist ? 'Edit Fees' : 'Add Fees'}
                    </Button>
                </Stack>

                <Divider />

                <Typography variant="subtitle2" sx={{ mt: 2 }}>
                    System Info
                </Typography>

                <Typography variant="body2">
                    Created: {createdAt}
                </Typography>
                <Typography variant="body2">
                    Updated: {updatedAt}
                </Typography>
            </Paper>
        );
    }



    /* ---------- MODULES (STATIC FOR NOW) ---------- */


    type ModuleItem = {
        id: number;
        name: string;
    };

    const [modules, setModules] = React.useState<ModuleItem[]>([
        { id: 1, name: 'Introduction to Course' },
        { id: 2, name: 'Basic Concepts' },
        { id: 3, name: 'Advanced Topics' },
        { id: 4, name: 'Practice & Assignments' }
    ]);

    const [selectedModuleIds, setSelectedModuleIds] = React.useState<number[]>(
        modules.map(m => m.id)
    );

    const [isEditingModules, setIsEditingModules] = React.useState(false); // checkbox mode
    const [isAddingModule, setIsAddingModule] = React.useState(false);

    // 🔹 edit module name
    const [editingModuleId, setEditingModuleId] = React.useState<number | null>(null);
    const [editingModuleName, setEditingModuleName] = React.useState('');


    const allModules = [
        { id: 1, name: 'Introduction to Course' },
        { id: 2, name: 'Basic Concepts' },
        { id: 3, name: 'Advanced Topics' },
        { id: 4, name: 'Practice & Assignments' },
        { id: 5, name: 'Final Assessment' }
    ];

    const handleModuleToggle = (id: number) => {
        setSelectedModuleIds(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]
        );
    };


    const handleSaveModules = () => {
        console.log('Selected Modules:', selectedModuleIds);
        setIsEditingModules(false);
    };

    const visibleModules = isEditingModules
        ? modules
        : modules.filter(m => selectedModuleIds.includes(m.id));


    const [newModuleName, setNewModuleName] = React.useState('');
    
    const handleAddModule = () => {
        if (!newModuleName.trim()) return;

        const newModule: ModuleItem = {
            id: Date.now(),
            name: newModuleName.trim()
        };

        setModules(prev => [...prev, newModule]);
        setSelectedModuleIds(prev => [...prev, newModule.id]);

        setNewModuleName('');
        setIsAddingModule(false);
    };

    const startEditModule = (module: ModuleItem) => {
        setEditingModuleId(module.id);
        setEditingModuleName(module.name);
    };

    const handleSaveEditModule = () => {
        if (!editingModuleName.trim() || editingModuleId === null) return;

        setModules(prev =>
            prev.map(m =>
                m.id === editingModuleId
                    ? { ...m, name: editingModuleName.trim() }
                    : m
            )
        );

        setEditingModuleId(null);
        setEditingModuleName('');
    };
    
    const cancelEditModule = () => {
        setEditingModuleId(null);
        setEditingModuleName('');
    };


    /* ---------- LOADING ---------- */
    if (isLoading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Skeleton variant="rectangular" height={400} />
            </Container>
        );
    }

    /* ---------- ERROR ---------- */
    if (error) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (!course) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert severity="warning">Course not found</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* ---------- HEADER ---------- */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Link href="/courses">
                        <Button startIcon={<ArrowBack />} variant="outlined" size="small">
                            Back
                        </Button>
                    </Link>
                    <Typography variant="h4">Course Details</Typography>
                </Box>

                <Chip
                    label={course.status ? 'Active' : 'Inactive'}
                    color={course.status ? 'success' : 'error'}
                    icon={course.status ? <CheckCircle /> : <Cancel />}
                />
            </Box>

            {/* ---------- TABS ---------- */}
            <Paper sx={{ mb: 3 }}>
                <Tabs
                    value={tabIndex}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab label="Course Details" />
                    <Tab label="Fees Details" />
                    <Tab label="Course Modules" />
                    <Tab label="Course Teacher" />
                    <Tab label="Course Batches" />
                </Tabs>
            </Paper>

            {/* =====================================================
                TAB 1 : COURSE DETAILS
            ====================================================== */}
            <TabPanel value={tabIndex} index={0}>
                <Grid container spacing={3}>
                    {/* LEFT */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Paper sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                                    <School />
                                </Avatar>
                                <Box>
                                    <Typography variant="h5">{course.courseName}</Typography>
                                    <Chip
                                        label={course.courseLevel}
                                        color={getLevelColor(course.courseLevel) as any}
                                        size="small"
                                    />
                                </Box>
                            </Box>

                            <Divider sx={{ mb: 2 }} />

                            <Typography variant="body1" color="text.secondary" paragraph>
                                {course.courseDescription || 'No description available'}
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Category color="primary" />{' '}
                                    {course.courseCategoryName || 'N/A'}
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TrendingUp color="primary" /> {course.courseLevel}
                                </Grid>

                                {course.firmName && (
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Business color="primary" /> {course.firmName}
                                    </Grid>
                                )}
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* RIGHT */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6">Actions</Typography>

                            <Stack spacing={2} sx={{ my: 2 }}>
                                <Link href={`/courses/${id}/edit`}>
                                    <Button fullWidth variant="contained" startIcon={<Edit />}>
                                        Edit Course
                                    </Button>
                                </Link>
                                <Button variant="outlined">View Modules</Button>
                            </Stack>

                            <Divider />

                            <Typography variant="body2" sx={{ mt: 2 }}>
                                <CalendarToday fontSize="small" /> Created:{' '}
                                {formatDate(course.createdAt)}
                            </Typography>
                            <Typography variant="body2">
                                <Update fontSize="small" /> Updated:{' '}
                                {formatDate(course.updatedAt)}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </TabPanel>

            {/* =====================================================
                TAB 2 : FEES DETAILS
            ====================================================== */}
            <TabPanel value={tabIndex} index={1}>
                <Grid container spacing={3}>
                    {/* LEFT SIDE */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        {!isEditingFees ? (
                            <FeeDetailsView
                                feeDetails={feeDetails}
                                gstAmount={gstAmount}
                                totalFee={totalFee}
                            />
                        ) : (
                            <FeeForm
                                formData={formData}
                                totalFee={totalFee}
                                isSubmitting={isSubmitting}
                                onCancel={() => setIsEditingFees(false)}
                                onSubmit={handleSubmit}
                            />
                        )}
                    </Grid>

                    {/* RIGHT SIDE */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <FeeActions
                            feesExist={feesExist}
                            onAddEdit={() => setIsEditingFees(true)}
                            createdAt="12 Jan 2025"
                            updatedAt="20 Jan 2025"
                        />
                    </Grid>
                </Grid>
            </TabPanel>

            {/* =====================================================
                TAB 3 : MODULES
            ====================================================== */}
            <TabPanel value={tabIndex} index={2}>
                <Grid container spacing={3}>
                    {/* LEFT SIDE */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6">Course Modules</Typography>
                            <Divider sx={{ my: 2 }} />

                            <Stack spacing={1}>
                                {visibleModules.map(module => {
                                    const isSelected = selectedModuleIds.includes(module.id);
                                    const isEditingThis = editingModuleId === module.id;

                                    return (
                                        <Box
                                            key={module.id}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                px: 2,
                                                py: 1.2,
                                                borderRadius: 1,
                                                bgcolor: 'background.paper',
                                                border: '1px solid',
                                                borderColor: 'divider'
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {/* Checkbox only in assign mode */}
                                                {isEditingModules && (
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => handleModuleToggle(module.id)}
                                                    />
                                                )}

                                                {/* Edit module name */}
                                                {isEditingThis ? (
                                                    <TextField
                                                        size="small"
                                                        value={editingModuleName}
                                                        onChange={(e) => setEditingModuleName(e.target.value)}
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <Typography>{module.name}</Typography>
                                                )}
                                            </Box>

                                            {/* Edit button (only for assigned modules in view mode) */}
                                            {!isEditingModules &&
                                                !isAddingModule &&
                                                !isEditingThis && (
                                                    <Button
                                                        size="small"
                                                        onClick={() => startEditModule(module)}
                                                    >
                                                        Edit
                                                    </Button>
                                                )}

                                            {/* Save / Cancel name edit */}
                                            {isEditingThis && (
                                                <Stack direction="row" spacing={1}>
                                                    <Button size="small" onClick={handleSaveEditModule}>
                                                        Save
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        color="secondary"
                                                        onClick={cancelEditModule}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </Stack>
                                            )}
                                        </Box>
                                    );
                                })}
                            </Stack>

                            {/* Empty state */}
                            {!isEditingModules && visibleModules.length === 0 && (
                                <Alert severity="info" sx={{ mt: 2 }}>
                                    No modules assigned to this course.
                                </Alert>
                            )}
                        </Paper>
                    </Grid>

                    {/* RIGHT SIDE */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6">Module Actions</Typography>

                            <Stack spacing={2} sx={{ my: 3 }}>
                                {/* VIEW MODE */}
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

                                {/* EDIT MODE */}
                                {isEditingModules && (
                                    <>
                                        <Button
                                            variant="contained"
                                            onClick={handleSaveModules}
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

                                {/* ADD MODE */}
                                {isAddingModule && (
                                    <>
                                        <TextField
                                            size="small"
                                            label="Module Name"
                                            value={newModuleName}
                                            onChange={(e) => setNewModuleName(e.target.value)}
                                            autoFocus
                                            placeholder="e.g. Introduction to Algebra"
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
                                            onClick={() => {
                                                setIsAddingModule(false);
                                                setNewModuleName('');
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </>
                                )}
                            </Stack>

                            <Divider />

                            <Typography variant="subtitle2" sx={{ mt: 2 }}>
                                System Info
                            </Typography>

                            <Typography variant="body2">
                                Total Modules: {selectedModuleIds.length}
                            </Typography>
                        </Paper>
                    </Grid>

                </Grid>
            </TabPanel>


            {/* =====================================================
                TAB 4 : TEACHERS
            ====================================================== */}
            <TabPanel value={tabIndex} index={3}>
                <Alert severity="info">Assigned teachers will be shown here.</Alert>
            </TabPanel>

            {/* =====================================================
                TAB 5 : BATCHES
            ====================================================== */}
            <TabPanel value={tabIndex} index={4}>
                <Alert severity="info">Course batches will be shown here.</Alert>
            </TabPanel>
        </Container>
    );
}
