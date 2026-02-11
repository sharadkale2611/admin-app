'use client';

import {
    Box,
    Card,
    CardContent,
    Typography,
    MenuItem,
    TextField,
    Stack,
    Divider,
    Grid,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setCourseDetails } from '@/lib/features/admission/admissionDraftSlice';
import { fetchCoursesListOptions } from '@/lib/features/course/courseThunks';
import { useWizardNext } from '../components/wizard/WizardNextContext';

/* -------------------- TYPES -------------------- */
type StreamType = 'NA' | 'Science' | 'Commerce' | 'Arts';
type MediumType = 'English' | 'Semi-English' | 'Marathi';
type StdType = '8th' | '9th' | '10th' | '11th' | '12th';
type BoardType = 'MSBSHSE' | 'CBSE' | 'ICSE' | 'Other';

/* -------------------- CONSTANTS -------------------- */
const BOARDS = [
    { value: 'MSBSHSE', label: 'State Board' },
    { value: 'CBSE', label: 'CBSE' },
    { value: 'ICSE', label: 'ICSE' },
    // { value: 'University', label: 'University' },
    { value: 'Other', label: 'Other' },
];

const STANDARDS: StdType[] = ['8th', '9th', '10th', '11th', '12th'];
const MEDIUMS: MediumType[] = ['English', 'Semi-English', 'Marathi'];

/* -------------------- HELPERS -------------------- */
function getDefaultAcademicYears() {
    const d = new Date();
    const y = d.getFullYear();
    const m = d.getMonth() + 1;

    if (m >= 6) {
        return {
            currentAcademicYear: `${y}-${String(y + 1).slice(-2)}`,
            prevAcademicYear: `${y - 1}-${String(y).slice(-2)}`,
        };
    }

    return {
        currentAcademicYear: `${y - 1}-${String(y).slice(-2)}`,
        prevAcademicYear: `${y - 2}-${String(y - 1).slice(-2)}`,
    };
}



export default function AdmissionStep2Page() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const wizardNextRef = useWizardNext();

    const draft = useAppSelector((s) => s.admissionDraft);
    const courses = useAppSelector((s) => s.courses.courses);

    const today = new Date().toISOString().split('T')[0];

    const [courseId, setCourseId] = useState<number | ''>(draft.courseId ?? '');
    const [enrollmentDate, setEnrollmentDate] = useState(draft.enrollmentDate ?? today);

    const defaultYears = getDefaultAcademicYears();

    const [academic, setAcademic] = useState({
        stream: 'NA' as StreamType,

        currentAcademicYear: defaultYears.currentAcademicYear,
        currentClass: '' as StdType | '',
        currentMedium: '' as MediumType | '',
        currentBoard: '' as BoardType | '',
        currentInstitution: '',

        prevAcademicYear: defaultYears.prevAcademicYear,
        prevClass: '' as StdType | '',
        prevMedium: '' as MediumType | '',
        prevBoard: '' as BoardType | '',
        prevInstitution: '',

        prevMarkEnglish: '',
        prevMarkMath: '',
        prevMarkScience: '',
        prevPercentage: '',
        prevGrade: '',
    });


    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const markAllTouched = () => {
        setTouched({
            courseId: true,

            currentClass: true,
            currentMedium: true,
            currentBoard: true,
            currentInstitution: true,

            stream: true,

            prevClass: true,
            prevMedium: true,
            prevBoard: true,
            prevInstitution: true,
            prevPercentage: true,
        });
    };


    const updateAcademic = (k: keyof typeof academic, v: string) => {
        setAcademic(prev => {
            const updated = { ...prev, [k]: v };

            // ✅ Auto Previous Class
            if (k === 'currentClass') {
                const idx = STANDARDS.indexOf(v as StdType);

                if (idx > 0) {
                    updated.prevClass = STANDARDS[idx - 1];
                } else {
                    updated.prevClass = '' as any;
                }

                // Reset stream if not 11/12
                if (v !== '11th' && v !== '12th') {
                    updated.stream = 'NA';
                }
            }

            // ✅ Auto Previous Board
            if (k === 'currentBoard') {
                updated.prevBoard = v as BoardType;
            }

            // ✅ Auto Previous Medium
            if (k === 'currentMedium') {
                updated.prevMedium = v as MediumType;
            }

            return updated;
        });
    };



    const touch = (k: string) =>
        setTouched((p) => ({ ...p, [k]: true }));

    const is11or12 = academic.currentClass === '11th' || academic.currentClass === '12th';
    const is10th = academic.prevClass === '10th';

    const academicYears = Array.from({ length: 6 }, (_, i) => {
        const start = new Date().getFullYear() - 3 + i;
        return `${start}-${String(start + 1).slice(-2)}`;
    });

  

    /* -------------------- GUARDS -------------------- */
    useEffect(() => {
        if (!draft._persist?.rehydrated) return;
        if (draft.studentConfirmed === false) {
            router.replace('/admissions/new/step-1');
        }
    }, [draft, router]);

    useEffect(() => {
        dispatch(fetchCoursesListOptions());
    }, [dispatch]);

    /* -------------------- VALIDATION -------------------- */
    const errors = {
        courseId: !courseId,

        currentClass: !academic.currentClass,
        currentMedium: !academic.currentMedium,
        currentBoard: !academic.currentBoard,
        currentInstitution: !academic.currentInstitution.trim(),
        stream: is11or12 && academic.stream === 'NA',

        prevClass: !academic.prevClass,
        prevMedium: !academic.prevMedium,
        prevBoard: !academic.prevBoard,
        prevInstitution: !academic.prevInstitution.trim(),

        prevPercentage:
            is10th &&
            academic.prevPercentage !== '' &&
            (Number(academic.prevPercentage) < 0 ||
                Number(academic.prevPercentage) > 100),
    };

    /* -------------------- NEXT -------------------- */
    const handleNext = useCallback((): boolean => {
        const hasErrors = Object.values(errors).some(Boolean);

        if (hasErrors) {
            markAllTouched();   // 👈 FORCE error visibility
            return false;       // 👈 BLOCK navigation
        }

        dispatch(
            setCourseDetails({
                courseId: Number(courseId),
                enrollmentType: 'Regular',
                enrollmentDate,
                academicDetails: {
                    ...academic,
                    stream:
                        academic.currentClass === '11th' ||
                            academic.currentClass === '12th'
                            ? academic.stream
                            : 'NA',
                },
            })
        );


        return true;
    }, [errors, academic, courseId, enrollmentDate, dispatch]);

    useEffect(() => {
        if (!draft.academicDetails) return;

        setAcademic(prev => ({
            ...prev,
            ...draft.academicDetails,
        }));
    }, [draft.academicDetails]);




    useEffect(() => {
        if (!wizardNextRef) return;
        wizardNextRef.current = handleNext;
        return () => {
            wizardNextRef.current = null;
        };
    }, [wizardNextRef, handleNext]);

    /* ======================== UI ======================== */
    return (
        <Box sx={{ backgroundColor: 'white', padding: 3, borderRadius: 2 }}>
            <Typography variant="subtitle2" gutterBottom mb={2}>
                Course & Academic Details
            </Typography>

            <Stack spacing={3}>
                {/* COURSE */}
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    select
                                    label="Course *"
                                    size='small'
                                    value={courseId}
                                    onChange={(e) => setCourseId(Number(e.target.value))}
                                    onBlur={() => touch('courseId')}
                                    error={touched.courseId && errors.courseId}
                                    helperText={
                                        touched.courseId && errors.courseId
                                            ? 'Course is required'
                                            : ''
                                    }
                                    fullWidth
                                >
                                    {courses.map((c) => (
                                        <MenuItem key={c.courseId} value={c.courseId}>
                                            {c.courseName}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    type="date"
                                    size='small'
                                    label="Enrollment Date"
                                    value={enrollmentDate}
                                    InputLabelProps={{ shrink: true }}
                                    onChange={(e) => setEnrollmentDate(e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    <Divider sx={{ my: 1 }} />
                {/* CURRENT ACADEMIC */}
                {/* <Card>
                    <CardContent> */}
                        <Typography variant='subtitle2' >Current Academic Details</Typography>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Typography variant="caption">Current Class</Typography>
                                <ToggleButtonGroup
                                    fullWidth
                                    exclusive
                                    value={academic.currentClass}
                                    onChange={(_, v) => {
                                        touch('currentClass');
                                        v && updateAcademic('currentClass', v);
                                    }}
                                    size="small"
                                >
                                    {STANDARDS.map((s) => (
                                        <ToggleButton key={s} value={s}>
                                            {s}
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>

                                {
                                    touched.currentClass && errors.currentClass
                                        ? (
                                            <Typography
                                                variant="caption"
                                                color={
                                                    touched.currentClass && errors.currentClass
                                                        ? 'error'
                                                        : 'text.secondary'
                                                }
                                            >
                                                Current Class is required
                                            </Typography> 
                                        )
                                        : ''
                                }


                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <Typography variant="caption">Medium</Typography>
                                <ToggleButtonGroup
                                    fullWidth
                                    exclusive
                                    value={academic.currentMedium}
                                    onChange={(_, v) => {
                                        touch('currentMedium');
                                        v && updateAcademic('currentMedium', v);
                                    }}
                                    size="small"
                                >

                                    {MEDIUMS.map((m) => (
                                        <ToggleButton key={m} value={m}>
                                            {m}
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>
                                {
                                    touched.currentMedium && errors.currentMedium
                                        ? (
                                            <Typography
                                                variant="caption"
                                                color={
                                                    touched.currentMedium && errors.currentMedium
                                                        ? 'error'
                                                        : 'text.secondary'
                                                }
                                            >
                                                Current Medium is required
                                            </Typography>
                                        )
                                        : ''
                                }

                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <Typography variant="caption">Board</Typography>
                                <ToggleButtonGroup
                                    fullWidth
                                    exclusive
                                    value={academic.currentBoard}
                                    onChange={(_, v) => {
                                        touch('currentBoard');
                                        v && updateAcademic('currentBoard', v);
                                    }}
                                    size="small"
                                >

                                    {BOARDS.map((b) => (
                                        <ToggleButton key={b.value} value={b.value}>
                                            {b.label}
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>
                                {
                                    touched.currentBoard && errors.currentBoard
                                        ? (
                                            <Typography
                                                variant="caption"
                                                color={
                                                    touched.currentBoard && errors.currentBoard
                                                        ? 'error'
                                                        : 'text.secondary'
                                                }
                                            >
                                                Current Board is required
                                            </Typography>
                                        )
                                        : ''
                                }
                                
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    select
                                    label="Current Academic Year"
                                    size='small'
                                    value={academic.currentAcademicYear}
                                    onChange={(e) =>
                                        updateAcademic('currentAcademicYear', e.target.value)
                                    }                                    
                                    fullWidth
                                >
                                    {academicYears.map((y) => (
                                        <MenuItem key={y} value={y}>
                                            {y}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            {is11or12 && (
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        select
                                        label="Stream"
                                        size='small'
                                        value={academic.stream}
                                        onChange={(e) =>
                                            updateAcademic('stream', e.target.value)
                                        }
                                        error={touched.stream && errors.stream}
                                        helperText={
                                            touched.stream && errors.stream
                                                ? 'Stream is required'
                                                : ''
                                        }
                                        onBlur={() => touch('stream')}
                                        fullWidth
                                    >
                                        <MenuItem value="Science">Science</MenuItem>
                                        <MenuItem value="Commerce">Commerce</MenuItem>
                                        <MenuItem value="Arts">Arts</MenuItem>
                                    </TextField>
                                </Grid>
                            )}

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                            label="School / College Name"
                                    value={academic.currentInstitution}
                                    size='small'
                                    onChange={(e) =>
                                        updateAcademic(
                                            'currentInstitution',
                                            e.target.value
                                        )
                                    }
                                    onBlur={() => touch('currentInstitution')}
                                    error={
                                        touched.currentInstitution &&
                                        errors.currentInstitution
                                    }
                                    helperText={
                                        touched.currentInstitution &&
                                            errors.currentInstitution
                                            ? 'School / College name is required'
                                            : ''
                                    }
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                <Divider sx={{ my: 1 }} /> 

                {/* PREVIOUS ACADEMIC */}
                        <Typography fontWeight={600}>Previous Academic Details</Typography>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Typography variant="caption">Previous Class</Typography>
                                <ToggleButtonGroup
                                    fullWidth
                                    exclusive
                                    value={academic.prevClass}
                                    onChange={(_, v) => v && updateAcademic('prevClass', v)}
                                    size="small"
                                >
                                    {STANDARDS.map((s) => (
                                        <ToggleButton key={s} value={s}>
                                            {s}
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>
                                {
                                    touched.prevClass && errors.prevClass
                                        ? (
                                            <Typography
                                                variant="caption"
                                                color={
                                                    touched.prevClass && errors.prevClass
                                                        ? 'error'
                                                        : 'text.secondary'
                                                }
                                            >
                                                Previous Class is required
                                            </Typography>
                                        )
                                        : ''
                                }                                
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <Typography variant="caption">Medium</Typography>
                                <ToggleButtonGroup
                                    fullWidth
                                    exclusive
                                    value={academic.prevMedium}
                                    onChange={(_, v) => v && updateAcademic('prevMedium', v)}
                                    size="small"
                                >
                                    {MEDIUMS.map((m) => (
                                        <ToggleButton key={m} value={m}>
                                            {m}
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>
                                {
                                    touched.prevMedium && errors.prevMedium
                                        ? (
                                            <Typography
                                                variant="caption"
                                                color={
                                                    touched.prevMedium && errors.prevMedium
                                                        ? 'error'
                                                        : 'text.secondary'
                                                }
                                            >
                                                Previous Medium is required
                                            </Typography>
                                        )
                                        : ''
                                }                                
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <Typography variant="caption">Board</Typography>
                                <ToggleButtonGroup
                                    fullWidth
                                    exclusive
                                    value={academic.prevBoard}
                                    onChange={(_, v) => v && updateAcademic('prevBoard', v)}
                                    size="small"
                                >
                                    {BOARDS.map((b) => (
                                        <ToggleButton key={b.value} value={b.value}>
                                            {b.label}
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>
                                {
                                    touched.prevBoard && errors.prevBoard
                                        ? (
                                            <Typography
                                                variant="caption"
                                                color={
                                                    touched.prevBoard && errors.prevBoard
                                                        ? 'error'
                                                        : 'text.secondary'
                                                }
                                            >
                                                Previous Board is required
                                            </Typography>
                                        )
                                        : ''
                                }                                
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    select
                                    label="Previous Academic Year"
                                    size='small'
                                    value={academic.prevAcademicYear}
                                    onChange={(e) =>
                                        updateAcademic('prevAcademicYear', e.target.value)
                                    }                                    
                                    fullWidth
                                >
                                    {academicYears.map((y) => (
                                        <MenuItem key={y} value={y}>
                                            {y}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="School / College Name"
                                    value={academic.prevInstitution}
                                    size='small'
                                    onChange={(e) =>
                                        updateAcademic(
                                            'prevInstitution',
                                            e.target.value
                                        )
                                    }
                                    onBlur={() => touch('prevInstitution')}
                                    error={
                                        touched.prevInstitution &&
                                        errors.prevInstitution
                                    }
                                    helperText={
                                        touched.prevInstitution &&
                                            errors.prevInstitution
                                            ? 'School / College name is required'
                                            : ''
                                    }
                                    fullWidth
                                />
                            </Grid>

                    {is10th && (
                        <>
                            <Grid size={{ xs: 12 }}>
                                <Divider />
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    SSC Performance
                                </Typography>
                            </Grid>

                            <Grid size={{ xs: 12, md: 2 }}>
                                <TextField
                                    label="English Marks"
                                    size="small"
                                    value={academic.prevMarkEnglish}
                                    onChange={(e) =>
                                        updateAcademic('prevMarkEnglish', e.target.value)
                                    }
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 2 }}>
                                <TextField
                                    label="Math Marks"
                                    size="small"
                                    value={academic.prevMarkMath}
                                    onChange={(e) =>
                                        updateAcademic('prevMarkMath', e.target.value)
                                    }
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 2 }}>
                                <TextField
                                    label="Science Marks"
                                    size="small"
                                    value={academic.prevMarkScience}
                                    onChange={(e) =>
                                        updateAcademic('prevMarkScience', e.target.value)
                                    }
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 2 }}>
                                <TextField
                                    label="Percentage"
                                    size="small"
                                    value={academic.prevPercentage}
                                    onChange={(e) =>
                                        updateAcademic('prevPercentage', e.target.value)
                                    }
                                    onBlur={() => touch('prevPercentage')}
                                    error={
                                        touched.prevPercentage &&
                                        errors.prevPercentage
                                    }
                                    helperText={
                                        touched.prevPercentage &&
                                            errors.prevPercentage
                                            ? 'Enter value between 0 and 100'
                                            : ''
                                    }
                                    fullWidth   
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 2 }}>
                                <TextField
                                    label="Grade"
                                    size="small"
                                    value={academic.prevGrade}
                                    onChange={(e) =>
                                        updateAcademic('prevGrade', e.target.value)
                                    }
                                    fullWidth
                                />
                            </Grid>
                        </>
                    )}

                        </Grid>
            </Stack>
        </Box>
    );
}
