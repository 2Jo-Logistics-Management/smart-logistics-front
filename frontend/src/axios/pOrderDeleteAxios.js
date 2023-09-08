import axios from "axios";
import swal from "sweetalert2";
axios.defaults.withCredentials = true;
//발주리스트에서 delete하면 통신
const pOrderDeleteAxios = (pOrderCode) => {
  axios
    .delete(`http://localhost:8888/api/porder/delete?pOrderCode=${pOrderCode}`)
    .then((response) => {

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

export default pOrderDeleteAxios;
