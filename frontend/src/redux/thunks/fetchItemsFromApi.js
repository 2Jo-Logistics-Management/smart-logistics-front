import axios from "axios";
import { fetchItemsFromApiSuccess } from "../slices/ItemsReducer";
import swal from "sweetalert2";

export const fetchItemsFromApi = () => async (dispatch) => {
  try {
    const response = await axios.get("http://localhost:8888/api/item/list");
    const items = response.data;

    dispatch(fetchItemsFromApiSuccess(items));
  } catch (error) {
    swal.fire({
      title: "에러 발생",
      text: "물품 리스트 조회 에러 발생",
      icon: "error",
    })
  }
};
