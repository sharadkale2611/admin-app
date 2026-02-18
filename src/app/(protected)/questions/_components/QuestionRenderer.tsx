"use client";

import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Box,
  Divider,
  IconButton,
} from "@mui/material";

import { Visibility, Edit, Delete } from "@mui/icons-material";
import Link from "next/link";

import type { Question } from "@/lib/features/question/questionTypes";

interface Props {
  question: Question;
  onDelete?: (id: number, title: string) => void;
}

export default function QuestionRenderer({
  question,
  onDelete,
}: Props) {
  const type = question.questionTypeName?.toUpperCase();

  /* ======================
     OPTIONS UI
  ====================== */
  const renderOptions = () => {
    if (!question.options?.length) return null;

    return (
      <Stack spacing={1} sx={{ mt: 2 }}>
        {question.options.map((opt: any) => (
          <Box
            key={opt.questionOptionId}
            sx={{
              p: 1,
              border: "1px solid #e0e0e0",
              borderRadius: 1,
              bgcolor: opt.isCorrect ? "#e8f5e9" : "transparent",
            }}
          >
            <Typography variant="body2">
              {opt.optionText}
            </Typography>
          </Box>
        ))}
      </Stack>
    );
  };

  /* ======================
     QUESTION TYPE UI
  ====================== */
  const renderByType = () => {
    // MCQ / TRUE FALSE
    if (type === "MCQ" || type === "TF" || type === "TRUE OR FALSE") {
      return (
        <>
          <Typography fontWeight={500}>
            {question.title}
          </Typography>
          {renderOptions()}
        </>
      );
    }

    // SHORT ANSWER
    if (type === "SHORT") {
      return (
        <Typography fontWeight={500}>
          {question.title}
        </Typography>
      );
    }

    // DEFAULT FALLBACK
    return (
      <Typography fontWeight={500}>
        {question.title}
      </Typography>
    );
  };

  return (
    <Card sx={{ width: "100%" }}>
      <CardContent>
        {/* ================= HEADER ROW ================= */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1 }}
        >
          {/* LEFT SIDE */}
          <Stack direction="row" spacing={1}>
            <Chip
              label={question.questionTypeName || "-"}
              size="small"
            />

            <Chip
              label={question.difficultyLevel}
              size="small"
              color={
                question.difficultyLevel === "EASY"
                  ? "success"
                  : question.difficultyLevel === "MEDIUM"
                  ? "warning"
                  : "error"
              }
            />
          </Stack>

          {/* RIGHT SIDE ACTIONS */}
          <Stack direction="row" spacing={1}>
            <Link href={`/questions/${question.questionId}`}>
              <IconButton size="small">
                <Visibility fontSize="small" />
              </IconButton>
            </Link>

            <Link href={`/questions/${question.questionId}/edit`}>
              <IconButton size="small">
                <Edit fontSize="small" />
              </IconButton>
            </Link>

            {onDelete && (
              <IconButton
                size="small"
                color="error"
                onClick={() =>
                  onDelete(
                    question.questionId,
                    question.title
                  )
                }
              >
                <Delete fontSize="small" />
              </IconButton>
            )}
          </Stack>
        </Stack>

        {/* ================= QUESTION BODY ================= */}
        {renderByType()}

        <Divider sx={{ my: 2 }} />

        {/* ================= FOOTER ================= */}
        <Typography variant="caption" color="text.secondary">
          Course: {question.courseName || "-"} | Module:{" "}
          {question.moduleName || "-"} | Marks:{" "}
          {question.marks}
        </Typography>
      </CardContent>
    </Card>
  );
}
