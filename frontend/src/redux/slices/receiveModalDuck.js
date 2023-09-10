import { createSlice } from "@reduxjs/toolkit";

// 초기 상태
const initialState = {
  openModal: false,
  modalData: [],
  editedProducts: {},
};

// 리듀서
const receiveModalReducer = createSlice({
  name: "receiveModal",
  initialState,
  reducers: {
    open_Modal: (state) => {
      state.openModal = true;
     
    },
    close_Modal: (state) => {
      state.openModal = false;
    },
    SAVE_MODAL_DATA: (state, action) => {
      state.modalData.push(action.payload);
      
      state.openModal = false;
      state.modalData = null;
    },
  },
});

export const { open_Modal, close_Modal, SAVE_MODAL_DATA } = receiveModalReducer.actions;

export default receiveModalReducer.reducer;
