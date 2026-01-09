import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Divider,
} from "@mui/material";

type Props = {
    students: any[];
    marks: Record<number, string>;
    existingMarks: Record<number, any>;
    examTotalMarks: number;
    submitLoading: boolean;
    onMarkChange: (id: number, value: string) => void;
    onSubmit: () => void;
    onCancel: () => void;
};

export function ExamMarksEditForm({
    students,
    marks,
    existingMarks,
    examTotalMarks,
    submitLoading,
    onMarkChange,
    onSubmit,
    onCancel,
}: Props) {
    return (
        <Paper variant="outlined">
            {students.map((s, index) => (
                <Box key={s.studentId}>
                    <Box
                        display="grid"
                        gridTemplateColumns="1fr 160px"
                        alignItems="center"
                        gap={2}
                        px={2}
                        py={1.5}
                    >
                        <Box>
                            <Typography fontWeight={500}>
                                {s.studentName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {s.studentCode} • {s.batchCode}
                            </Typography>
                        </Box>

                        <TextField
                            size="small"
                            type="number"
                            value={marks[s.studentId] ?? ""}
                            onChange={(e) =>
                                onMarkChange(s.studentId, e.target.value)
                            }
                            inputProps={{ min: 0, max: examTotalMarks }}
                            placeholder="Marks"
                            fullWidth
                        />
                    </Box>

                    {index < students.length - 1 && <Divider />}
                </Box>
            ))}

            {/* Footer */}
            <Box
                display="flex"
                justifyContent="flex-end"
                gap={2}
                px={2}
                py={2}
                borderTop="1px solid"
                borderColor="divider"
            >
                <Button variant="text" onClick={onCancel}>
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={onSubmit}
                    disabled={submitLoading}
                >
                    {submitLoading ? "Saving..." : "Save Marks"}
                </Button>
            </Box>
        </Paper>
    );
}
