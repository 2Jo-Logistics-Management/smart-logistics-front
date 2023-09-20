import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedPOrderList: [], 
};

const SelectedPOrderListReducer = createSlice({
  name: 'pOrderList',
  initialState,
  reducers: {
    selectedPOrderList: (state, action) => {
      state.selectedPOrderList = action.payload;

    },
    REMOVE_ALL_SELECTED_PORDER_LIST: (state, action) => {
      state.selectedPOrderList = action.payload;
    }
  }
});

export const { selectedPOrderList, REMOVE_ALL_SELECTED_PORDER_LIST } = SelectedPOrderListReducer.actions;
export default SelectedPOrderListReducer.reducer;
