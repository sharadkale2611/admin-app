// courses/[id]/page.tsx
'use client';

import { useCourseDetailsViewModel } from "@/lib/features/course/useCourseDetailsViewModel";
import { Alert, Container, Skeleton } from "@mui/material";
import { useParams } from "next/navigation";
import { useState } from "react";
import { CourseHeader } from "./components/CourseHeader";
import { CourseTabs } from "./components/CourseTabs";
import { CourseDetailsTab } from "./components/CourseDetailsTab";
import { FeesTab } from "./components/FeesTab";
import { ModulesTab } from "./components/ModulesTab";
import { BatchesTab } from "./components/BatchesTab";
import TeachersTab from "./components/TeachersTab";

export default function CourseDetailsPage() {
    const { id } = useParams();
    const { course, isLoading, error } = useCourseDetailsViewModel(id as string);
    const [tabIndex, setTabIndex] = useState(0);

    if (isLoading) return <Skeleton />;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!course) return <Alert severity="warning">Course not found</Alert>;

    return (
        <Container maxWidth="lg">
            <CourseHeader course={course} />
            <CourseTabs value={tabIndex} onChange={setTabIndex} />

            {tabIndex === 0 && <CourseDetailsTab 
                course={course}
                courseId={course.courseId}            
            />}
            {tabIndex === 1 && <FeesTab course={course} />}
            {tabIndex === 2 && <ModulesTab course={course} />}
            {tabIndex === 3 && <TeachersTab courseId={course.courseId} />}
            {tabIndex === 4 && <BatchesTab courseId={course.courseId} />}
        </Container>
    );
}
