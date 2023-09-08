import axios from "axios";
import swal from "sweetalert2";
axios.defaults.withCredentials = true;
// 입고품목 리스트에서 delete하면 통신
const receiveItemDeleteAxios = (selectedProducts) => {
  console.log("선택된데이터 : " + JSON.stringify(selectedProducts));

  axios
    .delete("http://localhost:8888/api/receive-item/delete", {
      data: selectedProducts,
    })
    .then((response) => {
      console.log(response.data);
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

export default receiveItemDeleteAxios;
