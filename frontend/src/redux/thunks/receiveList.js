// 액션 타입 정의
import axios from "axios";
import { fetchProductsSuccess } from '../slices/receiveListReducer'

;

// 발주 List 뽑는 구문
// 비동기로 products 데이터를 가져오는 액션 크리에이터 함수
export const receiveListAll = () => async (dispatch) => {
  try {
    const response = await axios.get("http://localhost:8888/api/receive/list");
    const products = response.data;
    console.log("thunk: "+products);
    dispatch(fetchProductsSuccess(products));
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};
