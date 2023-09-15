import axios from "axios";
import swal from "sweetalert2";

axios.defaults.withCredentials = true;

const ItemInsertAxios = async (
  itemInsertDto,
  closeModal,
  isSuccessCallback
) => {
  let timerInterval;
  try {
    await axios.post(`http://localhost:8888/api/item/insert`, itemInsertDto);
    await swal
      .fire({
        title: "삽입 완료",
        text: "데이터가 삽입되었습니다.",
        icon: "success",
        timer: 1000,
        timerProgressBar: true,

        didOpen: () => {
          swal.showLoading();
          const b = swal.getHtmlContainer().querySelector("b");
          timerInterval = setInterval(() => {
            b.textContent = swal.getTimerLeft();
          }, 1000);
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      })
      .then(() => {
        isSuccessCallback();
      });
  } catch (error) {
    closeModal();
    swal.fire({
      title: "삽입 실패",
      text: `${error}`,
      icon: "error",
    });
  }
  // axios
  //   .post(`http://localhost:8888/api/item/insert`, itemInsertDto)
  //   .then((response) => {
  //     closeModal();
  //     swal
  //       .fire({
  //         title: "삽입 완료",
  //         text: "데이터가 삽입되었습니다.",
  //         icon: "success",
  //         timer: 1000,
  //         timerProgressBar: true,

  //         didOpen: () => {
  //           swal.showLoading();
  //           const b = swal.getHtmlContainer().querySelector("b");
  //           timerInterval = setInterval(() => {
  //             b.textContent = swal.getTimerLeft();
  //           }, 1000);
  //         },
  //         willClose: () => {
  //           clearInterval(timerInterval);
  //         },
  //       })
  //       .then(() => {
  //         isSuccessCallback(response.data.data);
  //       });
  //   })
  //   .catch((error) => {
  //     closeModal();
  //     swal.fire({
  //       title: "삽입 실패",
  //       text: `${error}`,
  //       icon: "error",
  //     });
  //   });
};

export default ItemInsertAxios;
