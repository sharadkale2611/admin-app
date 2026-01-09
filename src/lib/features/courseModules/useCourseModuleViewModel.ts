import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import {
    fetchCourseModules,
    createCourseModule,
    updateCourseModule,
    deleteCourseModule
} from "./courseModuleThunks";
import { CourseModuleDto } from "./courseModuleTypes";
import { useEffect } from "react";

export const useCourseModuleViewModel = () => {
    const dispatch = useDispatch<AppDispatch>();

    const courseModules = useSelector((state: RootState) => state.courseModules.courseModules);
    const isLoading = useSelector((state: RootState) => state.courseModules.loading); // <-- updated
    const error = useSelector((state: RootState) => state.courseModules.error);

    const refetch = () => dispatch(fetchCourseModules());

    const createCourseModuleAction = async (data: CourseModuleDto) => {
        await dispatch(createCourseModule(data)).unwrap();
    };
    const updateCourseModuleAction = async (
        payload: { id: number; data: CourseModuleDto }
    ) => {
        return await dispatch(updateCourseModule(payload)).unwrap();
    };
    const deleteCourseModuleAction = async (id: number) => {
        await dispatch(deleteCourseModule(id)).unwrap();
    };
    useEffect(() => {
        // if (!courseModules.length) {
        //     dispatch(fetchCourseModules());
        // }
            dispatch(fetchCourseModules());
    }, [dispatch]);

    return {
        courseModules,
        isLoading,
        error,
        refetch,
        createCourseModule: createCourseModuleAction,
        updateCourseModule: updateCourseModuleAction,
        deleteCourseModule: deleteCourseModuleAction
    };
};
