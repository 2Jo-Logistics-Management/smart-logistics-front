import { combineReducers } from '@reduxjs/toolkit';
import porderModalDuck from './slices/porderModalDuck'
import selectedProductsReducer from './slices/selectedProductsReducer'
import selectedPOrderReducer from './slices/selectedPOrderReducer'
const rootReducer = combineReducers({
    porderModal: porderModalDuck,
    selectedProduct: selectedProductsReducer,
    selectedPOrder: selectedPOrderReducer // 변경된 부분
});


export default rootReducer;