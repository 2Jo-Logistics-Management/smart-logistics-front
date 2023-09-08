
// 액션 타입 정의
import axios from "axios";
import { warehouseSectionListReducer } from '../slices/warehouseSectionListReducer';


export const warehouseSectionList = () => async (dispatch) => {
  try {
    const response = await axios.get("http://localhost:8888/api/warehouse/list");
    const products = response.data;
    console.log("비동기통신중 : "+ JSON.stringify(products));
    dispatch(warehouseSectionListReducer(products));
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};
