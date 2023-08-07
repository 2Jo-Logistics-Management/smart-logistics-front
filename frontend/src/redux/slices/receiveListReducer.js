import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [], // 초기 상태는 빈 배열로 설정
};

const receiveListReducer = createSlice({
  name: 'receiveList',
  initialState,
  reducers: {
    fetchProductsSuccess: (state, action) => {
      state.products = action.payload;
      console.log("reducer:"+JSON.stringify(state.products));

    },
  }
});

export const { fetchProductsSuccess } = receiveListReducer.actions;
export default receiveListReducer.reducer;
