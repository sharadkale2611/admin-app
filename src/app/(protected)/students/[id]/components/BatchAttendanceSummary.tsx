import {
    Paper,
    Typography,
    Divider,
    Grid,
    Chip,
} from '@mui/material';

type Props = {
    sessions: {
        sessionId: number;
        attendances: {
            status: 'Present' | 'Absent' | 'Leave' | 'Pending';
        }[];
    }[];
};

export default function BatchAttendanceSummary({ sessions }: Props) {
    const summary = calculateBatchAttendanceSummary(sessions);

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6">
                Batch Attendance Summary
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                    <SummaryItem
                        label="Total Sessions"
                        value={summary.totalSessions}
                    />
                </Grid>

                <Grid size={{ xs: 6 }}>
                    <SummaryChip
                        label="Present"
                        value={summary.present}
                        color="success"
                    />
                </Grid>

                <Grid size={{ xs: 6 }}>
                    <SummaryChip
                        label="Absent"
                        value={summary.absent}
                        color="error"
                    />
                </Grid>

                <Grid size={{ xs: 6 }}>
                    <SummaryChip
                        label="Leave"
                        value={summary.leave}
                        color="warning"
                    />
                </Grid>
            </Grid>
        </Paper>
    );
}

/* ================= HELPERS ================= */

function SummaryItem({
    label,
    value,
}: {
    label: string;
    value: number;
}) {
    return (
        <>
            <Typography variant="subtitle2" color="text.secondary">
                {label}
            </Typography>
            <Typography variant="body1">
                {value}
            </Typography>
        </>
    );
}

function SummaryChip({
    label,
    value,
    color,
}: {
    label: string;
    value: number;
    color: 'success' | 'error' | 'warning';
}) {
    return (
        <Chip
            label={`${label} : ${value}`}
            color={color}
            sx={{ width: '100%', justifyContent: 'flex-start' }}
        />
    );
}

/* ================= LOGIC ================= */

function calculateBatchAttendanceSummary(
    sessions: {
        attendances: { status: string }[];
    }[]
) {
    let present = 0;
    let absent = 0;
    let leave = 0;

    sessions.forEach(s =>
        s.attendances.forEach(a => {
            if (a.status === 'Present') present++;
            if (a.status === 'Absent') absent++;
            if (a.status === 'Leave') leave++;
        })
    );

    return {
        totalSessions: sessions.length,
        present,
        absent,
        leave,
    };
}
