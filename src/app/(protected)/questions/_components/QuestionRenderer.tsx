"use client";

import React from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  IconButton,
  Divider,
} from "@mui/material";

import {
  Visibility,
  Edit,
  Delete,
} from "@mui/icons-material";

import Link from "next/link";
import { Question } from "@/lib/features/question/questionTypes";

interface Props {
  question: Question;
  onDelete?: (id: number, title: string) => void;
}

export default function QuestionRenderer({
  question,
  onDelete,
}: Props) {
  return (
    <Paper sx={{ p: 2, borderRadius: 2 }}>
      {/* ================= HEADER ================= */}
      <Box display="flex" justifyContent="space-between">
        <Box>
          <Typography fontWeight={600}>
            #{question.questionId} — {question.title}
          </Typography>

          {question.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              mt={0.5}
            >
              {question.description}
            </Typography>
          )}

          <Stack direction="row" spacing={1} mt={1}>
            <Chip
              label={question.questionTypeName}
              size="small"
            />
            <Chip
              label={question.difficultyLevel}
              size="small"
              color="success"
            />
            <Chip
              label={
                question.isActive ? "Active" : "Inactive"
              }
              size="small"
            />
          </Stack>
        </Box>

        <Stack direction="row">
          <Link href={`/questions/${question.questionId}`}>
            <IconButton size="small" color="primary">
              <Visibility />
            </IconButton>
          </Link>

          <Link
            href={`/questions/${question.questionId}/edit`}
          >
            <IconButton size="small" color="secondary">
              <Edit />
            </IconButton>
          </Link>

          <IconButton
            size="small"
            color="error"
            onClick={() =>
              onDelete?.(
                question.questionId,
                question.title
              )
            }
          >
            <Delete />
          </IconButton>
        </Stack>
      </Box>

     {/* ================= ATTACHMENTS ================= */}
{question.attachments?.length ? (
  <>
    <Divider sx={{ my: 2 }} />

    <Typography fontWeight={500}>
      Attachments
    </Typography>

    <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
      {question.attachments.map((att, index) => (
        <a
          key={att.questionAttachmentId}
          href={att.uploadMediaPath}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <Paper
            variant="outlined"
            sx={{
              px: 1.5,
              py: 0.5,
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            📎
            <Typography variant="body2">
              Attachment {index + 1}
            </Typography>
          </Paper>
        </a>
      ))}
    </Stack>
  </>
) : null}


      {/* ================= OPTIONS ================= */}
      {question.options?.length ? (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography fontWeight={500}>
            Options
          </Typography>

          <Stack spacing={1} mt={1}>
            {question.options.map((opt) => (
              <Box
                key={opt.optionId}
                sx={{
                  border: "1px solid #eee",
                  borderRadius: 2,
                  p: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Stack direction="row" spacing={1}>
                  {/* radio dot style */}
                  <Box
                    sx={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      border: "2px solid #999",
                      backgroundColor: opt.isCorrect
                        ? "green"
                        : "transparent",
                      mt: "4px",
                    }}
                  />

                  <Typography>{opt.optionText}</Typography>
                </Stack>

                {opt.isCorrect && (
                  <Chip
                    label="Correct"
                    size="small"
                    color="success"
                  />
                )}
              </Box>
            ))}
          </Stack>
        </>
      ) : null}

      {/* ================= ANSWERS ================= */}
      {question.answers?.length ? (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography fontWeight={500}>
            Answers
          </Typography>

          {question.answers.map((ans) => (
            <Typography
              key={ans.questionAnswerId}
              variant="body2"
            >
              Answer: {ans.answerText}
            </Typography>
          ))}
        </>
      ) : null}

      {/* ================= FOOTER ================= */}
      <Divider sx={{ my: 2 }} />

      <Typography variant="caption" color="text.secondary">
        Course: {question.courseName || "-"} | Module:{" "}
        {question.moduleName || "-"} | Marks:{" "}
        {question.marks}
      </Typography>
    </Paper>
  );
}
