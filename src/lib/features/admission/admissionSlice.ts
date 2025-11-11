// src/lib/features/admission/admissionSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    createAdmission,
    fetchAdmissions,
    updateAdmission,
    deleteAdmission,
    fetchAdmissionById
} from './admissionThunks';
import { Admission, AdmissionState, AdmissionStatus, EnrollmentType, PaginatedAdmissions } from './admissionTypes';

const initialState: AdmissionState = {
    admissions: [],
    currentAdmission: null,
    totalCount: 0,
    pageSize: 10,
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,
    searchTerm: '',
    statusFilter: null,           // boolean | null
    paymentStatusFilter: null,    // string | null
    enrollmentTypeFilter: null,   // EnrollmentType | null
    courseFilter: null,           // string | null
    page: 1
};

const admissionSlice = createSlice({
    name: 'admissions',
    initialState,
    reducers: {
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload;
            state.page = 1;
        },
        setStatusFilter: (state, action: PayloadAction<AdmissionStatus | null>) => {
            state.statusFilter = action.payload;
            state.page = 1;
        },
        setPaymentStatusFilter: (state, action: PayloadAction<string | null>) => {
            state.paymentStatusFilter = action.payload;
            state.page = 1;
        },
        setEnrollmentTypeFilter: (state, action: PayloadAction<EnrollmentType | null>) => {
            state.enrollmentTypeFilter = action.payload;
            state.page = 1;
        },
        setCourseFilter: (state, action: PayloadAction<string | null>) => {
            state.courseFilter = action.payload;
            state.page = 1;
        },
        resetFilters: (state) => {
            state.searchTerm = '';
            state.statusFilter = null;
            state.paymentStatusFilter = null;
            state.enrollmentTypeFilter = null;
            state.courseFilter = null;
            state.page = 1;
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        clearCurrentAdmission: (state) => {
            state.currentAdmission = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Admissions
            .addCase(fetchAdmissions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdmissions.fulfilled, (state, action: PayloadAction<PaginatedAdmissions>) => {
                state.loading = false;
                const { items, totalCount, pageSize, currentPage, totalPages } = action.payload;
                state.admissions = items;
                state.totalCount = totalCount;
                state.pageSize = pageSize;
                state.currentPage = currentPage;
                state.totalPages = totalPages;
            })
            .addCase(fetchAdmissions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error ?? "Failed to fetch admissions";
            })
            // Fetch Admission by ID
            .addCase(fetchAdmissionById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdmissionById.fulfilled, (state, action: PayloadAction<Admission>) => {
                state.loading = false;
                state.currentAdmission = action.payload;
            })
            .addCase(fetchAdmissionById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error ?? "Failed to fetch admission details";
                state.currentAdmission = null;
            })
            // Create Admission
            .addCase(createAdmission.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createAdmission.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success && action.payload.admission) {
                    state.admissions.unshift(action.payload.admission);
                    state.totalCount += 1;
                    state.totalPages = Math.ceil(state.totalCount / state.pageSize);
                }
            })
            .addCase(createAdmission.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error ?? "Failed to create admission";
            })
            // Update Admission
            .addCase(updateAdmission.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAdmission.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success) {
                    const index = state.admissions.findIndex(a => a.admissionId === action.payload.admission.admissionId);
                    if (index !== -1) {
                        state.admissions[index] = action.payload.admission;
                    }
                    if (state.currentAdmission && state.currentAdmission.admissionId === action.payload.admission.admissionId) {
                        state.currentAdmission = action.payload.admission;
                    }
                }
            })
            .addCase(updateAdmission.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error ?? "Failed to update admission";
            })
            // Delete Admission
            .addCase(deleteAdmission.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAdmission.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success) {
                    state.admissions = state.admissions.filter(a => a.admissionId !== action.payload.id);
                    state.totalCount -= 1;
                    state.totalPages = Math.ceil(state.totalCount / state.pageSize);
                }
            })
            .addCase(deleteAdmission.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error ?? "Failed to delete admission";
            });
    }
});

export const {
    setSearchTerm,
    setStatusFilter,
    setPaymentStatusFilter,
    setEnrollmentTypeFilter,
    setCourseFilter,
    resetFilters,
    setPage,
    clearCurrentAdmission
} = admissionSlice.actions;

export const admissionReducer = admissionSlice.reducer;
export default admissionSlice.reducer;
