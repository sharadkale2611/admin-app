'use client';

import { useEffect, useState } from "react";
import { Grid, Paper, Typography, CircularProgress } from "@mui/material";
import { FeeForm } from "./fees/FeeForm";
import { FeeActions } from "./fees/FeeActions";
import FeesDetailsView from "./fees/FeesDetailsView";
import { formatDate } from "@/lib/utils/dateUtils";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchCourseFees } from "@/lib/features/fees/feesThunks";
import { useCourseFeesEditViewModel } from "@/lib/features/fees/useCourseFeesEditViewModel";
import useCreateCourseFeeViewModel from "@/lib/features/fees/useCreateCourseFeeViewModel";

export function FeesTab({ course }: { course: any }) {
    const dispatch = useAppDispatch();

    const { courseFees: fees, loading, loadedCourseId } = useAppSelector(
        (state) => state.courseFees
    );

    const isSameCourseLoaded =
        loadedCourseId === course.courseId && fees.length > 0;

    /* --------------------------------
       Fetch fees ONCE per course
    -------------------------------- */
    useEffect(() => {
        if (!course?.courseId) return;

        if (!isSameCourseLoaded) {
            dispatch(fetchCourseFees({ courseId: course.courseId }));
        }
    }, [course?.courseId, isSameCourseLoaded, dispatch]);
    /* --------------------------------
       Stable editing fee id
    -------------------------------- */
    const [editingFeeId, setEditingFeeId] = useState<string | null>(null);

    useEffect(() => {
        if (fees.length > 0 && fees[0]?.courseFeeId) {
            setEditingFeeId(String(fees[0].courseFeeId));
        } else {
            setEditingFeeId(null);
        }
    }, [fees]);

    const createVM = useCreateCourseFeeViewModel();
    const editVM = useCourseFeesEditViewModel(editingFeeId ?? "0");

    const [isEditingFees, setIsEditingFees] = useState(false);

    const fee = fees[0];
    const feesExist = Boolean(fee);

    /* --------------------------------
       Save handler
    -------------------------------- */
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (feesExist) {
            await editVM.handleUpdateCourseFee(editVM.formData);
        } else {
            await createVM.handleSubmit(e);
        }

        setIsEditingFees(false);

        // Explicit refresh after save (allowed)
        dispatch(fetchCourseFees({ courseId: course.courseId }));
    };

    /* --------------------------------
       RENDER
    -------------------------------- */
    if (loading && !loadedCourseId) {
        return <CircularProgress size={24} />;
    }

    return (
        <Grid container spacing={3}>
            {/* LEFT */}
            <Grid size={{ xs: 12, md: 8 }}>
                {!isEditingFees && feesExist && fee && (
                    <FeesDetailsView
                        feeAmount={Number(fee.feeAmount) || 0}
                        gstPercentage={Number(fee.gstPercentage) || 0}
                        totalInstallments={Number(fee.totalInstallments) || 0}
                        createdAt={fee.createdAt}
                        updatedAt={fee.updatedAt}
                    />
                )}

                {!isEditingFees && !feesExist && (
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6">Course Fees</Typography>
                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                            No fee structure added for this course.
                        </Typography>
                    </Paper>
                )}

                {isEditingFees && (
                    <FeeForm
                        formData={feesExist ? editVM.formData : createVM.formData}
                        totalFee={feesExist ? editVM.totalFee : createVM.totalFee}
                        onNumberChange={
                            feesExist
                                ? editVM.handleNumberChange
                                : createVM.handleNumberChange
                        }
                        isSubmitting={
                            feesExist
                                ? editVM.isSubmitting
                                : createVM.isSubmitting
                        }
                        onCancel={() => setIsEditingFees(false)}
                        onSubmit={handleSave}
                    />
                )}
            </Grid>

            {/* RIGHT */}
            <Grid size={{ xs: 12, md: 4 }}>
                <FeeActions
                    feesExist={feesExist}
                    isEditingFees={isEditingFees}

                    onAddEdit={() => {
                        createVM.setFormData((prev) => ({
                            ...prev,
                            courseId: Number(course.courseId),
                        }));
                        setIsEditingFees(true);
                    }}
                    createdAt={formatDate(fee?.createdAt)}
                    updatedAt={formatDate(fee?.updatedAt)}
                />
            </Grid>
        </Grid>
    );
}
