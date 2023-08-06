import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import pOrderItemUpdateAxios from "../../axios/POrderItemUpdateAxios";

// 비동기 액션
export const pOrderItemUpdateThunk = createAsyncThunk(
  'selectedProduct/pOrderItemUpdate',
  async (indexData, { rejectWithValue }) => {
    try {
      const response =  pOrderItemUpdateAxios(indexData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 초기 상태
const initialState = {
    seletedPOrder: [],
    indexData: [],
};

// 슬라이스 생성
const selectedPOrderReducer = createSlice({
  name: 'selectedProduct',
  initialState,
  reducers: {
    seletedPOrderDetails: (state, action) => {
      state.seletedPOrder.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(pOrderItemUpdateThunk.pending, (state) => {
        // 여기에 비동기 액션 시작 시 처리할 로직을 작성
        // 예: 로딩 상태 변경
      })
      .addCase(pOrderItemUpdateThunk.fulfilled, (state, action) => {
        // 비동기 액션 성공 시 처리할 로직을 작성
        // 예: 데이터 업데이트
        state.indexData.push(action.payload);
      })
      .addCase(pOrderItemUpdateThunk.rejected, (state, action) => {
        // 비동기 액션 실패 시 처리할 로직을 작성
        // 예: 오류 메시지 설정
      });
  }
});

export const { seletedPOrderDetails } = selectedPOrderReducer.actions;
export default selectedPOrderReducer.reducer;
