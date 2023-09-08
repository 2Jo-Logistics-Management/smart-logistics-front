import axios from "axios";
import swal from "sweetalert2";
axios.defaults.withCredentials = true;
const receiveInsertAxios = async ([receiveManager, finalReceiveDateTime, { insertData }]) => {
  console.log("insertAxios, receiveManager : " + receiveManager);
  console.log("insertAxios, finalReceiveDateTime : " + finalReceiveDateTime);

  console.log("insertAxios, insertData : " + JSON.stringify(insertData));
  try {
    const receiveInsertData = {
      receiveDate: finalReceiveDateTime,
      manager: receiveManager,
      receiveItems: insertData,
    };
    console.log(receiveInsertData);
    await axios.post("http://localhost:8888/api/receive/insert", receiveInsertData);

    swal.fire({
      title: "입고 등록 완료.",
      text: "입고 및 재고가 완료되었습니다.",
      icon: "success",
      showConfirmButton: false,
    });
  } catch (error) {
    swal.fire({
      title: "오류 발생",
      text: "데이터 저장 중 오류가 발생했습니다.",
      icon: "error",
      showConfirmButton: false,
    });
  }
};

export default receiveInsertAxios;
