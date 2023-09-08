
import axios from 'axios';
axios.defaults.withCredentials = true;
//발주등록에서 insert
const itemAddAxios = async (pOrderInsertDto) => {
      await axios.post('http://localhost:8888/api/porder/insert',pOrderInsertDto)
        .then((response) => {
        })
        .catch((error) => {
          console.error(error);
        });
  };

export default itemAddAxios;
