import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    AdmissionDraftState,
    DraftStudent,
} from './admissionDraftTypes';
import { loadAdmissionDraft } from '@/lib/utils/admissionDraftStorage';

const persisted = loadAdmissionDraft();

const initialState: AdmissionDraftState = {
    student: persisted?.student ?? null,
    studentConfirmed: persisted?.studentConfirmed ?? false,

    courseId: persisted?.courseId,
    enrollmentType: persisted?.enrollmentType,
    enrollmentDate: persisted?.enrollmentDate,
    courseConfirmed: persisted?.courseConfirmed ?? false,
    academicDetails: persisted?.academicDetails,

    pricing: persisted?.pricing,
    pricingConfirmed: persisted?.pricingConfirmed ?? false,

    installments: persisted?.installments ?? [],
};


const admissionDraftSlice = createSlice({
    name: 'admissionDraft',
    initialState,
    reducers: {
        resetAdmissionDraft: () => initialState,
        setDraftStudent: (state, action: PayloadAction<DraftStudent>) => {
            state.student = action.payload;
            state.studentConfirmed = true;

            // Reset downstream steps
            state.courseConfirmed = false;
            state.pricingConfirmed = false;
        },

        resetStudentSelection: (state) => {
            state.student = null;
            state.studentConfirmed = false;
            state.courseConfirmed = false;
            state.pricingConfirmed = false;
        },

        setCourseDetails: (state, action) => {
            state.courseId = action.payload.courseId;
            state.enrollmentType = action.payload.enrollmentType;
            state.enrollmentDate = action.payload.enrollmentDate;
            state.academicDetails = action.payload.academicDetails;
            
            // Reset downstream
            state.courseConfirmed = true;
            state.pricingConfirmed = false;
        },

        setPricingDetails: (state, action) => {
            state.pricing = action.payload;
            state.pricingConfirmed = true;
        },

        // resetAdmissionDraft: () => ({
        //     student: null,
        //     studentConfirmed: false,
        //     courseConfirmed: false,
        //     pricingConfirmed: false,
        // }),
    },
});


export const {
    setDraftStudent,
    resetStudentSelection,
    setCourseDetails,
    setPricingDetails,
    resetAdmissionDraft,
} = admissionDraftSlice.actions;

export default admissionDraftSlice.reducer;
