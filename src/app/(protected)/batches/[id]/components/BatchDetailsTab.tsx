'use client';

import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Divider,
    Grid,
    Button,
    Stack,
    TextField,
    MenuItem,
    Switch,
    FormControlLabel,
    Tooltip
} from '@mui/material';

import { Edit, Save, Close } from '@mui/icons-material';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
// import { updateBatch } from '@/lib/features/batch/batchThunks';
import { useUpdateBatch } from '@/lib/features/batch/useUpdateBatch';
import { fetchBatchById } from '@/lib/features/batch/batchThunks';


interface BatchDetailsTabProps {
    batchId: number;
}



/* ---------- HELPERS ---------- */
const formatDate = (date?: string | null) => {
    if (!date) {
        return (
            <Typography component="span" sx={{ color: 'warning.main', fontStyle: 'italic' }}>
                Not specified
            </Typography>
        );
    }

    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export default function BatchDetailsTab({ batchId }: BatchDetailsTabProps) {
    const dispatch = useAppDispatch();

    const { currentBatch } = useAppSelector(state => state.batches);
    const staffList = useAppSelector(state => state.staff.dropdownStaff);
    const classRooms = useAppSelector(state => state.classRooms.classRooms);

    const [isEditing, setIsEditing] = React.useState(false);
    const { handleUpdateBatch } = useUpdateBatch();


    const [form, setForm] = React.useState({
        startTime: '',
        trainerId: '',
        classRoomId: '',
        isActive: true
    });

    /* ----------Compute isBatchStarted ---------- */
    
    const isBatchStarted = React.useMemo(() => {
        if (!currentBatch) return false;

        // Highest priority: Actual Start Date
        if (currentBatch.actualStartDate) return true;

        // Fallback: Planned Start Date
        if (currentBatch.startDate) {
            const today = new Date();
            const startDate = new Date(currentBatch.startDate);
            return today >= startDate;
        }

        return false;
    }, [currentBatch]);


    /* ---------- INIT FORM ---------- */
    React.useEffect(() => {
        if (!currentBatch) return;

        setForm({
            startTime: currentBatch.startTime?.slice(0, 5) ?? '',
            trainerId: String(currentBatch.trainerId ?? ''),
            classRoomId: String(currentBatch.classRoomId ?? ''),
            isActive: currentBatch.isActive
        });
    }, [currentBatch]);

    if (!currentBatch) return null;

    const trainerName = currentBatch.trainerName || '-';
    const classRoomName =
        classRooms.find(c => c.classRoomId === currentBatch.classRoomId)?.classRoomName ?? '-';

    /* ---------- HANDLERS ---------- */
    const handleSave = async () => {
        const dto = {
            startTime: form.startTime ? form.startTime + ':00' : null,
            trainerId: Number(form.trainerId),
            classRoomId: Number(form.classRoomId),
            isActive: form.isActive
        };

        const ok = await handleUpdateBatch(batchId, dto);

        if (ok) {
            // refresh latest data
            dispatch(fetchBatchById(batchId));
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        if (!currentBatch) return;

        setForm({
            startTime: currentBatch.startTime?.slice(0, 5) ?? '',
            trainerId: String(currentBatch.trainerId ?? ''),
            classRoomId: String(currentBatch.classRoomId ?? ''),
            isActive: currentBatch.isActive
        });

        setIsEditing(false);
    };

    return (
        <Grid container spacing={3}>
            {/* =====================================================
                LEFT PANEL — VIEW / EDIT
            ====================================================== */}
            <Grid size={{ xs: 12, md: 8 }}>
                <Paper sx={{ p: 3 }}>
                    {/* HEADER */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h5" fontWeight={600}>
                            {currentBatch.batchCode}
                        </Typography>
                        <Typography color="text.secondary">
                            {currentBatch.moduleName}
                        </Typography>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {!isEditing ? (
                        <>
                            {/* BASIC INFO */}
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                BASIC INFORMATION
                            </Typography>

                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid size={{ xs: 12, sm: 3 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Trainer
                                    </Typography>
                                    <Typography>{trainerName}</Typography>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 3 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Classroom
                                    </Typography>
                                    <Typography>{classRoomName}</Typography>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 3 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Total Hrs Duration
                                    </Typography>
                                    <Typography>
                                        {currentBatch.batchDurationInHr} hours
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 3 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Start Time
                                    </Typography>
                                    <Typography fontWeight={500}>
                                        {currentBatch.startTime ?? '-'}
                                    </Typography>
                                </Grid>                        


                            </Grid>

                            <Divider sx={{ mb: 3 }} />

                            {/* SCHEDULE */}
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                SCHEDULE
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 3 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Start Date
                                    </Typography>
                                    <Typography>{formatDate(currentBatch.startDate)}</Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 3 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Actual Start Date
                                    </Typography>
                                    <Typography>
                                        {formatDate(currentBatch.actualStartDate)}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 3 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        End Date
                                    </Typography>
                                    <Typography>{formatDate(currentBatch.endDate)}</Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 3 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Actual End Date
                                    </Typography>
                                    <Typography>
                                        {formatDate(currentBatch.actualEndDate)}
                                    </Typography>
                                </Grid>                                
                            </Grid>
                        </>
                    ) : (
                        <>
                            {/* EDIT MODE */}
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                                EDIT BATCH
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        type="time"
                                        label="Start Time"
                                        value={form.startTime}
                                        onChange={e =>
                                            setForm(prev => ({ ...prev, startTime: e.target.value }))
                                        }
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        select
                                        fullWidth
                                        size="small"
                                        label="Trainer"
                                        value={form.trainerId}
                                        onChange={e =>
                                            setForm(prev => ({ ...prev, trainerId: e.target.value }))
                                        }
                                    >
                                        {staffList.map(t => (
                                            <MenuItem key={t.staffId} value={t.staffId}>
                                                {t.firstName} {t.lastName}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        select
                                        fullWidth
                                        size="small"
                                        label="Classroom"
                                        value={form.classRoomId}
                                        onChange={e =>
                                            setForm(prev => ({ ...prev, classRoomId: e.target.value }))
                                        }
                                    >
                                        {classRooms.map(c => (
                                            <MenuItem key={c.classRoomId} value={c.classRoomId}>
                                                {c.classRoomName}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={form.isActive}
                                                onChange={e =>
                                                    setForm(prev => ({
                                                        ...prev,
                                                        isActive: e.target.checked
                                                    }))
                                                }
                                            />
                                        }
                                        label={form.isActive ? 'Active' : 'Inactive'}
                                    />
                                </Grid>
                            </Grid>
                        </>
                    )}
                </Paper>
            </Grid>

            {/* =====================================================
                RIGHT PANEL — ACTIONS
            ====================================================== */}
            <Grid size={{ xs: 12, md: 4 }}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6">Actions</Typography>

                    <Stack spacing={2} sx={{ my: 3 }}>
                        {!isEditing ? (
                            <>
                            {/* <Button
                                variant="contained"
                                startIcon={<Edit />}
                                disabled={isBatchStarted}
                                onClick={() => setIsEditing(true)}
                            >
                                Edit Batch
                            </Button> */}

                                <Tooltip
                                    title={
                                        isBatchStarted
                                            ? 'Batch has already started. Editing is locked.'
                                            : ''
                                    }
                                >
                                    <span>
                                        <Button
                                            variant="contained"
                                            startIcon={<Edit />}
                                            disabled={isBatchStarted}
                                            onClick={() => setIsEditing(true)}
                                            color="inherit"
                                            sx={{
                                                bgcolor: isBatchStarted ? 'grey.300' : 'primary.main',
                                                color: isBatchStarted ? 'grey.700' : 'primary.contrastText',
                                                '&.Mui-disabled': {
                                                    bgcolor: 'grey.300',
                                                    color: 'grey.600'
                                                }
                                            }}
                                        >
                                            Edit Batch
                                        </Button>
                                    </span>
                                </Tooltip>

                            </>
                        ) : (
                            <>
                                    <Button
                                        variant="contained"
                                        startIcon={<Save />}
                                        onClick={handleSave}
                                    >
                                        Save Changes
                                    </Button>


                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    startIcon={<Close />}
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                            </>
                        )}
                    </Stack>

                    <Divider />

                    <Stack spacing={1} sx={{ mt: 2 }}>
                        <Typography variant="body2">
                            Created: {formatDate(currentBatch.createdAt)}
                        </Typography>
                        <Typography variant="body2">
                            Updated:{' '}
                            {currentBatch.updatedAt
                                ? formatDate(currentBatch.updatedAt)
                                : (
                                    <Typography component="span" sx={{ color: 'warning.main', fontStyle: 'italic' }}>
                                        Not specified
                                    </Typography>
                                )}
                        </Typography>
                    </Stack>
                </Paper>
            </Grid>
        </Grid>
    );
}
