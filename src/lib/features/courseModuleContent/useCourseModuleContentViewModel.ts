'use client';

import { useCallback,useEffect } from "react";
import { useAppDispatch,useAppSelector } from "@/lib/hooks";
import { fetchContents,createContent,updateContent,deleteContent } from "./courseModuleContentThunks";
import { CourseModuleContentDto } from "./courseModuleContentTypes";

export const useCourseModuleContentViewModel=()=>{

  const dispatch=useAppDispatch();
  const {contents,loading,error}=useAppSelector(s=>s.courseModuleContents);

  const load=useCallback(()=>{dispatch(fetchContents());},[dispatch]);

  const create=useCallback(async(data:CourseModuleContentDto)=>{
    return await dispatch(createContent(data)).unwrap();
  },[dispatch]);

  const update=useCallback(async({id,data}:{id:number;data:CourseModuleContentDto})=>{
    return await dispatch(updateContent({id,data})).unwrap();
  },[dispatch]);

  const remove=useCallback(async(id:number)=>{
    const res=await dispatch(deleteContent(id)).unwrap();
    return res.success;
  },[dispatch]);

  useEffect(()=>{load();},[load]);

  return{
    contents,
    isLoading:loading,
    error,
    createContent:create,
    updateContent:update,
    deleteContent:remove,
    refetch:load
  };
};
