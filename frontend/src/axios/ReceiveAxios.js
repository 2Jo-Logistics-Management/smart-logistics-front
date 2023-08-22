// porderAxios.js

import axios from "axios";

//입고리스트에서 select하면 통신
const ReceiveAxios = (selectedProducts, dispatch) => {
  if (selectedProducts.length === 1) {
    const productId = selectedProducts[0];
    console.log(productId);
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
