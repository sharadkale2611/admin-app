"use client";

import React from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Box,
  Paper,
  Skeleton,
  Alert,
  Divider,
} from "@mui/material";

import Link from "next/link";
import { ArrowBack, Edit, Business, Code } from "@mui/icons-material";
import { useParams } from "next/navigation";
import { useFirmDetailsViewModel } from "@/lib/features/firm/useFirmDetailsViewModel";

export default function FirmDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const { firm, isLoading, error } = useFirmDetailsViewModel(id);

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Skeleton variant="rectangular" width="100%" height={300} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          component={Link}
          href="/firms"
          startIcon={<ArrowBack />}
          variant="outlined"
        >
          Back to Firms List
        </Button>
      </Container>
    );
  }

  if (!firm) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Firm not found
        </Alert>
        <Button
          component={Link}
          href="/firms"
          startIcon={<ArrowBack />}
          variant="outlined"
        >
          Back to Firms List
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            component={Link}
            href="/firms"
            startIcon={<ArrowBack />}
            variant="outlined"
            size="small"
          >
            Back
          </Button>
          <Typography variant="h4">Firm Details</Typography>
        </Box>

        <Chip
          label={firm.isActive ? "Active" : "Inactive"}
          color={firm.isActive ? "success" : "error"}
          variant="filled"
        />
      </Box>

      {/* FLEX LAYOUT (replaces Grid) */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        {/* LEFT CARD */}
        <Box sx={{ flexBasis: { xs: "100%", md: "30%" } }}>
          <Paper sx={{ p: 3, textAlign: "center" }} elevation={2}>
            <Business
              sx={{
                width: 80,
                height: 80,
                margin: "auto",
                mb: 2,
                color: "primary.main",
              }}
            />

            <Typography variant="h5" gutterBottom>
              {firm.firmName}
            </Typography>

            <Typography variant="body1" color="secondary">
              {firm.firmCode}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mt: 3 }}>
              <Button
                component={Link}
                href={`/firms/${firm.firmId}/edit`}
                variant="contained"
                startIcon={<Edit />}
                fullWidth
              >
                Edit Firm
              </Button>
            </Box>
          </Paper>
        </Box>

        {/* RIGHT CARD */}
        <Box sx={{ flexBasis: { xs: "100%", md: "70%" } }}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Firm Information
              </Typography>

              {/* MANUAL FLEX ROWS */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Firm Code */}
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Code fontSize="small" color="primary" />
                    <Typography variant="subtitle2">Firm Code</Typography>
                  </Box>
                  <Typography variant="body1">{firm.firmCode}</Typography>
                </Box>

                {/* Status */}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Typography variant="body1">
                    {firm.isActive ? "Active" : "Inactive"}
                  </Typography>
                </Box>

                {/* Firm ID */}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Firm ID
                  </Typography>
                  <Typography variant="body1">{firm.firmId}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
}
