import React from 'react'

function page() {
  return (
    <div>
      testing
    </div>
  )
}

export default page

/*
"use client";
// src/app/(auth)/login/LoginPage.tsx

import { useLoginViewModel } from "@/lib/features/auth/useLoginViewModel";
import { useAppSelector } from "@/lib/hooks";
import {
    Box,
    Container,
    TextField,
    Button,
    Typography,
    CircularProgress,
    Alert,
    Paper,
    IconButton,
    InputAdornment,
    useTheme,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import AnimatedEducationBackground from "../components/ui/AnimatedEducationBackground";

export default function LoginPage() {
    const { handleSubmit, loading, error, validationErrors } =
        useLoginViewModel();

    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const router = useRouter();
    const searchParams = useSearchParams();

    const {
        isAuthenticated,
        isAuthChecking,
        initialCheckDone,
        hasLoggedOut,
    } = useAppSelector((state) => state.auth);

    const [mounted, setMounted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (!mounted) return;
        if (isAuthenticated && !hasLoggedOut) {
            router.replace(searchParams?.get("redirect") || "/dashboard");
        }
    }, [mounted, isAuthenticated, hasLoggedOut, router, searchParams]);

    const readyForAnimation =
        mounted && initialCheckDone && !isAuthChecking;

    useLayoutEffect(() => {
        if (!readyForAnimation || !cardRef.current) return;

        gsap.fromTo(
            cardRef.current,
            { opacity: 0, y: 32 },
            {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: "power3.out",
            }
        );
    }, [readyForAnimation]);

    if (!initialCheckDone || isAuthChecking || !mounted) {
        return (
            <Box height="100vh" display="flex" alignItems="center" justifyContent="center">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Suspense fallback={<div />}>
        <Box
            sx={{
                minHeight: "100vh",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isDark
                    ? "linear-gradient(135deg, #020617, #020617)"
                    : "linear-gradient(135deg, #f8fafc, #eef2ff)",
            }}
        >
            {/* 🔥 Animated Background * /}
            <AnimatedEducationBackground />

            {/* Login Card * /}
            <Container maxWidth="sm" sx={{ zIndex: 1 }}>
                <Paper
                    ref={cardRef}
                    elevation={isDark ? 18 : 10}
                    sx={{
                        p: { xs: 3, sm: 4 },
                        borderRadius: 3,
                        backdropFilter: "blur(14px)",
                        backgroundColor: isDark
                            ? "rgba(2,6,23,0.92)"
                            : "rgba(255, 255, 255, 0.811)",
                    }}
                >
                    <Typography variant="h5" fontWeight={700} textAlign="center">
                        Revolution Science Academy
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        textAlign="center"
                        mt={0.5}
                        mb={3}
                    >
                        Institute Management Portal
                    </Typography>

                    {validationErrors.length > 0 && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            <ul style={{ margin: 0, paddingLeft: 18 }}>
                                {validationErrors.map((err, i) => (
                                    <li key={i}>{err}</li>
                                ))}
                            </ul>
                        </Alert>
                    )}

                    {error?.message && !validationErrors.length && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error.message}
                        </Alert>
                    )}

                    <Box
                        component="form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            handleSubmit({
                                username: formData.get("username") as string,
                                password: formData.get("password") as string,
                            });
                        }}
                    >
                        <TextField
                            label="Username"
                            name="username"
                            fullWidth
                            required
                            margin="normal"
                        />

                        <TextField
                            label="Password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            fullWidth
                            required
                            margin="normal"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword((v) => !v)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            size="large"
                            variant="contained"
                            disabled={loading}
                            sx={{
                                mt: 3,
                                py: 1.4,
                                fontWeight: 600,
                                borderRadius: 2,
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </Box>

                    <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        textAlign="center"
                        mt={3}
                    >
                        © {new Date().getFullYear()} Revolution Science Academy
                    </Typography>
                </Paper>
            </Container>
        </Box>
        </Suspense>
    );
}

*/