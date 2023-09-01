import axios from "axios";
axios.defaults.withCredentials = true;

const ItemDeleteAxios = (selectedItems) => {
    // 선택된 아이템들의 itemCode를 추출하여 itemCodes 배열에 담습니다.
    const itemCodes = selectedItems.map((item) => item.itemCode);
    axios.delete(`http://localhost:8888/api/item/delete`, {
        data: itemCodes,
    })
    .then((response) => {
        console.log(response.data);
        window.location.reload();
    })
    .catch((error) => {
        console.error(error);
    });
}

export default ItemDeleteAxios;