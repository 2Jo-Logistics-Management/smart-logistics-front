import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // 초기 상태는 빈 배열
  currentPage: 0,
  willBeChangeItemCode: -1,
  reloadFlag: false,
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
      alert(state.willBeChangeItemCode);
    },
    CHANGE_RELOAD_FLAG: (state) => {
      state.reloadFlag = !state.reloadFlag;
    }
  },
});

export const { fetchItemsFromApiSuccess, fetchSearchItemsFromApiSuccess, changeCurrentPage, WILL_BE_CHANGE_ITEM_CODE, CHANGE_RELOAD_FLAG } = ItemsReducer.actions;
export default ItemsReducer.reducer;
