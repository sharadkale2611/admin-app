// lib/store.ts
import { createWrapper } from 'next-redux-wrapper';
import {
    persistReducer,
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { authReducer } from '@/lib/features/auth/authStore';
import { sessionReducer } from '@/lib/features/session/sessionSlice';
import { sessionMiddleware, sessionMonitorMiddleware } from '@/lib/features/session/sessionMiddleware';
import { configureStore, combineReducers, ThunkDispatch, AnyAction } from '@reduxjs/toolkit';
import { initializeAuthInterceptor } from '@/lib/services/apiService';
import { firmReducer } from './features/firm/firmSlice';
import  staffReducer  from './features/staff/staffSlice'; 
import { courseCategoryReducer } from './features/courseCategory/courseCategorySlice';
import { courseReducer} from './features/course/courseSlice'
import { studentReducer } from './features/student/studentSlice';
import { admissionReducer } from './features/admission/admissionSlice'
import { courseFeeReducer } from './features/fees/feesSlice';
import { discountCodeReducer } from './features/discountCode/discountCodeSlice';
import { classRoomReducer } from "@/lib/features/classRoom/classRoomSlice";
import { moduleReducer } from "@/lib/features/module/moduleSlice";
import { courseModuleReducer } from "@/lib/features/courseModules/courseModuleSlice";
import batchReducer from "@/lib/features/batch/batchSlice";
import { studentBatchAssignmentReducer } from "@/lib/features/studentBatchAssignment/studentBatchAssignmentSlice";
import batchStudyWorksReducer from "@/lib/features/BatchStudyWorks/batchStudyWorkSlice";
import batchSchedulesReducer from "@/lib/features/batchSchedules/batchScheduleSlice";
import noticeReducer from "@/lib/features/notice/noticeSlice";
import { studentPaymentReducer } from "@/lib/features/studentPayment/studentPaymentSlice";

import examReducer from "@/lib/features/exam/examSlice";
import examMarksReducer from "@/lib/features/examMarks/examMarksSlice";
import attendanceSessionReducer from '@/lib/features/attendance/attendanceSessionSlice';
import admissionDraftReducer from '@/lib/features/admission/admissionDraftSlice';
import sessionStorageEngine from '@/lib/utils/sessionStorage';
import locationReducer from "@/lib/features/location/locationSlice";
import dashboardReducer from "@/lib/features/dashboard/dashboardSlice";
import permissionReducer from "@/lib/features/permission/permissionSlice";
import roleReducer from "@/lib/features/roles/roleSlice";
import rolePermissionReducer from "@/lib/features/role-permissions/rolePermissionSlice";
import courseModuleContentReducer from "@/lib/features/courseModuleContent/courseModuleContentSlice";
import questionTypeReducer from "@/lib/features/questionType/questionTypeSlice";
import questionTypeRuleReducer from "@/lib/features/questionTypeRule/questionTypeRuleSlice";
import  questionReducer  from "@/lib/features/question/questionSlice";
import examPaperReducer from "@/lib/features/exampaper/examPaperSlice";
import questionOptionReducer from "@/lib/features/questionOption/questionOptionSlice";
import questionAttachmentReducer from "@/lib/features/questionAttachment/questionAttachmentSlice";
import questionAnswerReducer from "@/lib/features/questionAnswer/questionAnswerSlice";
import examPaperQuestionReducer from "@/lib/features/examPaperQuestion/examPaperQuestionSlice";
import examAttemptReducer from "@/lib/features/examAttempt/examAttemptSlice";
import examAttemptQuestionReducer from "@/lib/features/examAttemptQuestion/examAttemptQuestionSlice";
import studentAnswerReducer from "@/lib/features/studentAnswer/studentAnswerSlice";
import saasFeatureReducer from "@/lib/features/saasfeature/saasFeatureSlice"; 


const admissionDraftPersistConfig = {
    key: 'admissionDraft',
    storage: sessionStorageEngine,
};


const rootReducer = combineReducers({
    auth: authReducer,
    session: sessionReducer,    
    firms: firmReducer,
    staff: staffReducer,
    courseCategories: courseCategoryReducer,
    courses: courseReducer,
    courseFees: courseFeeReducer,
    students: studentReducer,
    admissions: admissionReducer,
    discountCodes: discountCodeReducer,
    classRooms: classRoomReducer,
    modules: moduleReducer,
    courseModules: courseModuleReducer,
    batches:batchReducer,
    studentBatchAssignments: studentBatchAssignmentReducer,
    batchStudyWorks: batchStudyWorksReducer,
    batchSchedules: batchSchedulesReducer,
    notices: noticeReducer,
    studentPayments: studentPaymentReducer,
    exam: examReducer,
    examMarks: examMarksReducer,
    attendanceSession: attendanceSessionReducer,
    dashboard: dashboardReducer,
    courseModuleContents: courseModuleContentReducer,
   examPapers: examPaperReducer,
   examPaperQuestions: examPaperQuestionReducer,
    admissionDraft: persistReducer(
        admissionDraftPersistConfig,
        admissionDraftReducer
    ),
    location: locationReducer,
    permissions: permissionReducer,
    roles: roleReducer,
    rolePermissions: rolePermissionReducer,
    questionTypes: questionTypeReducer,
    questionTypeRules: questionTypeRuleReducer,
    questions: questionReducer,
    questionOptions: questionOptionReducer,
    questionAttachments: questionAttachmentReducer,
    questionAnswers: questionAnswerReducer,
    examAttempts: examAttemptReducer,
    examAttemptQuestions: examAttemptQuestionReducer,
    studentAnswers: studentAnswerReducer,
    saasFeatures: saasFeatureReducer,  


});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['auth'],

};


const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat([sessionMiddleware, sessionMonitorMiddleware]),
    devTools: process.env.NODE_ENV !== 'production',
});

// Initialize auth interceptor after store creation
initializeAuthInterceptor(store.dispatch);

export const persistor = persistStore(store);
export const wrapper = createWrapper(() => store);