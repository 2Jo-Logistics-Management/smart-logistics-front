import axios from "axios";
import swal from "sweetalert2";
axios.defaults.withCredentials = true;

const pOrderDeleteAxios = async (pOrderCodes) => { 
  try {
    const response = await axios.delete(`http://localhost:8888/api/porder/delete?pOrderCodes=${pOrderCodes}`);
    // If the request is successful, this code will execute
   
    await swal.fire({
      title: "삭제 완료",
      text: "발주가 삭제되었습니다",
      icon: "success",
    });
  } catch (error) {
    if (error.response && error.response.status === 400) {
      swal.fire({
        title: "삭제 실패",
        text: "진행이 된 발주는 삭제할 수 없습니다",
        icon: "error",
      });
    } else {
      console.error("An error occurred:", error);
    }
    
  }
};

export default pOrderDeleteAxios;
