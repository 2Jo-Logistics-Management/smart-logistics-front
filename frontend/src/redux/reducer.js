import { combineReducers } from '@reduxjs/toolkit';
import porderModalDuck from './slices/porderModalDuck'
import selectedProductsReducer from './slices/selectedProductsReducer'
import selectedPOrderReducer from './slices/selectedPOrderReducer'
import pOrderListReducer from './slices/pOrderListReducer'
import receiveListReducer from './slices/receiveListReducer'
import warehouseListReducer  from './slices/warehouseListReducer';
import loginResponseReducer from './slices/loginResponseReducer';
import logoutResponseReducer from './slices/logoutResponseReducer';

const rootReducer = combineReducers({
    porderModal: porderModalDuck,
    selectedProduct: selectedProductsReducer,
    selectedPOrder: selectedPOrderReducer, 
    pOrderList: pOrderListReducer,
    receiveList: receiveListReducer,
    warehouseList: warehouseListReducer,
    loginResponse: loginResponseReducer,
    logoutResponse: logoutResponseReducer
});


export default rootReducer;