import axios from "axios";
import swal from "sweetalert2";
axios.defaults.withCredentials = true;
const receiveDeleteAxios = (selectedProducts) => {
  axios
    .delete("http://localhost:8888/api/receive/delete", {
      data: selectedProducts,
    })
    .then(() => {
      swal.fire({
        title: "삭제 완료",
        text: "재고가 삭제되었습니다.",
        icon: "success",
      });
    })
    .catch((error) => {
      swal.fire({
        title: "삭제 실패",
        text: `Error: ${error.message}`,
        icon: "error",
      });
    });
};

export default receiveDeleteAxios;
