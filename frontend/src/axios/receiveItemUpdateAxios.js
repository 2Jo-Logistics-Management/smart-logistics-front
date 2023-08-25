import axios from "axios";
import swal from "sweetalert2";
axios.defaults.withCredentials = true;
//입고품목 수정하면 통신
const receiveItemUpdateAxios = (indexData) => {
  axios
    .put(`http://localhost:8888/api/receive-item/delete/${indexData}`)
    .then((response) => {
      console.log(response.data);
      swal.fire({
        title: "수정 완료",
        text: "입고품목이 수정되었습니다.",
        icon: "success",
      });
    })
    .catch((error) => {
      swal.fire({
        title: "수정 실패",
        text: `Error: ${error.message}`,
        icon: "error",
      });
    });
};
export default receiveItemUpdateAxios;
