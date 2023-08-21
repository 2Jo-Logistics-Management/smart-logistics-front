import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [], 
  isLoggedIn: false, 
};

const logoutresponseReducer = createSlice({
  name: 'logoutResponse',
  initialState,
  reducers: {
    success: (state, action) => {
      state.data = action.payload;
      state.isLoggedIn = true; 
    },
  }
});

export const { success } = logoutresponseReducer.actions;
export default logoutresponseReducer.reducer;