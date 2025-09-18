"use client";

import { useState } from "react";
import {
    Container,
    Grid,
    Paper,
    Typography,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    Alert,
    CircularProgress,
} from "@mui/material";

export default function LeadSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSearch() {
        setError(null);
        setResults([]);
        setLoading(true);

        try {
            const res = await fetch("http://localhost:5140/api/lead/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query, platform: "linkedin" }),
            });
            const data = await res.json();

            if (data.success) {
                setResults(data.data);
            } else {
                setError(data.message || "Scraper failed");
            }
        } catch (err: any) {
            setError("Request failed: " + err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container maxWidth="sm" style={{ height: "100vh" }}>
            <Grid
                container
                alignItems="center"
                justifyContent="center"
                style={{ height: "100%" }}
            >
                <Grid size={{ xs: 12 }}>
                    <Paper elevation={4} style={{ padding: "2rem", textAlign: "center" }}>
                        <Typography variant="h5" gutterBottom>
                            Lead Search
                        </Typography>

                        <Grid container spacing={2} alignItems="center">
                            <Grid size={{ xs: 8 }}>
                                <TextField
                                    fullWidth
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    label="Enter keyword e.g. Python training Pune"
                                    variant="outlined"
                                    size="small"
                                />
                            </Grid>
                            <Grid size={{ xs: 4 }}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSearch}
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : "Search"}
                                </Button>
                            </Grid>
                        </Grid>

                        {error && (
                            <Alert severity="error" style={{ marginTop: "1rem" }}>
                                {error}
                            </Alert>
                        )}

                        {loading && !error && (
                            <div style={{ marginTop: "1rem" }}>
                                <CircularProgress />
                                <Typography variant="body2" style={{ marginTop: "0.5rem" }}>
                                    Searching leads...
                                </Typography>
                            </div>
                        )}

                        <List style={{ marginTop: "1rem" }}>
                            {results.map((r, i) => (
                                <ListItem
                                    key={i}
                                    divider
                                    component="a"
                                    href={r.url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <ListItemText
                                        primary={r.name}
                                        secondary={r.headline}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
