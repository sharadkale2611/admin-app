'use client';

import { Stepper, Step, StepLabel, Box, Button } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { ADMISSION_STEPS, AdmissionStep } from './wizardSteps';
import { useAppSelector } from '@/lib/hooks';

export default function WizardStepper() {
    const pathname = usePathname();
    const router = useRouter();
    const draft = useAppSelector((s) => s.admissionDraft);

    const activeStep = ADMISSION_STEPS.findIndex(step =>
        pathname.includes(step.key)
    );

    const canNavigate = (step: AdmissionStep): boolean => {
        if (!step.requires) return true;
        return Boolean(draft[step.requires]);
    };

    return (
        <Box sx={{ px: 3, py: 2, borderBottom: '0px solid', borderColor: 'divider' }}>
            <Stepper activeStep={activeStep}>
                {ADMISSION_STEPS.map((step, index) => {
                    const enabled = canNavigate(step);
                    const completed = index < activeStep;

                    return (
                        <Step key={step.key} completed={completed}>
                            <StepLabel>
                                <Button
                                    disabled={!enabled}
                                    onClick={() => enabled && router.push(step.path)}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: enabled ? 600 : 400,
                                        cursor: enabled ? 'pointer' : 'not-allowed',
                                    }}
                                >
                                    {step.label}
                                </Button>
                            </StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
        </Box>
    );
}
