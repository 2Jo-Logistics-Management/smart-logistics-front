
import axios from 'axios';

//발주등록에서 insert
const itemAddAxios = (pOrderInsertDto) => {
    console.log("비동기 통신"+pOrderInsertDto);
      axios.post('http://localhost:8888/api/porder/insert',pOrderInsertDto)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
  };

export default itemAddAxios;
