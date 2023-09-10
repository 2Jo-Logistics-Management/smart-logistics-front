
import axios from "axios";
import { setRecentPOrderNumber } from '../slices/searchRecentPOrderNumber';


export const searchRecentPK = () => async (dispatch) => {
  try {
    const response = await axios.get('http://localhost:8888/api/porder/searchRecentPK');
    const products = response.data;
    dispatch(setRecentPOrderNumber(products));
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};
