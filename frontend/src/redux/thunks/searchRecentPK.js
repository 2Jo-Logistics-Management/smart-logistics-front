
import axios from "axios";
import { setRecentPOrderNumber } from '../slices/searchRecentPOrderNumber';


export const searchRecentPK = () => async (dispatch) => {
  try {
    const response = await axios.get('http://localhost:8888/api/porder/searchRecentPK');
    const products = response.data;
    console.log("검색중" +JSON.stringify(products));
    dispatch(setRecentPOrderNumber(products));
    console.log("skndlaksndlanms")
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};
