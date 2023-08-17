import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [], // 초기 상태는 빈 배열로 설정
};

const loginResponseReducer = createSlice({
  name: 'loginResponse',
  initialState,
  reducers: {
    success: (state, action) => {
      state.data = action.payload;
    },
    close: (state) => {
        state.data = [];
    }
  }
});

export const { success } = loginResponseReducer.actions;
export const { close } = loginResponseReducer.actions;
export default loginResponseReducer.reducer;
