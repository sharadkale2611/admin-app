'use client';

import {
    Box,
    Card,
    CardContent,
    TextField,
    Typography,
    CircularProgress,
    Button,
    Grid,
    FormControlLabel,
    RadioGroup,
    Radio,
    Avatar,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    OutlinedInput,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useState, useCallback, useEffect, useRef } from 'react';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
    setDraftStudent,
    resetStudentSelection,
    resetAdmissionDraft,
} from '@/lib/features/admission/admissionDraftSlice';
import { fetchStudentByMobile } from '@/lib/features/student/studentThunks';
import { useWizardNext } from '../components/wizard/WizardNextContext';
import AddressSelector, {
    AddressValue,
} from '@/app/components/modules/AddressSelector';
import { useRouter } from 'next/navigation';

type ExistingStudent = {
    studentId: number;
    firstName: string;
    lastName: string;
    email?: string;
    profileImagePath?: string;
};

export default function IdentifyStudentPage() {
    const dispatch = useAppDispatch();
    const draft = useAppSelector((s) => s.admissionDraft);
    const wizardNextRef = useWizardNext();

    const [mobile, setMobile] = useState('');
    const [loading, setLoading] = useState(false);
    const [student, setStudent] = useState<ExistingStudent | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const clearError = (field: string) => {
        setErrors(prev => ({ ...prev, [field]: '' }));
    };


    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '', // ✅ ADD (ISO: YYYY-MM-DD)

        fatherName: '',
        motherName: '',
        alternateMobile: '', // OPTIONAL

        gender: '',
        reservationCategory: '',
        fatherOccupation: '',

        profileImagePath: '', // OPTIONAL
    });

    const [address, setAddress] = useState<AddressValue>({
        fullAddress: '',
        pincode: '',
        stateId: null,
        cityId: null,
        addressType: 'Residential',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    /* ---------------- REHYDRATE ---------------- */
    useEffect(() => {
        if (!draft.studentConfirmed || !draft.student) return;

        setMobile(draft.student.mobile);

        setForm({
            firstName: draft.student.firstName ?? '',
            lastName: draft.student.lastName ?? '',
            email: draft.student.email ?? '',
            dateOfBirth: draft.student.dateOfBirth ?? '', // ✅ ADD

            fatherName: draft.student.fatherName ?? '',
            motherName: draft.student.motherName ?? '',
            alternateMobile: draft.student.alternateMobile ?? '',

            gender: draft.student.gender ?? '',
            reservationCategory: draft.student.reservationCategory ?? '',
            fatherOccupation: draft.student.fatherOccupation ?? '',

            profileImagePath: draft.student.profileImagePath ?? '',
        });

        setAddress({
            fullAddress: draft.student.address ?? '',
            pincode: draft.student.pincode ?? '',
            stateId:
                typeof draft.student.stateId === 'number'
                    ? draft.student.stateId
                    : null,
            cityId:
                typeof draft.student.cityId === 'number'
                    ? draft.student.cityId
                    : null,
            addressType: draft.student.addressType ?? 'Residential',
        });
    }, [draft.studentConfirmed, draft.student]);



    const clearFormAll = () => {
        setStudent(null);

        setForm({
            firstName: '',
            lastName: '',
            email: '',
            dateOfBirth: '',
            fatherName: '',
            motherName: '',
            alternateMobile: '',
            gender: '',
            reservationCategory: '',
            fatherOccupation: '',
            profileImagePath: '',
        });

        setAddress({
            fullAddress: '',
            pincode: '',
            stateId: null,
            cityId: null,
            addressType: 'Residential',
        });

        setErrors({});
        setSubmitted(false);
    };
   
    /* ---------------- MOBILE CHECK ---------------- */
    const checkMobile = async (value: string) => {
        if (value.length !== 10) return;

        setLoading(true);
        setStudent(null);
        setNotFound(false);

        try {
            const result = await dispatch(fetchStudentByMobile(value)).unwrap();
            const data = result; // assuming thunk already returns data.data

            setStudent({
                studentId: data.studentId,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                profileImagePath: data.profileImagePath,
            });

            /* ---------------- FORM ---------------- */
            setForm({
                firstName: data.firstName ?? '',
                lastName: data.lastName ?? '',
                email: data.email ?? '',
                dateOfBirth: data.dateOfBirth
                    ? data.dateOfBirth.split('T')[0] // ✅ FIX DATE
                    : '',

                fatherName: data.fatherName ?? '',
                motherName: data.motherName ?? '',
                alternateMobile: data.mobileNumber2 ?? '',
                gender: data.gender ?? '',
                reservationCategory: data.resevationCategory ?? '', // ⚠ typo handled
                fatherOccupation: data.fathersOccupation ?? '', // ✅ CORRECT

                profileImagePath: data.profileImagePath ?? '',
            });

            /* ---------------- ADDRESS ---------------- */
            const addr = data.addresses?.find(a => a.isActive && !a.isDeleted)
                ?? data.addresses?.[0];

            if (addr) {
                setAddress({
                    fullAddress: addr.fullAddress ?? '',
                    pincode: addr.pinCode ?? '',
                    stateId: addr.stateId ?? null,
                    cityId: addr.cityId ?? null,
                    addressType: addr.addressType ?? 'Residential',
                });
            }

        } catch {
            setNotFound(true);
            clearFormAll(); 
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- IMAGE UPLOAD (OPTIONAL) ---------------- */
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setForm((p) => ({
                ...p,
                profileImagePath: reader.result as string, // ✅ BASE64
            }));
        };
        reader.readAsDataURL(file);
    };


    /* ---------------- VALIDATION ---------------- */
    const validate = () => {
        const e: Record<string, string> = {};

        if (!mobile || mobile.length !== 10) e.mobile = 'Valid mobile is required';
        if (!form.firstName) e.firstName = 'First name is required';
        if (!form.lastName) e.lastName = 'Last name is required';
        if (!form.gender) e.gender = 'Gender is required';

        if (!form.dateOfBirth) e.dateOfBirth = 'Date of birth is required';
        const dob = new Date(form.dateOfBirth);
        const age =
            new Date().getFullYear() - dob.getFullYear();

        if (age < 5) e.dateOfBirth = 'Age must be at least 5 years';


        if (!form.fatherName) e.fatherName = 'Father name is required';
        if (!form.motherName) e.motherName = 'Mother name is required';
        if (!form.fatherOccupation)
            e.fatherOccupation = 'Father occupation is required';

        if (!address.fullAddress) e.fullAddress = 'Address is required';
        if (!address.pincode || address.pincode.length !== 6)
            e.pincode = 'Valid pincode required';
        if (address.stateId === null) e.stateId = 'State is required';
        if (address.cityId === null) e.cityId = 'City is required';
        if (!address.addressType) e.addressType = 'Address type is required';

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    /* ---------------- NEXT HANDLER ---------------- */
    const handleNext = useCallback((): boolean => {
        setSubmitted(true);

        if (!validate()) return false;

        dispatch(
            setDraftStudent({
                studentId: student?.studentId,
                mobile,

                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,

                fatherName: form.fatherName,
                motherName: form.motherName,
                alternateMobile: form.alternateMobile,
                dateOfBirth: form.dateOfBirth, 

                gender: form.gender as 'Male' | 'Female',
                reservationCategory: form.reservationCategory || undefined,
                fatherOccupation: form.fatherOccupation,

                address: address.fullAddress,
                pincode: address.pincode,
                stateId: address.stateId ?? undefined,
                cityId: address.cityId ?? undefined,

                addressType:
                    address.addressType
                        ? address.addressType
                        : undefined,

                profileImagePath: form.profileImagePath || undefined,
                isExisting: !!student,
            })
        );


        return true;
    }, [student, form, mobile, address, dispatch]);



    useEffect(() => {
        if (!wizardNextRef) return;
        wizardNextRef.current = handleNext;
        return () => {
            wizardNextRef.current = null;
        };
    }, [wizardNextRef, handleNext]);

    const isLocked = draft.studentConfirmed && draft.student?.isExisting;
    const isExistingStudent = !!student || isLocked;

    
        /* -------------------- RESET ALL -------------------- */
        const handleResetAll = () => {
            const confirmReset = window.confirm(
                'This will clear all admission data and start over. Are you sure?'
            );
    
            if (!confirmReset) return;
    
            dispatch(resetAdmissionDraft());
            router.replace('/admissions/new/step-1');
        };
    

    /* ---------------- UI ---------------- */
    return (
        <Box  sx={{ backgroundColor: 'white', padding: 3, borderRadius: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                {/* LEFT SIDE */}
                <Box display="flex" gap={1} alignItems="center">
                    <Typography variant="subtitle2">
                        {/* Student Mobile Number */}
                    </Typography>

                    <TextField
                        label="Mobile Number"
                        required
                        value={mobile}
                        size="small"
                        error={!!errors.mobile}
                        helperText={errors.mobile}
                        disabled={isLocked}
                        inputProps={{ maxLength: 10 }}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            setMobile(val);
                            if (val.length < 10) {
                                clearFormAll(); // 🔥 clear while editing
                                setNotFound(false);
                            }                            
                            if (val.length === 10) checkMobile(val);
                        }}
                        InputProps={{
                            endAdornment: loading ? (
                                <CircularProgress size={20} />
                            ) : null,
                        }}
                    />
                </Box>

                {/* RIGHT SIDE */}
                <Button
                    variant="outlined"
                    color="error"
                    onClick={handleResetAll}
                >
                    Reset All
                </Button>
            </Box>

            {(student || notFound || isLocked) && (
                <Card sx={{ mt: 3 }} variant="outlined">
                    <CardContent>
                        {/* BASIC DETAILS */}
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            Basic Details
                        </Typography>

                        <Grid container spacing={2} alignItems="center">

                            <Grid size={{ xs: 12, sm: 12, md: 3 }}>
                                <TextField
                                    label="First Name"
                                    fullWidth
                                    size='small'
                                    required
                                    value={form.firstName}
                                    disabled={isExistingStudent}
                                    error={submitted && !!errors.firstName}
                                    helperText={submitted ? errors.firstName : ''}
                                    onChange={(e) => {
                                        setForm({ ...form, firstName: e.target.value });
                                        clearError('firstName');
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 12, md: 3 }}>
                                <TextField
                                    label="Last Name"
                                    fullWidth
                                    size='small'
                                    required
                                    value={form.lastName}
                                    disabled={isExistingStudent}
                                    error={submitted && !!errors.lastName}
                                    helperText={submitted ? errors.lastName : ''}
                                    onChange={(e) => {
                                        setForm({ ...form, lastName: e.target.value });
                                        clearError('lastName');
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 3 }}>
                                <TextField
                                    label="Email (Optional)"
                                    fullWidth
                                    size="small"
                                    type="email"
                                    value={form.email}
                                    disabled={isExistingStudent}
                                    error={submitted && !!errors.email}
                                    helperText={submitted ? errors.email : ''}
                                    onChange={(e) => {
                                        setForm({ ...form, email: e.target.value });
                                        clearError('email');
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 12, md: 3 }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        columnGap: 2,
                                        flexWrap: 'nowrap', // 🔥 IMPORTANT
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            whiteSpace: 'nowrap', // 🔥 IMPORTANT
                                            fontWeight: 500,
                                        }}
                                    >
                                        Gender *
                                    </Typography>

                                    <RadioGroup
                                        row
                                        value={form.gender}
                                        onChange={(e) => {
                                            setForm({ ...form, gender: e.target.value });
                                            clearError('gender');
                                        }}
                                        sx={{
                                            gap: 1.5,
                                            flexWrap: 'nowrap', // 🔥 IMPORTANT
                                        }}
                                    >
                                        {['Male', 'Female'].map((g) => {
                                            const selected = form.gender === g;

                                            return (
                                                <FormControlLabel
                                                    key={g}
                                                    value={g}
                                                    tabIndex={0}
                                                    control={<Radio sx={{ display: 'none' }} />}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                            e.preventDefault(); // 🔥 REQUIRED
                                                            setForm({ ...form, gender: g });
                                                            clearError('gender');
                                                        }
                                                    }}                                                    
                                                    label={g}
                                                    sx={{
                                                        m: 0,
                                                        px: 2,
                                                        py: 0.75,
                                                        borderRadius: '999px',
                                                        border: '1px solid',
                                                        borderColor: selected
                                                            ? 'primary.main'
                                                            : 'divider',
                                                        backgroundColor: selected
                                                            ? 'primary.light'
                                                            : 'background.paper',
                                                        color: selected
                                                            ? 'white'
                                                            : 'text.primary',
                                                        fontWeight: selected ? 600 : 500,
                                                        cursor: 'pointer',
                                                    }}
                                                />
                                            );
                                        })}
                                    </RadioGroup>
                                </Box>

                                {errors.gender && (
                                    <Typography color="error" variant="caption">
                                        {errors.gender}
                                    </Typography>
                                )}
                            </Grid>
                        </Grid>


                        <Divider sx={{ my: 1 }} />

                        {/* PARENT DETAILS */}
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Parent & Contact Details
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    label="Father Name"
                                    fullWidth
                                    size='small'
                                    required
                                    value={form.fatherName}
                                    disabled={isExistingStudent}
                                    error={submitted && !!errors.fatherName}
                                    helperText={submitted ? errors.fatherName : ''}
                                    onChange={(e) => {
                                        setForm({ ...form, fatherName: e.target.value });
                                        clearError('fatherName');
                                    }}

                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    label="Mother Name"
                                    fullWidth
                                    size='small'
                                    required
                                    value={form.motherName}
                                    disabled={isExistingStudent}
                                    error={submitted && !!errors.motherName}
                                    helperText={submitted ? errors.motherName : ''}
                                    onChange={(e) => {
                                        setForm({ ...form, motherName: e.target.value });
                                        clearError('motherName');
                                    }}

                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    label="Alternate Mobile (Optional)"
                                    fullWidth
                                    size='small'
                                    value={form.alternateMobile}
                                    disabled={isExistingStudent}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            alternateMobile: e.target.value,
                                        })
                                    }
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <FormControl
                                    fullWidth
                                    size="small"
                                    error={!!errors.fatherOccupation}
                                >
                                    <InputLabel id="father-occ-label">
                                        Father Occupation *
                                    </InputLabel>

                                    <Select
                                        labelId="father-occ-label"
                                        value={form.fatherOccupation}
                                        label="Father Occupation *"
                                        onChange={(e) => {
                                            setForm({ ...form, fatherOccupation: e.target.value });
                                            clearError('fatherOccupation');
                                        }}

                                        input={<OutlinedInput label="Father Occupation *" />}
                                    >
                                        {['Business', 'Service', 'Farmer', 'Other'].map((o) => (
                                            <MenuItem key={o} value={o}>
                                                {o}
                                            </MenuItem>
                                        ))}
                                    </Select>

                                    {errors.fatherOccupation && (
                                        <Typography color="error" variant="caption">
                                            {errors.fatherOccupation}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                {/* ADDRESS */}
                                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                    Address Details
                                </Typography>

                                <AddressSelector
                                    value={address}
                                    onChange={setAddress}
                                    disabled={isExistingStudent}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>

                                    <TextField
                                        label="Date of Birth"
                                        type="date"
                                        fullWidth
                                        size="small"
                                        required
                                        value={form.dateOfBirth}
                                        error={submitted && !!errors.dateOfBirth}
                                        helperText={submitted ? errors.dateOfBirth : ''}
                                        onChange={(e) => {
                                            setForm({ ...form, dateOfBirth: e.target.value });
                                            clearError('dateOfBirth');
                                        }}
                                        InputLabelProps={{
                                            shrink: true, // 🔥 IMPORTANT for date inputs
                                        }}
                                    />

                                {/* CATEGORY */}
                                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                    Reservation Category
                                </Typography>

                                <RadioGroup
                                    row
                                    value={form.reservationCategory}
                                    onChange={(e) => {
                                        setForm({ ...form, reservationCategory: e.target.value });
                                        clearError('reservationCategory');
                                    }}

                                    sx={{
                                        gap: 1.5,
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    {['Open', 'OBC', 'SC', 'ST', 'VJNT', 'EWS'].map((cat) => {
                                        const selected = form.reservationCategory === cat;

                                        return (
                                            <FormControlLabel
                                                key={cat}
                                                value={cat}
                                                tabIndex={0}
                                                control={<Radio sx={{ display: 'none' }} />}
                                                    disabled={isExistingStudent}
                                                label={cat}
                                                sx={{
                                                    m: 0,
                                                    px: 2,
                                                    py: 1,
                                                    borderRadius: '999px',
                                                    border: '1px solid',
                                                    borderColor: selected ? 'primary.main' : 'divider',
                                                    backgroundColor: selected
                                                        ? 'primary.light'
                                                        : 'background.paper',
                                                    color: selected ? 'white' : 'text.primary',
                                                    fontWeight: selected ? 600 : 500,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                        borderColor: 'primary.main',
                                                        backgroundColor: selected
                                                            ? 'primary.light'
                                                            : 'action.hover',
                                                    },
                                                }}
                                            />
                                        );
                                    })}
                                </RadioGroup>

                                    <Box
                                        sx={{
                                            position: 'relative',
                                            width: 74,
                                            height: 74,
                                            mx: 'auto',
                                            mt:3
                                        }}
                                    >
                                        <Avatar
                                            src={form.profileImagePath || '/avatar1.png'}
                                            sx={{
                                                width: 74,
                                                height: 74,
                                                border: '2px solid #e0e0e0',
                                                bgcolor: '#f5f5f5',
                                            }}
                                        />
                                    <IconButton
                                        tabIndex={0}
                                        onClick={() => fileInputRef.current?.click()}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                fileInputRef.current?.click();
                                            }
                                        }}
                                        sx={{
                                            position: 'absolute',
                                            bottom: -6,
                                            right: -6,
                                            bgcolor: 'background.paper',
                                            boxShadow: 1,
                                            '&:hover': { bgcolor: 'grey.100' },
                                            '&:focus-visible': {
                                                outline: '2px solid',
                                                outlineColor: 'primary.main',
                                            },
                                        }}
                                    >
                                        <PhotoCamera fontSize="small" />
                                    </IconButton>

                                    <input
                                        ref={fileInputRef}
                                        hidden
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                    </Box>

                                </Grid> 

                            </Grid>

 
                        {/* <Divider sx={{ my: 3 }} /> */}


                        {/* {isLocked && (
                            <Button
                                size="small"
                                sx={{ mt: 2 }}
                                onClick={() =>
                                    dispatch(resetStudentSelection())
                                }
                            >
                                Change Student
                            </Button>
                        )} */}
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}
