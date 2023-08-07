import { combineReducers } from '@reduxjs/toolkit';
import porderModalDuck from './slices/porderModalDuck'
import selectedProductsReducer from './slices/selectedProductsReducer'
import selectedPOrderReducer from './slices/selectedPOrderReducer'
import pOrderListReducer from './slices/pOrderListReducer'
const rootReducer = combineReducers({
    porderModal: porderModalDuck,
    selectedProduct: selectedProductsReducer,
    selectedPOrder: selectedPOrderReducer, 
    pOrderList: pOrderListReducer,
});


export default rootReducer;