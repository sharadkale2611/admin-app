'use client';

import {
    Box,
    Button,
    Stack,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';
import { useState } from 'react';

interface AttendanceSaveBarProps {
    open: boolean;
    modifiedCount: number;
    onSave: (note: string) => void;
    onDiscard: () => void;
}

export default function AttendanceSaveBar({
    open,
    modifiedCount,
    onSave,
    onDiscard,
}: AttendanceSaveBarProps) {
    const [reason, setReason] = useState('');
    const [confirmOpen, setConfirmOpen] = useState(false);

    if (!open) return null;

    const handleConfirmSave = () => {
        onSave(reason);
        setReason('');
        setConfirmOpen(false);
    };

    return (
        <>
            {/* ================= SAVE BAR ================= */}
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 20,
                    bgcolor: 'background.paper',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    px: 3,
                    py: 1.5,
                }}
            >
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    spacing={1.5}
                >
                    <Typography fontWeight={600}>
                        ⚠ {modifiedCount} unsaved change(s)
                    </Typography>

                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="contained"
                            onClick={() => setConfirmOpen(true)}
                        >
                            Save Changes
                        </Button>
                        <Button variant="outlined" onClick={onDiscard}>
                            Discard
                        </Button>
                    </Stack>
                </Stack>
            </Box>

            {/* ================= CONFIRM MODAL ================= */}
            <Dialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Confirm Attendance Update</DialogTitle>

                <DialogContent>
                    <Typography gutterBottom>
                        You are about to save <b>{modifiedCount}</b>{' '}
                        change(s).
                    </Typography>

                    <TextField
                        label="Note (optional)"
                        placeholder="Add a note (optional)"
                        fullWidth
                        multiline
                        rows={3}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleConfirmSave}
                    >
                        Confirm Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
