'use client';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
} from '@mui/material';
import { useState } from 'react';

interface AttendanceOverrideDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
}

export default function AttendanceOverrideDialog({
    open,
    onClose,
    onConfirm,
}: AttendanceOverrideDialogProps) {
    const [reason, setReason] = useState('');

    const handleConfirm = () => {
        onConfirm(reason);
        setReason('');
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>Override Attendance Lock</DialogTitle>

            <DialogContent>
                <Typography gutterBottom>
                    This attendance session is locked.
                    Please provide a reason to unlock and edit attendance.
                </Typography>

                <TextField
                    autoFocus
                    label="Reason"
                    placeholder="Required for audit"
                    fullWidth
                    required
                    multiline
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    sx={{ mt: 2 }}
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="warning"
                    disabled={!reason.trim()}
                    onClick={handleConfirm}
                >
                    Unlock Session
                </Button>
            </DialogActions>
        </Dialog>
    );
}
