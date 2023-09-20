import axios from "axios";
import swal from "sweetalert2";
axios.defaults.withCredentials = true;
const receiveItemUpdateAxios = (
  receiveCode,
  receiveItemNo,
  receiveCounts,
  selectWarehouse,
  porderCode,
  porderItemNo
) => {
  const modifyCount = receiveCounts.toString().replace(/,/g, "") || "";
  const modifyWarehouseNo = selectWarehouse.toString().replace(/,/g, "") || "";
  const receiveItems = {
    receiveCode: receiveCode,
    receiveItemNo: receiveItemNo,
    receiveCount: modifyCount,
    warehouseNo: modifyWarehouseNo,
    pOrderCode: porderCode,
    pOrderItemNo: porderItemNo,
  };
  axios
    .patch("http://localhost:8888/api/receive-item/modify", receiveItems)
    .then(() => {
      swal.fire({
        title: "수정 완료",
        text: "입고품목이 수정되었습니다.",
        icon: "success",
      });
    })
    .catch((error) => {
      swal.fire({
        title: "수정 실패",
        text: `Error: ${error.message}`,
        icon: "error",
      });
    });
};
export default receiveItemUpdateAxios;
