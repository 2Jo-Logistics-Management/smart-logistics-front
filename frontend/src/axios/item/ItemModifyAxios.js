import axios from "axios";
axios.defaults.withCredentials = true;

const ItemModifyAxios = (itemModifyDto, itemCode, closeModal) => {
  axios
    .patch(`http://localhost:8888/api/item/modify/${itemCode}`, itemModifyDto)
    .then((response) => {
      closeModal();
      swal
        .fire({
          title: "수정 완료",
          text: "데이터가 수정되었습니다.",
          icon: "success",
        })
        .then(() => {
          alert(response.data.data);
          window.location.reload();
        });
    })
    .catch((error) => {
      closeModal();
      swal.fire({
        title: "수정 실패",
        text: `${error}`,
        icon: "error",
      });
    });
};

export default ItemModifyAxios;
