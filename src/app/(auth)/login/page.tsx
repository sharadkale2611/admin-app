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
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { handleSubmit, loading, error, validationErrors } =
    useLoginViewModel();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, hasChecked } = useAppSelector((state) => state.auth);

  useEffect(() => {
    console.log("isAuthenticated", isAuthenticated);

    // Only redirect if we already know user is authenticated
    if (isAuthenticated) {
      router.push(searchParams?.get("redirect") || "/dashboard");
    }
  }, [isAuthenticated, router, searchParams, handleSubmit]);

  // Loader while checking
  if (!hasChecked) {
    console.log({ hasChecked });
    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4">Login</Typography>

                {validationErrors.length > 0 && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                            {validationErrors.map((err: string, idx: number) => (
                                <li key={idx}>{err}</li>
                            ))}
                        </ul>
                    </Alert>
                )}

                {error?.message && !validationErrors.length && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error.message}
                    </Alert>
                )}

                <Box
                    component="form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        handleSubmit({
                            username: formData.get('username') as string,
                            password: formData.get('password') as string
                        });
                    }}
                    sx={{ mt: 3, width: '100%' }}
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        // value={"admin"}
                        autoFocus
                    />
                    {/* admin: admin123 */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        // value={"admin123"}
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Sign In'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">Login</Typography>

        {validationErrors.length > 0 && (
          <Alert severity="error" sx={{ mt: 2 }}>
            <ul style={{ margin: 0, paddingLeft: "20px" }}>
              {validationErrors.map((err: string, idx: number) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </Alert>
        )}

        {error?.message && !validationErrors.length && (
          <Alert severity="error" sx={{ mt: 2 }}>
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
          sx={{ mt: 3, width: "100%" }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : "Sign In"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
