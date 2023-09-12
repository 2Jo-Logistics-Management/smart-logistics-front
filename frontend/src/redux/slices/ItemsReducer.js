import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // 초기 상태는 빈 배열
  currentPage: 0,
};

const ItemsReducer = createSlice({
  name: "items",
  initialState,
  reducers: {
    fetchItemsFromApiSuccess: (state, action) => {
      state.items = action.payload;
    },
    fetchSearchItemsFromApiSuccess: (state, action) => {
      state.items = action.payload;
      state.currentPage = 0;
    },
    changeCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    }
  },
});

export const { fetchItemsFromApiSuccess, fetchSearchItemsFromApiSuccess, changeCurrentPage } = ItemsReducer.actions;
export default ItemsReducer.reducer;
