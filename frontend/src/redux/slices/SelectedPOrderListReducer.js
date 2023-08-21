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
      console.log("reducer:"+JSON.stringify(state.selectedPOrderList));
    },
  }
});

export const { selectedPOrderList } = SelectedPOrderListReducer.actions;
export default SelectedPOrderListReducer.reducer;
