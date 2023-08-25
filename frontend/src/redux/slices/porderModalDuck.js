import { createSlice } from "@reduxjs/toolkit";


// 초기 상태
const initialState = {
  openModal: false,
  modalData: [],
  editedProducts: {},
};

// 리듀서
const porderModalReducer = createSlice({
  name: 'porderModal',
  initialState,
  reducers: {
    open_Modal: (state) => {
      state.openModal = true;
    },
    close_Modal: (state) => {
      state.openModal = false;
    },
    SAVE_MODAL_DATA: (state,action) => {
      state.modalData.push(action.payload);
      console.log("reducer에서: "+state.modalData);
      state.openModal = false;
      state.modalData = null;
    }
  }
});


export const {
  open_Modal,
  close_Modal,
  SAVE_MODAL_DATA,
} = porderModalReducer.actions;

export default porderModalReducer.reducer;
