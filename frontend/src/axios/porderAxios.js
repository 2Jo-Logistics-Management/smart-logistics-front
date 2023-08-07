// porderAxios.js

import axios from 'axios';

//발주리스트에서 select하면 통신
const porderAxios = (selectedProducts, dispatch) => {
   
    if (selectedProducts.length === 1) {
      const productId = selectedProducts[0];
        console.log(productId);
      axios.get(`/api/products/${productId}`)
        .then((response) => {
          console.log(response.data);
          dispatch({type : "seletedPOrderDetails", payload: response.data})
           
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

export default porderAxios;
