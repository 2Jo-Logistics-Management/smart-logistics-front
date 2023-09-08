import axios from "axios";
import { fetchItemsFromApiSuccess } from "../slices/ItemsReducer";

export const fetchItemsFromApi = () => async (dispatch) => {
  try {
    const response = await axios.get("http://localhost:8888/api/item/list");
    const items = response.data;

    dispatch(fetchItemsFromApiSuccess(items));
  } catch (error) {
    alert(error.message);
  }
};
