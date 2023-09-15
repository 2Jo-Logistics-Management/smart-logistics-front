import axios from "axios";
import swal from "sweetalert2";
axios.defaults.withCredentials = true;
const receiveUpdateAxios = async ([receiveCode, editedManagerData, receiveModifyDate]) => {
  try {
    const receive = {
      receiveCode: receiveCode,
      manager: editedManagerData,
      receiveDate: receiveModifyDate,
    };

    const response = await axios.patch("http://localhost:8888/api/receive/modify", receive);

    swal.fire({
      title: "수정 완료",
      text: "입고정보가 수정되었습니다.",
      icon: "success",
    });
    return response;
  } catch (error) {
    swal.fire({
      title: "수정 실패",
      text: `Error: ${error.message}`,
      icon: "error",
    });
    throw error;
  }
};
export default receiveUpdateAxios;
