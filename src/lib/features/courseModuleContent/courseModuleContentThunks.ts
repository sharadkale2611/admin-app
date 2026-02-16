import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/services/apiService";
import API_ENDPOINTS from "@/lib/config/apiConfig";
import {
  CourseModuleContentDto,
  CourseModuleContentResponseDto
} from "./courseModuleContentTypes";
import type { AppDispatch, RootState } from "@/lib/store";

interface ApiWrapper<T>{
  success:boolean;
  data?:T;
  message?:string;
}

const mapResponse=<T>(response:any):T|null=>{
  if(Array.isArray(response)) return response as T;
  if(response?.success) return (response.data ?? null) as T;
  return null;
};

// GET
export const fetchContents=createAsyncThunk<
CourseModuleContentResponseDto[],
void,
{dispatch:AppDispatch;state:RootState;rejectValue:string}
>("courseModuleContents/fetch",async(_,{rejectWithValue})=>{
  try{
    const res=await api.get<ApiWrapper<CourseModuleContentResponseDto[]>>(
      API_ENDPOINTS.COURSE_MODULE_CONTENTS.GET_LIST,
      {withCredentials:true}
    );

    const data=mapResponse<CourseModuleContentResponseDto[]>(res);
    if(!data) return rejectWithValue("No content");

    return data;

  }catch(e:any){
    return rejectWithValue(e?.message||"Failed");
  }
});

// CREATE
export const createContent=createAsyncThunk<
{success:boolean;content:CourseModuleContentResponseDto},
CourseModuleContentDto,
{dispatch:AppDispatch;state:RootState;rejectValue:string}
>("courseModuleContents/create",async(dto,{rejectWithValue})=>{
  try{
    const res=await api.post<ApiWrapper<CourseModuleContentResponseDto>>(
      API_ENDPOINTS.COURSE_MODULE_CONTENTS.POST_CREATE,
      dto,
      {withCredentials:true}
    );

    const created=mapResponse<CourseModuleContentResponseDto>(res);
    if(!created) return rejectWithValue("Create failed");

    return {success:true,content:created};

  }catch(e:any){
    return rejectWithValue(e?.message||"Failed");
  }
});

export const updateContent = createAsyncThunk<
  { success:boolean; content:CourseModuleContentResponseDto },
  { id:number; data:CourseModuleContentDto },
  { rejectValue:string }
>(
"courseModuleContents/update",
async ({ id, data }, { rejectWithValue }) => {

  try {

    const res = await api.put<ApiWrapper<CourseModuleContentResponseDto>>(
      `${API_ENDPOINTS.COURSE_MODULE_CONTENTS.PUT_UPDATE}/${id}`,
      data,
      { withCredentials:true }
    );

    const updated = mapResponse<CourseModuleContentResponseDto>(res);

    if(!updated)
      return rejectWithValue("Update failed");

    return { success:true, content:updated };

  } catch(e:any) {
    return rejectWithValue(e?.message || "Update failed");
  }
});


// DELETE
export const deleteContent=createAsyncThunk<
{success:boolean;id:number},
number,
{dispatch:AppDispatch;state:RootState;rejectValue:string}
>("courseModuleContents/delete",async(id,{rejectWithValue})=>{
  try{
    const res=await api.delete<ApiWrapper<any>>(
      `${API_ENDPOINTS.COURSE_MODULE_CONTENTS.DELETE}/${id}`,
      {withCredentials:true}
    );

    if(!res.success) return rejectWithValue("Delete failed");

    return {success:true,id};

  }catch(e:any){
    return rejectWithValue(e?.message||"Failed");
  }
});
