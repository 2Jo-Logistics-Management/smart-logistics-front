// 액션 타입 정의
import axios from "axios";
import {selectedPOrderList} from '../slices/SelectedPOrderListReducer'

// 입고 List 뽑는 구문
// 비동기로 products 데이터를 가져오는 액션 크리에이터 함수
export const seletedPOrderList = (selectedProducts) => async (dispatch) => {
  try {
    const pOrderCode = selectedProducts[0];
    // console.log("비동기에서 선택코드값"+pOrderCode);
    const response = await axios.get(`http://localhost:8888/api/porder-item/list?pOrderCode=${pOrderCode}`);
    // console.log(response.data)
    const products = response.data;
    // console.log("thunk: "+products);
    dispatch(selectedPOrderList(products));
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};
