import { Paper, Tab, Tabs } from "@mui/material";

// components/CourseTabs.tsx
export function CourseTabs({ value, onChange }: any) {
    return (
        <Paper sx={{ mb: 3 }}>
            <Tabs value={value} onChange={(_, v) => onChange(v)} scrollButtons="auto">
                <Tab label="Course Details" />
                <Tab label="Fees Details" />
                <Tab label="Course Modules" />
                <Tab label="Course Teacher" />
                <Tab label="Course Batches" />
            </Tabs>
        </Paper>
    );
}
