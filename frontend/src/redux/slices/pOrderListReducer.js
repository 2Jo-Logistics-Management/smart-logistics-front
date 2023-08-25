import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [], // 초기 상태는 빈 배열로 설정
};

const pOrderListReducer = createSlice({
  name: 'pOrderList',
  initialState,
  reducers: {
    fetchProductsSuccess: (state, action) => {
      state.products = action.payload;

    },
    searchPOrder: (state, action) =>{
      console.log("reducer"+JSON.stringify(action.payload))
      state.products = action.payload;
    }
  }
});

export const { fetchProductsSuccess,searchPOrder } = pOrderListReducer.actions;
export default pOrderListReducer.reducer;
