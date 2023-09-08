import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    recentPOrderNumber: [], 
};

const searchRecentPOrderNumber = createSlice({
    name: 'recentPOrderNumber',
    initialState,
    reducers: {
      setRecentPOrderNumber: (state, action) => {
        console.log("reducer까지는 도달");
        state.recentPOrderNumber = action.payload; // 여기를 수정하였습니다.
        console.log("최근PORDERNumber" + JSON.stringify(state.recentPOrderNumber));
      },
    }
  });
  

export const { setRecentPOrderNumber } = searchRecentPOrderNumber.actions;
export default searchRecentPOrderNumber.reducer;
