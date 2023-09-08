import axios from "axios";
axios.defaults.withCredentials = true;

const ItemModifyAxios = (itemModifyDto, itemCode, closeModal) => {
    axios.patch(`http://localhost:8888/api/item/modify/${itemCode}`, itemModifyDto)
    .then(response => {
        alert(response.data.data);
        closeModal();
        window.location.reload();
    })
    .catch(error => {
        alert(error.message);
    })
}

export default ItemModifyAxios