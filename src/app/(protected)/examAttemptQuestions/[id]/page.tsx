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

import { useExamAttemptQuestionDetailsViewModel }
from "@/lib/features/examAttemptQuestion/useExamAttemptQuestionDetailsViewModel";


/* ===============================
   Error Renderer
================================ */

function renderErrorContent(error: any) {

  if (!error) return null;

  if (error.error)
    return <div>{error.error}</div>;

  return null;

}


/* ===============================
   Status Chip
================================ */

function getEvaluationChip(isEvaluated: boolean) {

  return isEvaluated
    ? (
      <Chip
        label="Evaluated"
        color="success"
        size="small"
      />
    )
    : (
      <Chip
        label="Pending"
        color="warning"
        size="small"
      />
    );

}


/* ===============================
   Page
================================ */

export default function ExamAttemptQuestionDetailsPage() {

  const params = useParams();

  const id = params?.id as string;


  const {

    attemptQuestion,

    isLoading,

    error,

  } =
    useExamAttemptQuestionDetailsViewModel(id);


  /* Loading */

  if (isLoading || !attemptQuestion) {

    return (

      <Container maxWidth="md" sx={{ mt: 4 }}>

        <Skeleton height={40} />

        <Skeleton height={200} />

      </Container>

    );

  }


  return (

    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>


      {/* Header */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
        }}
      >

        <Button
          component={Link}
          href="/examAttemptQuestions"
          startIcon={<ArrowBack />}
        >

          Back

        </Button>


        <Button
          component={Link}
          href={`/examAttemptQuestions/${id}/edit`}
          variant="contained"
          startIcon={<Edit />}
        >

          Edit

        </Button>


      </Box>



      {/* Error */}

      {error && (

        <Alert severity="error" sx={{ mb: 2 }}>

          {renderErrorContent(error)}

        </Alert>

      )}



      {/* Card */}

      <Card>

        <CardContent>


          {/* Title */}

          <Typography variant="h5" gutterBottom>

            Attempt Question Details

          </Typography>


          <Divider sx={{ mb: 2 }} />


          <Grid container spacing={2}>


            {/* ID */}

            <Grid size={{ xs: 12 }}>

              <Typography variant="body2" color="text.secondary">

                Attempt Question ID

              </Typography>

              <Typography variant="body1">

                #{attemptQuestion.attemptQuestionId}

              </Typography>

            </Grid>



            {/* Attempt */}

            <Grid size={{ xs: 12 }}>

              <Typography variant="body2" color="text.secondary">

                Exam Attempt

              </Typography>

              <Typography variant="body1">

                #{attemptQuestion.examAttemptId}

              </Typography>

            </Grid>



            {/* Question */}

            <Grid size={{ xs: 12 }}>

              <Typography variant="body2" color="text.secondary">

                Question

              </Typography>

              <Typography variant="body1">

                {attemptQuestion.questionTitle
                  || `#${attemptQuestion.questionId}`}

              </Typography>

            </Grid>



            {/* Question Type */}

            <Grid size={{ xs: 12 }}>

              <Typography variant="body2" color="text.secondary">

                Question Type

              </Typography>

              <Typography variant="body1">

                {attemptQuestion.questionTypeName
                  || `#${attemptQuestion.questionTypeId}`}

              </Typography>

            </Grid>



            {/* Marks */}

            <Grid size={{ xs: 12 }}>

              <Typography variant="body2" color="text.secondary">

                Marks Assigned

              </Typography>

              <Typography variant="body1">

                {attemptQuestion.marksAssigned ?? "—"}

              </Typography>

            </Grid>



            {/* Max Marks */}

            <Grid size={{ xs: 12 }}>

              <Typography variant="body2" color="text.secondary">

                Max Marks

              </Typography>

              <Typography variant="body1">

                {attemptQuestion.maxMarks}

              </Typography>

            </Grid>



            {/* Status */}

            <Grid size={{ xs: 12 }}>

              <Typography variant="body2" color="text.secondary">

                Evaluation Status

              </Typography>

              <Stack direction="row" sx={{ mt: 0.5 }}>

                {getEvaluationChip(
                  attemptQuestion.isEvaluated
                )}

              </Stack>

            </Grid>


          </Grid>


        </CardContent>

      </Card>


    </Container>

  );

}
