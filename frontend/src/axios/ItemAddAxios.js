

import axios from 'axios';

//발주등록에서 insert
const itemAddAxios = (selectedItems) => {
    console.log(selectedItems);
      axios.post(`/api/porder/${selectedItems}`)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
  };

export default itemAddAxios;
