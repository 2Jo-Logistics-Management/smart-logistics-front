import axios from "axios";
import { fetchSearchItemsFromApiSuccess } from "../slices/ItemsReducer";

export const fetchSearchItemsFromApi = (searchItemCode, searchItemName, searchItemPrice) => async (dispatch) => {
    try {
        const response = await axios.get(`http://localhost:8888/api/item/list?itemCode=${searchItemCode}&itemName=${searchItemName}&itemPrice=${searchItemPrice}`);
        const searchItems = response.data;
        dispatch(fetchSearchItemsFromApiSuccess(searchItems));
    } catch (error) {
        alert('검색 에러 발생' + error.message);
    }
}