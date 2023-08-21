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

      .addCase(pOrderItemUpdateThunk.fulfilled, (state, action) => {
         state.indexData.push(action.payload);
      })
  }
});

export const { seletedPOrderDetails } = selectedPOrderReducer.actions;
export default selectedPOrderReducer.reducer;
