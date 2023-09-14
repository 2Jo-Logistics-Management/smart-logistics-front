import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedItems: [],
};

const selectedItemsReducer = createSlice({
  name: "selectedItems",
  initialState,
  reducers: {
    ADD_SELECTED_ITEM: (state, action) => {
      state.selectedItems.push(action.payload);
    },
    REMOVE_SELECTED_ITEM: (state, action) => {
      state.selectedItems = state.selectedItems.filter(
        (itemCode) => itemCode !== action.payload
      );
    },
    REMOVE_SELECTED_ALL_ITEM: (state) => {
      state.selectedItems = [];
    },
  },
});

export const {
  ADD_SELECTED_ITEM,
  REMOVE_SELECTED_ITEM,
  REMOVE_SELECTED_ALL_ITEM,
} = selectedItemsReducer.actions;

export default selectedItemsReducer.reducer;
