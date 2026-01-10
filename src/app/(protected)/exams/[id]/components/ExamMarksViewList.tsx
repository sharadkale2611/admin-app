import { Box, Typography, Paper, Divider } from "@mui/material";

type Props = {
    students: any[];
    existingMarks: Record<number, { markObtained: number }>;
};

export function ExamMarksViewList({ students, existingMarks }: Props) {
    return (
        <Paper variant="outlined">
            {students.map((s, index) => {
                const mark = existingMarks[s.studentId]?.markObtained;

                return (
                    <Box key={s.studentId}>
                        <Box
                            display="grid"
                            gridTemplateColumns="1fr auto"
                            alignItems="center"
                            px={2}
                            py={1.5}
                        >
                            {/* Left */}
                            <Box>
                                <Typography fontWeight={500}>
                                    {s.studentName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {s.studentCode} • {s.batchCode}
                                </Typography>
                            </Box>

                            {/* Right */}
                            <Typography
                                fontWeight={600}
                                color={mark !== undefined ? "success.main" : "text.disabled"}
                            >
                                {mark !== undefined ? `${mark}` : "—"}
                            </Typography>
                        </Box>

                        {index < students.length - 1 && <Divider />}
                    </Box>
                );
            })}
        </Paper>
    );
}
