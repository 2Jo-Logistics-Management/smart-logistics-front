// porderAxios.js

import axios from "axios";
axios.defaults.withCredentials = true;
//입고리스트에서 select하면 통신
const ReceiveAxios = (selectedProducts, dispatch) => {
  if (selectedProducts.length === 1) {
    const productId = selectedProducts[0];

    axios
      .get(`receiveAxios`)
      .then((response) => {
        console.log(response.data);
        dispatch({ type: "seletedReceiveDetails", payload: response.data });
      })
      .catch((error) => {
        console.error(error);
      });
  }
};

export default ReceiveAxios;
