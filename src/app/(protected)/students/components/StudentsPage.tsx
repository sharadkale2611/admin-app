'use client';

import React, { useState } from "react";
import {
    Container,
    Typography,
    Box,
    Paper,
    Grid,
    Button,
    Slide
} from "@mui/material";
import { Add } from "@mui/icons-material";

import StudentsTable from "./StudentsTable";
import CreateStudentForm from "./CreateStudentForm";

export default function StudentsPage() {
    const [showCreate, setShowCreate] = useState(false);

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {/* HEADER */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3
                }}
            >
                <Typography variant="h4">Students</Typography>

                {/* <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setShowCreate(true)}
                    disabled={showCreate}
                >
                    Add Student
                </Button> */}
            </Box>

            <Grid container spacing={3}>
                {/* LEFT : STUDENT LIST */}
                <Grid size={{ xs: 12, md: showCreate ? 8 : 12 }}>
                    <StudentsTable />
                </Grid>

                {/* RIGHT : CREATE FORM */}
                <Slide direction="left" in={showCreate} mountOnEnter unmountOnExit>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <CreateStudentForm onCancel={() => setShowCreate(false)} />
                    </Grid>
                </Slide>
            </Grid>
        </Container>
    );
}
