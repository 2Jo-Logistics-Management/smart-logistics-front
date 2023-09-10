import axios from 'axios';
import { swal } from 'sweetalert2';

axios.defaults.withCredentials = true;

// 발주등록에서 insert
const itemAddAxios = async (pOrderInsertDto) => {
  try {
    await axios.post('http://localhost:8888/api/porder/insert', pOrderInsertDto);
  } catch (error) {
    console.error(error); // 오류 로그는 여기서 남기고
    // 오류 발생 시 오류 메시지를 표시
    swal.fire({
      title: '오류 발생',
      text: '발주를 추가하지 못하였습니다 데이터를 모두 입력해주세요',
      icon: 'error',
      showConfirmButton: false,
    });
    throw error; // 오류를 상위 호출자로 다시 던질 수도 있습니다.
  }
};

export default itemAddAxios;
