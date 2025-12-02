import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    ModuleState,
    ModuleResponseDto
} from "./moduleTypes";
import { createModule, deleteModule, fetchModuleById, fetchModules, updateModule } from "./moduleThunks";

const initialState: ModuleState = {
    modules: [],
    currentModule: null,
    totalCount: 0,
    pageSize: 10,
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null
};

const moduleSlice = createSlice({
    name: "modules",
    initialState,
    reducers: {
        clearCurrentModule: (state) => {
            state.currentModule = null;
        },
        clearModuleError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // FETCH ALL
            .addCase(fetchModules.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchModules.fulfilled, (state, action: PayloadAction<ModuleResponseDto[]>) => {
                state.loading = false;
                state.modules = action.payload;
                state.totalCount = action.payload.length;
                state.totalPages = Math.ceil(action.payload.length / state.pageSize);
            })
            .addCase(fetchModules.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to fetch modules";
            })

            // FETCH ONE
            .addCase(fetchModuleById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchModuleById.fulfilled, (state, action: PayloadAction<ModuleResponseDto>) => {
                state.loading = false;
                state.currentModule = action.payload;
            })
            .addCase(fetchModuleById.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to fetch module";
                state.currentModule = null;
            })

            // CREATE
            .addCase(createModule.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createModule.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success && action.payload.module) {
                    state.modules.unshift(action.payload.module);
                    state.totalCount += 1;
                    state.totalPages = Math.ceil(state.totalCount / state.pageSize);
                }
            })
            .addCase(createModule.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to create module";
            })

            // UPDATE
            .addCase(updateModule.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateModule.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success && action.payload.module) {
                    const index = state.modules.findIndex(m => m.moduleId === action.payload.module.moduleId);
                    if (index !== -1) state.modules[index] = action.payload.module;

                    if (state.currentModule?.moduleId === action.payload.module.moduleId) {
                        state.currentModule = action.payload.module;
                    }
                }
            })
            .addCase(updateModule.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to update module";
            })

            // DELETE
            .addCase(deleteModule.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteModule.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success) {
                    state.modules = state.modules.filter(m => m.moduleId !== action.payload.id);
                    state.totalCount -= 1;
                    state.totalPages = Math.ceil(state.totalCount / state.pageSize);

                    if (state.currentModule?.moduleId === action.payload.id) state.currentModule = null;
                }
            })
            .addCase(deleteModule.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to delete module";
            });
    }
});

export const { clearCurrentModule, clearModuleError } = moduleSlice.actions;

export const moduleReducer = moduleSlice.reducer;
export default moduleSlice.reducer;
