"use client";

import React from "react";

import { useParams } from "next/navigation";

import {
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Box,
  Paper,
  Grid,
  Skeleton,
  Alert,
  Divider,
  Stack,
} from "@mui/material";

import Link from "next/link";

import {
  ArrowBack,
  Edit,
} from "@mui/icons-material";

import { useExamAttemptDetailsViewModel }
from "@/lib/features/examAttempt/useExamAttemptDetailsViewModel";

import { ApiError }
from "@/lib/features/examAttempt/examAttemptTypes";

/* ===============================
   Error Renderer
================================ */

function renderErrorContent(
  error: ApiError | null
) {

  if (!error) return null;

  if (error.error) {

    return <div>{error.error}</div>;

  }

  if (error.errors) {

    return Object.entries(
      error.errors
    ).map(([key, value], i) => (

      <div key={i}>

        <strong>{key}:</strong>{" "}

        {Array.isArray(value)
          ? value.join(", ")
          : value}

      </div>

    ));

  }

  return null;

}


/* ===============================
   Status Chip
================================ */

function getStatusChip(status: string) {

  switch (status) {

    case "IN_PROGRESS":

      return (
        <Chip
          label="In Progress"
          color="warning"
        />
      );

    case "SUBMITTED":

      return (
        <Chip
          label="Submitted"
          color="info"
        />
      );

    case "EVALUATED":

      return (
        <Chip
          label="Evaluated"
          color="success"
        />
      );

    default:

      return (
        <Chip label={status} />
      );

  }

}


/* ===============================
   Page
================================ */

export default function ExamAttemptDetailsPage() {

  const params =
    useParams();

  const id =
    params?.id?.toString() ||
    "";

  const {

    attempt,

    isLoading,

    error,

  } =
    useExamAttemptDetailsViewModel(
      id
    );


  const formatDate =
    (
      date?: string | null
    ) => {

      if (!date)
        return "—";

      return new Date(
        date
      ).toLocaleString();

    };


  return (

    <Container
      maxWidth="md"
      sx={{
        mt: 4,
        mb: 4,
      }}
    >


      {/* Header */}

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >

        <Box>

          <Typography variant="h4">

            Exam Attempt Details

          </Typography>

          <Typography
            color="text.secondary"
          >

            View exam attempt information

          </Typography>

        </Box>


        <Stack
          direction="row"
          spacing={1}
        >

          <Link
            href="/examAttempts"
            passHref
          >

            <Button
              startIcon={
                <ArrowBack />
              }
            >
              Back
            </Button>

          </Link>


          {attempt && (

            <Link
              href={`/examAttempts/${attempt.examAttemptId}/edit`}
              passHref
            >

              <Button
                variant="contained"
                startIcon={<Edit />}
              >

                Edit

              </Button>

            </Link>

          )}

        </Stack>

      </Stack>



      {/* Error */}

      {error && (

        <Alert severity="error">

          {renderErrorContent(
            error
          )}

        </Alert>

      )}



      {/* Loading */}

      {isLoading && (

        <Card>

          <CardContent>

            <Skeleton height={40} />

            <Skeleton height={30} />

            <Skeleton height={30} />

            <Skeleton height={30} />

          </CardContent>

        </Card>

      )}



      {/* Content */}

      {attempt && (

        <Card>

          <CardContent>

            <Grid
              container
              spacing={2}
            >


              {/* Attempt ID */}

              <Grid
                size={{
                  xs: 12,
                }}
              >

                <Typography
                  variant="h6"
                >

                  Attempt #
                  {
                    attempt.examAttemptId
                  }

                </Typography>

                <Divider
                  sx={{
                    mt: 1,
                    mb: 2,
                  }}
                />

              </Grid>



              {/* Student */}

              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >

                <Typography
                  color="text.secondary"
                >

                  Student

                </Typography>

                <Typography>

                  {
                    attempt.studentName ||
                    attempt.studentId
                  }

                </Typography>

              </Grid>



              {/* Exam */}

              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >

                <Typography
                  color="text.secondary"
                >

                  Exam Paper

                </Typography>

                <Typography>

                  {
                    attempt.examPaperName ||
                    attempt.examPaperId
                  }

                </Typography>

              </Grid>



              {/* Attempt No */}

              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >

                <Typography
                  color="text.secondary"
                >

                  Attempt No

                </Typography>

                <Typography>

                  {
                    attempt.attemptNo
                  }

                </Typography>

              </Grid>



              {/* Status */}

              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >

                <Typography
                  color="text.secondary"
                >

                  Status

                </Typography>

                <Box mt={1}>

                  {
                    getStatusChip(
                      attempt.status
                    )
                  }

                </Box>

              </Grid>



              {/* Score */}

              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >

                <Typography
                  color="text.secondary"
                >

                  Score

                </Typography>

                <Typography>

                  {
                    attempt.totalScore ??
                    "—"
                  }

                </Typography>

              </Grid>



              {/* Started */}

              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >

                <Typography
                  color="text.secondary"
                >

                  Started At

                </Typography>

                <Typography>

                  {
                    formatDate(
                      attempt.startedAt
                    )
                  }

                </Typography>

              </Grid>



              {/* Submitted */}

              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >

                <Typography
                  color="text.secondary"
                >

                  Submitted At

                </Typography>

                <Typography>

                  {
                    formatDate(
                      attempt.submittedAt
                    )
                  }

                </Typography>

              </Grid>


            </Grid>

          </CardContent>

        </Card>

      )}


    </Container>

  );

}
