// 액션 타입 정의
import axios from "axios";
import { fetchProductsSuccess } from "../slices/receiveListReducer";

// 입고 List 뽑는 구문
// 비동기로 products 데이터를 가져오는 액션 크리에이터 함수
export const selectedReceiveList =
  (receiveCode, manager, searchStartDate, searchEndDate) => async (dispatch) => {
    try {
      const response = await axios.get("http://localhost:8888/api/receive/list", {
        params: {
          receiveCode: receiveCode,
          manager: manager,
          startDate: searchStartDate,
          endDate: searchEndDate,
        },
      });
      const products = response.data;
      // Process the response data here, update your UI, etc.
      dispatch(fetchProductsSuccess(products));
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error("Error fetching data:", error);
    }
  };
