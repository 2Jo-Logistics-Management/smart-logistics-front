import axios from "axios";
import swal from "sweetalert2";

axios.defaults.withCredentials = true;

const ItemInsertAxios = (itemInsertDto, closeModal) => {
  axios
    .post(`http://localhost:8888/api/item/insert`, itemInsertDto)
    .then((response) => {
      swal
        .fire({
          title: "수정 완료",
          text: "데이터가 수정되었습니다.",
          icon: "success",
        })
        .then(() => {
          alert(response.data.data);
          closeModal();
          window.location.reload();
        });
    })
    .catch((error) => {
      swal.fire({
        title: "삭제 실패",
        text: `${error.data.message}`,
        icon: "error",
      });
    })
    .catch((error) => {
      alert(error.message);
    });
};

export default ItemInsertAxios;
