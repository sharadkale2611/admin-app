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

    const createCourseModuleAction = (data: CourseModuleDto) => dispatch(createCourseModule(data));
    const updateCourseModuleAction = (payload: { id: number; data: CourseModuleDto }) =>
        dispatch(updateCourseModule(payload));
    const deleteCourseModuleAction = (id: number) => dispatch(deleteCourseModule(id));

    useEffect(() => {
        if (!courseModules.length) {
            dispatch(fetchCourseModules());
        }
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
