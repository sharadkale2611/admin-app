"use client";

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
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
    const { handleSubmit, loading, error, validationErrors } =
        useLoginViewModel();

    const router = useRouter();
    const searchParams = useSearchParams();

    const {
        isAuthenticated,
        isAuthChecking,
        initialCheckDone,
        hasLoggedOut,          // 🔥 FIX 1: READ IT
    } = useAppSelector(state => state.auth);

    console.log(
        'LoginPage:',
        'isAuthenticated =', isAuthenticated,
        'hasLoggedOut =', hasLoggedOut,
        'initialCheckDone =', initialCheckDone
    );

    // 🔥 FIX 2: block ONLY until auth check completes
    if (!initialCheckDone || isAuthChecking) {
        return (
            <Box height="100vh" display="flex" alignItems="center" justifyContent="center">
                <CircularProgress />
            </Box>
        );
    }

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        // 🔥 FIX 3: redirect ONLY after checkAuth finishes
        if (isAuthenticated && !hasLoggedOut) {
            router.replace(searchParams?.get("redirect") || "/dashboard");
        }
    }, [mounted, isAuthenticated, hasLoggedOut, router, searchParams]);

    if (!mounted) {
        return null;
    }

    // ❌ REMOVED: blocking login page based on isAuthenticated
    // Login page must always render once auth check is done

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `
                  linear-gradient(
                    rgba(15, 23, 42, 0.75),
                    rgba(15, 23, 42, 0.75)
                  ),
                  url("/images/institute-bg1.png")
                `,
                backgroundSize: "cover",
                backgroundPosition: "center",
                px: 2,
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={10}
                    sx={{
                        p: { xs: 3, sm: 4 },
                        borderRadius: 3,
                        backdropFilter: "blur(12px)",
                        backgroundColor: "rgba(255,255,255,0.92)",
                    }}
                >
                    <Box textAlign="center" mb={3}>
                        <Typography variant="h5" fontWeight={700} color="primary">
                            Revolution Science Academy
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mt={0.5}>
                            Institute Management Portal
                        </Typography>
                    </Box>

                    <Typography variant="h6" fontWeight={600} textAlign="center" mb={3}>
                        Sign in to your account
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
                            autoComplete="username"
                            margin="normal"
                        />

                        <TextField
                            label="Password"
                            name="password"
                            type="password"
                            fullWidth
                            required
                            autoComplete="current-password"
                            margin="normal"
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
                                textTransform: "none",
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
    );
}
