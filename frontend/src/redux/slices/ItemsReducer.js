import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // 초기 상태는 빈 배열
  currentPage: 0,
  willBeChangeItemCode: -1,
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
    },
    WILL_BE_CHANGE_ITEM_CODE: (state, action) => {
      state.willBeChangeItemCode = action.payload;
    },
  },
});

export const { fetchItemsFromApiSuccess, fetchSearchItemsFromApiSuccess, changeCurrentPage, WILL_BE_CHANGE_ITEM_CODE } = ItemsReducer.actions;
export default ItemsReducer.reducer;
