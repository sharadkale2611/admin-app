// src/app/(protected)/admissions/new/components/wizard/wizardSteps.ts
export type AdmissionStepRequirement =
    | 'studentConfirmed'
    | 'courseConfirmed'
    | 'pricingConfirmed';

export interface AdmissionStep {
    key: string;
    label: string;
    path: string;
    requires?: AdmissionStepRequirement;
}

export const ADMISSION_STEPS: readonly AdmissionStep[] = [
    {
        key: 'step-1',
        label: 'Student Details',
        path: '/admissions/new/step-1',
    },
    {
        key: 'step-2',
        label: 'Course & Fees',
        path: '/admissions/new/step-2',
        requires: 'studentConfirmed',
    },
    {
        key: 'step-3',
        label: 'Pricing',
        path: '/admissions/new/step-3',
        requires: 'courseConfirmed',
    },
    {
        key: 'step-4',
        label: 'Review',
        path: '/admissions/new/step-4',
        requires: 'pricingConfirmed',
    },
];
