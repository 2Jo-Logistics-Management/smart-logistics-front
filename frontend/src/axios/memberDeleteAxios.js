import axios from "axios";
import swal from "sweetalert2";

//입고리스트에서 delete하면 통신
const memberDeleteAxios = (selectedMember) => {
  axios
    .delete("http://localhost:8888/api/member/delete", {
      data: selectedMember,
    })
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

export default memberDeleteAxios;
