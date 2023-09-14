// 액션 타입 정의
import axios from "axios";
import { searchPOrder } from '../slices/pOrderListReducer'
;

// 발주 List 뽑는 구문
// 비동기로 products 데이터를 가져오는 액션 크리에이터 함수
export const searchPOrderList = (accountNo,pOrderCode,formatedStartDate,formatedEndDate) => async (dispatch) => {
  try {
    const response = await axios.get(`http://localhost:8888/api/porder/list?accountNo=${accountNo}&pOrderCode=${pOrderCode}&startDate=${formatedStartDate}&endDate=${formatedEndDate}`);
    const products = response.data;
    console.log("검색중" +products)
    dispatch(searchPOrder(products));
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};
