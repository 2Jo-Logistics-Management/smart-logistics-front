import axios from "axios";
axios.defaults.withCredentials = true;

const ItemInsertAxios = (itemInsertDto, closeModal) => {
  axios
    .post(`http://localhost:8888/api/item/insert`, itemInsertDto)
    .then((response) => {
      alert(response.data.data);
      closeModal();
      window.location.reload();
    })
    .catch((error) => {
      alert(error.message);
    });
};

export default ItemInsertAxios;
