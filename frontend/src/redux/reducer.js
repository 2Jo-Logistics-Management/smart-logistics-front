import { combineReducers } from "@reduxjs/toolkit";
import porderModalDuck from "./slices/porderModalDuck";
import selectedProductsReducer from "./slices/selectedProductsReducer";
import selectedPOrderReducer from "./slices/selectedPOrderReducer";
import pOrderListReducer from "./slices/pOrderListReducer";
import receiveListReducer from "./slices/receiveListReducer";
import warehouseListReducer from "./slices/warehouseListReducer";
import SelectedPOrderListReducer from "./slices/SelectedPOrderListReducer";
import loginResponseReducer from "./slices/loginResponseReducer";
import receiveModalDuck from "./slices/receiveModalDuck";
import ItemsReducer from "./slices/ItemsReducer";
import selectedItemsReducer from "./slices/selectedItemsReducer";
import warehouseSectionListReducer from "./slices/warehouseSectionListReducer";
import searchRecentPOrderNumber from "./slices/searchRecentPOrderNumber";

const rootReducer = combineReducers({
  porderModal: porderModalDuck,
  selectedProduct: selectedProductsReducer,
  selectedPOrder: selectedPOrderReducer, 
  pOrderList: pOrderListReducer,
  receiveList: receiveListReducer,
  warehouseList: warehouseListReducer,
  selectedPOrderList: SelectedPOrderListReducer,
  loginResponse: loginResponseReducer,
  receiveModal: receiveModalDuck,
  items: ItemsReducer,
  selectedItems: selectedItemsReducer,
  warehouseSectionList : warehouseSectionListReducer,
  recentPOrderNumber:searchRecentPOrderNumber
});

export default rootReducer;
