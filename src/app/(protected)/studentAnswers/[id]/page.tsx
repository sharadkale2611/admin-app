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

  Avatar,

} from "@mui/material";

import Link from "next/link";

import {

  ArrowBack,

  Edit,

  Image as ImageIcon,

  PictureAsPdf,

  Event,

  ToggleOn,

  Quiz,

  Grade,

} from "@mui/icons-material";


import {

  useStudentAnswerDetailsViewModel,

} from "@/lib/features/studentAnswer/useStudentAnswerDetailsViewModel";



export default function StudentAnswerDetailsPage() {

  const { id } = useParams();


  const {

    studentAnswer,

    isLoading,

    error,

  } =
    useStudentAnswerDetailsViewModel(
      id as string
    );



  /* ===============================
     Helpers
  ================================ */

  const formatDate = (
    dateString:
      | string
      | null
      | undefined
  ) => {

    if (!dateString)
      return "Not specified";

    return new Date(
      dateString
    ).toLocaleDateString(
      "en-US",
      {

        year: "numeric",

        month: "short",

        day: "numeric",

      }
    );

  };


  const isImage = (
    path?: string | null
  ) =>
    path
      ? /\.(jpg|jpeg|png|webp)$/i.test(
          path
        )
      : false;



  /* ===============================
     Loading
  ================================ */

  if (isLoading)

    return (

      <Container sx={{ mt: 4 }}>

        <Skeleton
          variant="rectangular"
          width="100%"
          height={400}
        />

      </Container>

    );



  /* ===============================
     Error
  ================================ */

  if (error)

    return (

      <Container sx={{ mt: 4 }}>

        <Alert severity="error">

          Failed to load student answer

        </Alert>

      </Container>

    );



  /* ===============================
     Not Found
  ================================ */

  if (!studentAnswer)

    return (

      <Container sx={{ mt: 4 }}>

        <Alert severity="warning">

          Student answer not found

        </Alert>

      </Container>

    );



  /* ===============================
     Page
  ================================ */

  return (

    <Container
      maxWidth="lg"
      sx={{ mt: 4, mb: 4 }}
    >



      {/* Header */}

      <Box

        sx={{

          display: "flex",

          justifyContent:
            "space-between",

          mb: 4,

        }}

      >

        <Box>

          <Link href="/studentAnswers">

            <Button
              startIcon={
                <ArrowBack />
              }
            >

              Back

            </Button>

          </Link>

          <Typography variant="h4">

            Student Answer Details

          </Typography>

        </Box>



        <Chip

          label={
            studentAnswer.isCorrect
              ? "Correct"
              : "Incorrect"
          }

          color={
            studentAnswer.isCorrect
              ? "success"
              : "error"
          }

        />

      </Box>



      <Grid container spacing={3}>


        {/* Left Card */}

        <Grid size={{ xs: 12, md: 4 }}>

          <Paper sx={{ p: 3 }}>

            {studentAnswer.uploadedFilePath ? (

              isImage(
                studentAnswer.uploadedFilePath
              ) ? (

                <Avatar

                  src={
                    studentAnswer.uploadedFilePath
                  }

                  variant="rounded"

                  sx={{

                    width: 140,

                    height: 140,

                    mb: 2,

                  }}

                />

              ) : (

                <PictureAsPdf
                  sx={{
                    fontSize: 100,
                  }}
                />

              )

            ) : (

              <ImageIcon
                sx={{
                  fontSize: 100,
                }}
              />

            )}



            <Typography variant="h6">

              Answer #
              {
                studentAnswer.studentAnswerId
              }

            </Typography>



            <Divider sx={{ my: 2 }} />



            <Stack spacing={1}>

              <Box sx={{ display: "flex", gap: 1 }}>

                <Quiz fontSize="small" />

                <Typography>

                  Attempt Question:
                  {
                    studentAnswer.attemptQuestionId
                  }

                </Typography>

              </Box>



              <Box sx={{ display: "flex", gap: 1 }}>

                <Grade fontSize="small" />

                <Typography>

                  Score:
                  {
                    studentAnswer.score ??
                    "Not graded"
                  }

                </Typography>

              </Box>



              <Box sx={{ display: "flex", gap: 1 }}>

                <Event fontSize="small" />

                <Typography>

                  Evaluated:
                  {
                    formatDate(
                      studentAnswer.evaluatedAt
                    )
                  }

                </Typography>

              </Box>



            </Stack>



            <Box sx={{ mt: 3 }}>

              <Link
                href={`/studentAnswers/${id}/edit`}
              >

                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  fullWidth
                >

                  Edit Answer

                </Button>

              </Link>

            </Box>

          </Paper>

        </Grid>



        {/* Right Card */}

        <Grid size={{ xs: 12, md: 8 }}>

          <Card>

            <CardContent>

              <Typography variant="h6">

                Answer Information

              </Typography>



              <Divider sx={{ my: 2 }} />



              <Typography variant="subtitle2">

                Answer Text

              </Typography>

              <Typography>

                {
                  studentAnswer.answerText ??
                  "No text answer"
                }

              </Typography>



              <Divider sx={{ my: 2 }} />



              <Typography variant="subtitle2">

                Selected Options

              </Typography>

              <Typography>

                {
                  studentAnswer.selectedOptionIds ??
                  "None"
                }

              </Typography>



              <Divider sx={{ my: 2 }} />



              <Typography variant="subtitle2">

                File

              </Typography>

              <Typography>

                {
                  studentAnswer.uploadedFilePath ??
                  "No file"
                }

              </Typography>



            </CardContent>

          </Card>

        </Grid>



      </Grid>



    </Container>

  );

}
