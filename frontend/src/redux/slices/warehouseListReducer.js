import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [], // 초기 상태는 빈 배열로 설정
};

const warehouseListReducer = createSlice({
  name: 'warehouseList',
  initialState,
  reducers: {
    fetchProductsSuccess: (state, action) => {
      state.products = action.payload;

    },
  }
});

export const { fetchProductsSuccess } = warehouseListReducer.actions;
export default warehouseListReducer.reducer;
