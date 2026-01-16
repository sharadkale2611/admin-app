'use client';

import { Box, Button } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { resetAdmissionDraft } from '@/lib/features/admission/admissionDraftSlice';
import { ADMISSION_STEPS } from './wizardSteps';
import type { WizardNextHandler } from './WizardNextContext';

export default function WizardFooter({
    nextHandlerRef,
}: {
    nextHandlerRef: React.MutableRefObject<WizardNextHandler | null>;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();

    const currentIndex = ADMISSION_STEPS.findIndex(step =>
        pathname.includes(step.key)
    );

    const submitting = useAppSelector(
        s => s.admissions.loading
    );

    /* -------------------- RESET ALL -------------------- */
    const handleResetAll = () => {
        const confirmReset = window.confirm(
            'This will clear all admission data and start over. Are you sure?'
        );

        if (!confirmReset) return;

        dispatch(resetAdmissionDraft());
        router.replace('/admissions/new/step-1');
    };

    /* -------------------- NEXT -------------------- */
    const handleNext = () => {
        console.log('🟡 [WizardFooter] Next clicked');
        console.log('🟡 currentIndex:', currentIndex);
        console.log('🟡 isLastStep:', currentIndex === ADMISSION_STEPS.length - 1);

        const handler = nextHandlerRef.current;
        console.log('🟡 handler exists?', !!handler);

        // ✅ LAST STEP
        if (currentIndex === ADMISSION_STEPS.length - 1) {
            console.log('🟢 [WizardFooter] Calling submit handler (no navigation)');
            handler?.();
            return;
        }

        // NORMAL STEPS
        if (handler) {
            console.log('🟡 [WizardFooter] Calling step handler');
            const canProceed = handler();
            console.log('🟡 handler returned:', canProceed);

            if (!canProceed) {
                console.warn('⛔ Navigation blocked by step');
                return;
            }
        }

        const next = ADMISSION_STEPS[currentIndex + 1];
        console.log('🟡 Navigating to:', next?.path);

        if (next) router.push(next.path);
    };


    /* -------------------- BACK -------------------- */
    const handleBack = () => {
        const prev = ADMISSION_STEPS[currentIndex - 1];
        if (prev) router.push(prev.path);
    };

    return (
        <Box
            sx={{
                px: 3,
                py: 2,
                borderTop: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'background.paper',
            }}
        >
            {/* LEFT ACTIONS */}
            <Box display="flex" gap={1}>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={handleResetAll}
                >
                    Reset All
                </Button>
            </Box>

            {/* RIGHT ACTIONS */}
            <Box display="flex" gap={1}>
                <Button
                    variant="outlined"
                    disabled={currentIndex === 0}
                    onClick={handleBack}
                >
                    Back
                </Button>

                {/* LAST STEP → SUBMIT */}
                {currentIndex === ADMISSION_STEPS.length - 1 ? (
                    <Button
                        variant="contained"
                        color="success"
                        disabled={submitting}
                        onClick={handleNext}
                    >
                        {submitting ? 'Submitting…' : 'Confirm & Submit'}
                    </Button>

                ) : (
                    <Button
                        variant="contained"
                        onClick={handleNext}
                    >
                        Next
                    </Button>
                )}
            </Box>

        </Box>
    );
}
