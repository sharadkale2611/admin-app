'use client';

import React, { useEffect, useState } from 'react';
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
import { useModuleViewModel } from "@/lib/features/module/useModuleViewModel";
import { useCourseModuleViewModel } from "@/lib/features/courseModules/useCourseModuleViewModel";



import { useRouter } from "next/navigation";


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
    createdAt: string;     // or Date if you parse it
    updatedAt?: string | null;
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

    const router = useRouter();

    const handleEditFees = () => {
        if (!course?.courseId) return;
        router.push(`/fees/${course?.fees?.[0]?.courseFeeId}/edit`);
    };

    const { modules: allModules, isLoading: modulesLoading, createModule, updateModule, refetch } = useModuleViewModel();

    const {
        courseModules,
        createCourseModule,
        deleteCourseModule,
        refetch: refetchCourseModules
    } = useCourseModuleViewModel();


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

    const [feeDetails, setFeeDetails] = React.useState<FeeFormData | null>(null);

    const [feesExist, setFeesExist] = React.useState(false);

    React.useEffect(() => {
        if (course?.fees?.length) {
            const fee = course.fees[0];

            setFeeDetails({
                feeAmount: fee.feeAmount,
                gstPercentage: fee.gstPercentage,
                totalInstallments: fee.totalInstallments,
                updatedAt: fee.updatedAt || null,
                createdAt: fee.createdAt,
                branchId: null
            });

            setFeesExist(true);
        } else {
            setFeeDetails(null);
        }
    }, [course]);

    const [isEditingFees, setIsEditingFees] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isAddingSaving, setIsAddingSaving] = React.useState(false);

    const [formData, setFormData] = React.useState<FeeFormData | null>(null);

    React.useEffect(() => {
        if (feeDetails) setFormData(feeDetails);
    }, [feeDetails]);

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

    const gstAmount = formData
        ? (formData.feeAmount * formData.gstPercentage) / 100
        : 0;

    const totalFee = formData ? formData.feeAmount + gstAmount : 0;


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
                        <Typography variant="h6">{feeDetails.totalInstallments}</Typography>
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

    {/* =====================================================
                            EDIT FEES FORM
        ====================================================== */}


    // function FeeForm({
    //     formData,
    //     totalFee,
    //     isSubmitting,
    //     onCancel,
    //     onSubmit
    // }: any) {
    //     return (
    //         <Paper sx={{ p: 3 }}>
    //             <Typography variant="h6">Fee Structure</Typography>
    //             <Divider sx={{ my: 2 }} />

    //             <form onSubmit={onSubmit}>
    //                 <Grid container spacing={3}>
    //                     <Grid size={{ xs: 12 }}>
    //                         <Typography variant="subtitle2" color="text.secondary">
    //                             Fee Configuration
    //                         </Typography>
    //                     </Grid>

    //                     <Grid size={{ xs: 12, sm: 6 }}>
    //                         <TextField
    //                             fullWidth
    //                             label="Fee Amount (₹)"
    //                             size="small"
    //                             type="number"
    //                             required
    //                         />
    //                     </Grid>

    //                     <Grid size={{ xs: 12, sm: 6 }}>
    //                         <TextField
    //                             fullWidth
    //                             label="GST Percentage (%)"
    //                             size="small"
    //                             type="number"
    //                             required
    //                         />
    //                     </Grid>

    //                     <Grid size={{ xs: 12 }}>
    //                         <TextField
    //                             fullWidth
    //                             label="Total Installments"
    //                             size="small"
    //                             type="number"
    //                             helperText="1–12 installments allowed"
    //                         />
    //                     </Grid>

    //                     {/* SUMMARY */}
    //                     <Grid size={{ xs: 12 }}>
    //                         <Card variant="outlined">
    //                             <CardContent>
    //                                 <Typography variant="subtitle1" gutterBottom>
    //                                     Fee Summary
    //                                 </Typography>

    //                                 <Grid container spacing={1}>
    //                                     <Grid size={{ xs: 6 }}>Total Fee</Grid>
    //                                     <Grid size={{ xs: 6 }} textAlign="right">
    //                                         <Typography fontWeight="bold" color="primary">
    //                                             ₹ {totalFee}
    //                                         </Typography>
    //                                     </Grid>
    //                                 </Grid>
    //                             </CardContent>
    //                         </Card>
    //                     </Grid>

    //                     {/* ACTIONS */}
    //                     <Grid size={{ xs: 12 }}>
    //                         <Stack direction="row" spacing={2}>
    //                             <Button
    //                                 variant="outlined"
    //                                 color="secondary"
    //                                 onClick={onCancel}
    //                             >
    //                                 Cancel
    //                             </Button>
    //                             <Button
    //                                 type="submit"
    //                                 variant="contained"
    //                                 disabled={isSubmitting}
    //                             >
    //                                 Save Fees
    //                             </Button>
    //                         </Stack>
    //                     </Grid>
    //                 </Grid>
    //             </form>
    //         </Paper>
    //     );
    // }

    function FeeActions({
        feesExist,
        onEditFees,
        onAddFees,
        // onAddEdit,
        createdAt,
        updatedAt
    }: any) {
        return (
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6">Fee Actions</Typography>

                <Stack spacing={2} sx={{ my: 3 }}>
                    {feesExist && (
                        <Button variant="contained" onClick={onEditFees}>
                            Edit Fees
                        </Button>
                    )}

                    {/* <Button variant="outlined" color="success" onClick={onAddFees}>
                        Add Fees
                    </Button> */}
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

    /* ---------- MODULES ---------- */


    type ModuleItem = {
        id: number;
        name: string;
    };

    const [modules, setModules] = React.useState<ModuleItem[]>([]);

    React.useEffect(() => {
        if (course?.modules?.length) {
            setModules(
                course.modules.map(m => ({
                    id: m.moduleId,
                    name: m.moduleName
                }))
            );

            setSelectedModuleIds(course.modules.map(m => m.moduleId));
        }
    }, [course]);

    const [selectedModuleIds, setSelectedModuleIds] = useState<number[]>([]);

    const courseAssignedModules =
        courseModules
            ?.filter(x => x.courseId === course?.courseId && !x.isDeleted)
            ?.map(x => x.moduleId) ?? [];


    useEffect(() => {
        setSelectedModuleIds(courseAssignedModules);
    }, [courseAssignedModules.length]);

    const [isEditingModules, setIsEditingModules] = React.useState(false); // checkbox mode
    const [isAddingModule, setIsAddingModule] = React.useState(false);

    // 🔹 edit module name
    const [editingModuleId, setEditingModuleId] = React.useState<number | null>(null);
    const [editingModuleName, setEditingModuleName] = React.useState('');
    const [isSaving, setIsSaving] = React.useState(false);

    const handleModuleToggle = (id: number) => {
        setSelectedModuleIds(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]
        );
    };


    const handleSaveModules = async () => {
        if (!course?.courseId) return;

        const courseId = course.courseId;

        const oldIds = courseAssignedModules || [];
        const newIds = selectedModuleIds;

        // NEW = create
        const toAdd = newIds.filter(id => !oldIds.includes(id));

        // REMOVED = delete
        const toRemove = oldIds.filter(id => !newIds.includes(id));

        try {
            // CREATE NEW COURSE-MODULE LINKS
            for (let i = 0; i < toAdd.length; i++) {
                await createCourseModule({
                    courseId,
                    moduleId: toAdd[i],
                    moduleOrder: i + 1,   
                    isActive: true
                });
            }

            // DELETE UNCHECKED LINKS
            for (const moduleId of toRemove) {
                const rec = courseModules.find(
                    x => x.courseId === courseId && x.moduleId === moduleId
                );

                if (rec) await deleteCourseModule(rec.courseModuleId);
            }

            await refetchCourseModules();
            setIsEditingModules(false);

        } catch (e) {
            console.error("Save modules failed", e);
        }
    };


    const visibleModules = isEditingModules
        ? allModules.map(m => ({
            id: m.moduleId,
            name: m.moduleName
        }))
        : modules.filter(m => selectedModuleIds.includes(m.id));




    const [newModuleName, setNewModuleName] = React.useState('');

    const handleAddModule = async () => {
        if (!newModuleName.trim()) return;

        try {
            setIsAddingSaving(true);

            // CALL API 
            const res = await createModule({
                moduleName: newModuleName.trim(),
                moduleDescription: "",
                isActive: true
            });

            // UPDATE UI LIST (include ID from backend)
            setModules(prev => [
                ...prev,
                { id: res.module.moduleId, name: res.module.moduleName }
            ]);


            setSelectedModuleIds(prev => [...prev, res.module.moduleId]);

            // RESET UI
            setNewModuleName('');
            setIsAddingModule(false);

        } catch (err) {
            console.error("Failed to create module", err);
        } finally {
            setIsAddingSaving(false);
        }
    };


    const startEditModule = (module: ModuleItem) => {
        setEditingModuleId(module.id);
        setEditingModuleName(module.name);
    };

    const handleSaveEditModule = async () => {

        if (!editingModuleName.trim() || editingModuleId === null) return;

        try {
            setIsSaving(true);

            await updateModule({
                id: editingModuleId,
                data: {
                    moduleName: editingModuleName.trim(),
                    moduleDescription: "",
                    isActive: true   // or existing description if you have it
                }
            });

            await refetch();


            // Update local UI list
            setModules(prev =>
                prev.map(m =>
                    m.id === editingModuleId
                        ? { ...m, name: editingModuleName.trim() }
                        : m
                )
            );

            // exit edit mode
            setEditingModuleId(null);
            setEditingModuleName('');

        } catch (err) {
            console.error("Module update failed", err);
        } finally {
            setIsSaving(false);  // 👈 STOP LOADING
        }
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
                    <Grid size={{ xs: 12, md: 8 }}>

                        {isLoading && <Skeleton variant="rounded" height={220} />}

                        {!isLoading && !feeDetails && (
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6">Course Fees</Typography>
                                <Divider sx={{ my: 2 }} />

                                <Alert severity="info">
                                    No fee found for this course.
                                </Alert>

                                <Button
                                    sx={{ mt: 2 }}
                                    variant="contained"
                                    onClick={() => setIsEditingFees(true)}
                                >
                                    Add Fees
                                </Button>
                            </Paper>
                        )}

                        {!isLoading && feeDetails && !isEditingFees && (
                            <FeeDetailsView
                                feeDetails={feeDetails}
                                gstAmount={(feeDetails.feeAmount * feeDetails.gstPercentage) / 100}
                                totalFee={
                                    feeDetails.feeAmount +
                                    (feeDetails.feeAmount * feeDetails.gstPercentage) / 100
                                }
                            />
                        )}

                        
                    {/* =====================================================
                                            EDIT FEES FORM CALL
                        ====================================================== */}

                        {/* {!isLoading && feeDetails && isEditingFees && (
                            <FeeForm
                                formData={formData}
                                totalFee={totalFee}
                                isSubmitting={isSubmitting}
                                onCancel={() => setIsEditingFees(false)}
                                onSubmit={handleSubmit}
                            />
                        )} */}


                    </Grid>

                    {/* RIGHT SIDE */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <FeeActions
                            feesExist={feesExist}
                            // onAddEdit={() => setIsEditingFees(true)}
                            onEditFees={handleEditFees}
                            createdAt={formatDate(course?.fees?.[0]?.createdAt)}
                            updatedAt={formatDate(course?.fees?.[0]?.updatedAt) || 'Not updated'}
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
                                                    <Button
                                                        size="small"
                                                        onClick={handleSaveEditModule}
                                                        disabled={isSaving}
                                                    >
                                                        {isSaving ? "Saving..." : "Save"}
                                                    </Button>

                                                    <Button
                                                        size="small"
                                                        color="secondary"
                                                        onClick={cancelEditModule}
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
                                            onClick={async () => {
                                                await refetch();
                                                setIsEditingModules(true);
                                            }}
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
