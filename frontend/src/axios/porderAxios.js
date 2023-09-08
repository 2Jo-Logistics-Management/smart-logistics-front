// porderAxios.js

import axios from 'axios';

//발주리스트에서 select하면 통신
const porderAxios = (selectedProducts, dispatch) => {
   
    if (selectedProducts.length === 1) {
      const productId = selectedProducts[0];
   
      axios.get(`/api/products/${productId}`)
        .then((response) => {
          dispatch({type : "seletedPOrderDetails", payload: response.data})
           
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

export default porderAxios;
