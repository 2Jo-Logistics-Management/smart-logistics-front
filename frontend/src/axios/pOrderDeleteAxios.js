import axios from "axios";
import swal from "sweetalert2";
axios.defaults.withCredentials = true;

const pOrderDeleteAxios = async (pOrderCodes) => {
  try {
    await axios.delete(`http://localhost:8888/api/porder/delete?pOrderCodes=${pOrderCodes}`);
    // If the request is successful, this code will execute
    swal.fire({
      title: "삭제 완료",
      text: "재고가 삭제되었습니다.",
      icon: "success",
    });
  } catch (error) {
    // If there's an error, this code block will execute
    if (error.response && error.response.status === 400) {
      swal.fire({
        title: "삭제 실패",
        text: "발주가 진행된 이후로는 삭제할 수 없습니다.",
        icon: "error",
      });
    } else {
      // Handle other errors
      console.error("An error occurred:", error);
    }
  }
};

export default pOrderDeleteAxios;
