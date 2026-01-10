// src/lib/features/studentPayment/studentPaymentSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { fetchStudentPaymentsByStudentId, updateStudentPayment } from "./studentPaymentThunk";
import type { StudentPayment } from "./studentPaymentType";
import type { ApiError } from "@/lib/features/studentPayment/studentPaymentThunk";

export interface StudentPaymentState {
    payments: StudentPayment[];
    loading: boolean;
    error: ApiError | null;
}

const initialState: StudentPaymentState = {
    payments: [],
    loading: false,
    error: null,
};

const studentPaymentSlice = createSlice({
    name: "studentPayments",
    initialState,
    reducers: {
        clearPayments(state) {
            state.payments = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // 🔹 Fetch Student Payments By StudentId
            .addCase(fetchStudentPaymentsByStudentId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudentPaymentsByStudentId.fulfilled, (state, action) => {
                state.loading = false;
                state.payments = action.payload; // StudentPayment[]
            })
            .addCase(fetchStudentPaymentsByStudentId.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as ApiError) ?? {
                        error: "Failed to fetch student payments",
                        errors: null,
                    };
            })
            .addCase(updateStudentPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateStudentPayment.fulfilled, (state, action) => {
                state.loading = false;

                const {
                    studentPaymentId,
                    paidAmount,
                    paymentMode,
                    transactionId,
                    paidDate,
                    paymentStatus
                } = action.payload;

                const payment = state.payments.find(
                    p => p.studentPaymentId === studentPaymentId
                );

                if (!payment) return;

                // 🔹 Update main payment
                payment.amountPaid = (payment.amountPaid ?? 0) + paidAmount;
                payment.paymentMode = paymentMode ?? payment.paymentMode;
                payment.transactionId = transactionId ?? payment.transactionId;
                payment.paidDate = paidDate ?? new Date().toISOString();

                // 🔹 Append payment log
                payment.paymentLogs.unshift({
                    paidAmount,
                    paymentMode,
                    transactionId,
                    paymentStatus: paymentStatus ?? "Success",
                    paidDate: paidDate ?? new Date().toISOString(),
                    createdAt: new Date().toISOString()
                })
            })

            .addCase(updateStudentPayment.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as ApiError) ?? {
                        error: "Failed to update payment",
                        errors: null
                    };
            });

    },
});

export const { clearPayments } = studentPaymentSlice.actions;
export const studentPaymentReducer = studentPaymentSlice.reducer;
export default studentPaymentSlice.reducer;
