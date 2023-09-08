import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    warehouseSectionList: [], // 초기 상태는 빈 배열로 설정
};

const warehouseSectionReducer = createSlice({
  name: 'warehouseSectionList',
  initialState,
  reducers: {
    warehouseSectionListReducer: (state, action) => {
      state.warehouseSectionList = action.payload;
    },
  }
});

export const { warehouseSectionListReducer } = warehouseSectionReducer.actions;
export default warehouseSectionReducer.reducer;
