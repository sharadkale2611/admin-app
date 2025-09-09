'use client'
import React from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Grid,
    Alert,
    Switch,
    FormControlLabel,
    CircularProgress
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import Link from 'next/link';
import useCreateCourseViewModel from '@/lib/features/course/useCreateCourseViewModel';
import { CourseLevel } from '@/lib/features/course/courseTypes';

export default function CreateCourse() {
    const {
        formData,
        isSubmitting,
        error,
        categories,
        categoriesLoading,
        categoriesError,
        handleChange,
        handleSelectChange,
        handleNumberChange,
        handleSubmit
    } = useCreateCourseViewModel();

    return (
        <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Create New Course
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {categoriesError && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Failed to load categories: {categoriesError}
                </Alert>
            )}

            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0' }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {/* Basic Information Section */}
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="subtitle1" sx={{ mb: 1, color: 'text.secondary' }}>
                                Course Information
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Course Name"
                                name="courseName"
                                value={formData.courseName}
                                onChange={handleChange}
                                required
                                size="small"
                                disabled={isSubmitting}
                                placeholder="Enter course name"
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Course Description"
                                name="courseDescription"
                                value={formData.courseDescription}
                                onChange={handleChange}
                                multiline
                                rows={4}
                                size="small"
                                disabled={isSubmitting}
                                placeholder="Describe the course content and objectives"
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth size="small" disabled={isSubmitting || categoriesLoading}>
                                <InputLabel>Course Category *</InputLabel>
                                <Select
                                    label="Course Category *"
                                    name="courseCategoryId"
                                    value={formData.courseCategoryId}
                                    onChange={handleSelectChange}
                                    required
                                    disabled={categoriesLoading}
                                    endAdornment={
                                        categoriesLoading ? (
                                            <Box sx={{ display: 'flex', justifyContent: 'center', pr: 2 }}>
                                                <CircularProgress size={20} />
                                            </Box>
                                        ) : null
                                    }
                                >
                                    <MenuItem value={0}>
                                        <em>Select a category</em>
                                    </MenuItem>
                                    {categories.map((category) => (
                                        <MenuItem key={category.courseCategoryId} value={category.courseCategoryId}>
                                            {category.courseCategoryName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {categoriesLoading && (
                                <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary' }}>
                                    Loading categories...
                                </Typography>
                            )}
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth size="small" disabled={isSubmitting}>
                                <InputLabel>Course Level</InputLabel>
                                <Select
                                    label="Course Level"
                                    name="courseLevel"
                                    value={formData.courseLevel}
                                    onChange={handleSelectChange}
                                >
                                    <MenuItem value={CourseLevel.Beginner}>Beginner</MenuItem>
                                    <MenuItem value={CourseLevel.Intermediate}>Intermediate</MenuItem>
                                    <MenuItem value={CourseLevel.Expert}>Expert</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Course Order"
                                name="courseOrder"
                                type="number"
                                value={formData.courseOrder}
                                onChange={handleNumberChange}
                                size="small"
                                InputProps={{ inputProps: { min: 1, max: 100 } }}
                                disabled={isSubmitting}
                                helperText="Display order (1 = first)"
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        name="status"
                                        checked={formData.status}
                                        onChange={(e) => {
                                            handleChange({
                                                ...e,
                                                target: {
                                                    ...e.target,
                                                    name: 'status',
                                                    value: e.target.checked,
                                                    type: 'checkbox'
                                                } as any
                                            });
                                        }}
                                        disabled={isSubmitting}
                                    />
                                }
                                label={formData.status ? 'Active' : 'Inactive'}
                                sx={{ mt: 2 }}
                            />
                            <Typography variant="caption" display="block" sx={{ mt: 0.5, color: 'text.secondary' }}>
                                Course status
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Link href="/courses" passHref>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        startIcon={<Cancel />}
                                        size="small"
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    startIcon={<Save />}
                                    size="small"
                                    disabled={isSubmitting || !formData.courseName.trim() || formData.courseCategoryId <= 0 || categoriesLoading}
                                >
                                    {isSubmitting ? 'Creating...' : 'Create Course'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
}