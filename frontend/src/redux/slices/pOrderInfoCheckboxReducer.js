import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedCheckBox: [],
};

const pOrderInfoCheckbox = createSlice({
  name: 'selectedCheckBox',
  initialState,
  reducers: {
    toggleCheckbox: (state, action) => {
      const selectedIndex = state.selectedCheckBox.indexOf(action.payload);
      if (selectedIndex === -1) {
        state.selectedCheckBox.push(action.payload);
      } else {
        state.selectedCheckBox.splice(selectedIndex, 1);
      }
    },
    removePOrderInfo: (state, action) => {
        state.selectedCheckBox = [];
    }
  },
});

export const { toggleCheckbox,removePOrderInfo} = pOrderInfoCheckbox.actions;
export default pOrderInfoCheckbox.reducer;
