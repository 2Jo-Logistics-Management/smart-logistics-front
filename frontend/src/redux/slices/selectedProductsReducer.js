import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  selectedProduct: [],
};


const selectedProductReducer = createSlice({
  name: 'selectedProduct',
  initialState,
  reducers: {
    ADD_SELECTED_PRODUCT: (state, action) => {
      state.selectedProduct.push(action.payload);
    },
    REMOVE_SELECTED_PRODUCT: (state, action) => {
      state.selectedProduct = state.selectedProduct.filter((id) => id !== action.payload);
    },
    REMOVE_ALL_SELECTED_PRODUCTS: (state) => {
      state.selectedProduct = [];
    },
 
  }
});

export const {
  ADD_SELECTED_PRODUCT,
  REMOVE_SELECTED_PRODUCT,
  REMOVE_ALL_SELECTED_PRODUCTS,
} = selectedProductReducer.actions;

export default selectedProductReducer.reducer;
