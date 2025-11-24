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
    classRooms: classRoomReducer

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