// 액션 타입 정의
import axios from "axios";
import {selectedPOrderList} from '../slices/SelectedPOrderListReducer'

// 입고 List 뽑는 구문
// 비동기로 products 데이터를 가져오는 액션 크리에이터 함수
export const seletedPOrderList = (selectedProducts) => async (dispatch) => {
  try {
    const pOrderCode = selectedProducts;
    const response = await axios.get(`http://localhost:8888/api/porder-item/list?pOrderCode=${pOrderCode}`);
    const products = response.data;
    dispatch(selectedPOrderList(products));
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};
