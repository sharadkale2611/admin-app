// -----------------------------------------
// DB Model (Returned directly from backend)
// -----------------------------------------
export interface BatchScheduleDbModel {
  batchScheduleId: number;
  batchId: number;

  expectedDateTime: string;
  actualDateTime: string | null;

  expectedTrainerId: number | null;
  actualTrainerId: number | null;

  classRoomId: number | null;

  remark: string | null;

  status: string;

  isActive: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  isDeleted: boolean | null;
}

// -----------------------------------------
// For single schedule creation (UI → API)
// -----------------------------------------
export interface CreateBatchScheduleModel {
  expectedDateTime: string;              // "2025-12-09T09:00:00"
  expectedTrainerId?: number | null;
  classRoomId?: number | null;   
}

// -----------------------------------------
// For bulk schedule creation (UI → API)
// -----------------------------------------
export interface CreateBatchSchedulesBulkModel {
  batchId: number;
  items: CreateBatchScheduleModel[];
}

// -----------------------------------------
// STATE for Redux
// -----------------------------------------
export interface BatchSchedulesState {
  items: BatchScheduleDbModel[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}
