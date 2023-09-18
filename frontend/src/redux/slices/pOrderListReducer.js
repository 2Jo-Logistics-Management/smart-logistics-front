import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  reload: false,
};

const pOrderListReducer = createSlice({
  name: 'pOrderList',
  initialState,
  reducers: {
    fetchProductsSuccess: (state, action) => {
      state.products = action.payload;

    },
    searchPOrder: (state, action) =>{
      
      state.products = action.payload;
    },
    reload: (state,action) => {
      state.reload = action.payload;
    }
  }
});

export const { fetchProductsSuccess,searchPOrder,reload } = pOrderListReducer.actions;
export default pOrderListReducer.reducer;
