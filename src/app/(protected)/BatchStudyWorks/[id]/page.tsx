"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

import {
  Container,
  Typography,
  Card,
  CardContent,
  Divider,
  Chip,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Paper,
  Stack,
} from "@mui/material";

import { Edit, ArrowBack } from "@mui/icons-material";
import Link from "next/link";

import { useBatchStudyWorksDetailsViewModel } from "@/lib/features/BatchStudyWorks/useBatchStudyWorksDetailsViewModel";

export default function BatchStudyWorkDetails() {
  const search = useSearchParams();
  const id = search.get("id"); // <-- Read query param

  const workId = Number(id);

  const { batchStudyWork, isLoading, error } =
    useBatchStudyWorksDetailsViewModel(workId);

  if (!id || isNaN(workId)) {
    return <Container sx={{ mt: 4 }}>Invalid ID</Container>;
  }

  if (isLoading)
    return <Container sx={{ mt: 4 }}>Loading batch study work...</Container>;

  if (error)
    return (
      <Container sx={{ mt: 4, color: "error.main" }}>Error: {error}</Container>
    );

  if (!batchStudyWork)
    return <Container sx={{ mt: 4 }}>Data not found.</Container>;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
        <Link href="/BatchStudyWorks">
          <Button startIcon={<ArrowBack />}>Back</Button>
        </Link>

        <Typography variant="h4">{batchStudyWork.workTitle}</Typography>

        <Chip
          label={batchStudyWork.isActive ? "Active" : "Inactive"}
          color={batchStudyWork.isActive ? "success" : "error"}
          sx={{ ml: "auto" }}
        />
      </Box>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Work Type
              </Typography>
              <Typography>{batchStudyWork.workType}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Batch
              </Typography>
              <Typography>
                {batchStudyWork.batchCode ?? "Not Assigned"}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Expected Completion
              </Typography>
              <Typography>
                {batchStudyWork.expectedCompletionDate ?? "No Deadline Set"}
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Description
              </Typography>
              <Typography>
                {batchStudyWork.workDescription || "No description provided"}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Assigned By
        </Typography>

        {batchStudyWork.assignedByName ? (
          <List>
            <ListItem>
              <Avatar sx={{ mr: 2 }}>
                {batchStudyWork.assignedByName.charAt(0)}
              </Avatar>
              <ListItemText
                primary={batchStudyWork.assignedByName}
                secondary={`Staff ID: ${batchStudyWork.assignedBy}`}
              />
            </ListItem>
          </List>
        ) : (
          <Typography>No staff assigned.</Typography>
        )}
      </Paper>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
        <Link href={`/BatchStudyWorks/${workId}/edit`}>
          <Button variant="contained" startIcon={<Edit />}>
            Edit Work
          </Button>
        </Link>
      </Box>
    </Container>
  );
}
