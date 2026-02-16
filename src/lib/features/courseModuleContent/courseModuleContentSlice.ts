import { createSlice } from "@reduxjs/toolkit";
import { CourseModuleContentState } from "./courseModuleContentTypes";
import { fetchContents,createContent,updateContent,deleteContent } from "./courseModuleContentThunks";

const initialState:CourseModuleContentState={
  contents:[],
  loading:false,
  error:null
};

const slice=createSlice({
  name:"courseModuleContents",
  initialState,
  reducers:{},
  extraReducers:(builder)=>{
    builder
      .addCase(fetchContents.pending,(s)=>{s.loading=true;})
      .addCase(fetchContents.fulfilled,(s,a)=>{
        s.loading=false;
        s.contents=a.payload;
      })
      .addCase(createContent.fulfilled,(s,a)=>{
        if(a.payload.success) s.contents.unshift(a.payload.content);
      })
      .addCase(updateContent.fulfilled,(s,a)=>{
        if(a.payload.success){
          const i=s.contents.findIndex(x=>x.courseModuleContentId===a.payload.content.courseModuleContentId);
          if(i!==-1) s.contents[i]=a.payload.content;
        }
      })
      .addCase(deleteContent.fulfilled,(s,a)=>{
        if(a.payload.success){
          s.contents=s.contents.filter(x=>x.courseModuleContentId!==a.payload.id);
        }
      });
  }
});

export default slice.reducer;
