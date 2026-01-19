import type { AdmissionDraftState } from '@/lib/features/admission/admissionDraftTypes';

const STORAGE_KEY = 'admissionDraft';

export const loadAdmissionDraft = (): AdmissionDraftState | undefined => {
    if (typeof window === 'undefined') return undefined;

    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : undefined;
    } catch {
        return undefined;
    }
};

export const saveAdmissionDraft = (draft: AdmissionDraftState) => {
    if (typeof window === 'undefined') return;

    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
        // ignore storage errors
    }
};

export const clearAdmissionDraftStorage = () => {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(STORAGE_KEY);
};