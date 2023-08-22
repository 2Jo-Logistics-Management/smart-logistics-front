import axios from "axios";

//입고 등록시 발주 "wait", "ing" 리스트 조회
// const pOrderWaitIngAxios = (searchPOrders) => {
//   console.log("porders_Data : " + JSON.stringify(searchPOrders));
//   axios
//     .get("http://localhost:8888/api/receive/insertWaiting", { data: searchPOrders })
//     .then((response) => {
//       console.log(response.data);
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// };

const pOrderWaitIngAxios = async (searchPOrders) => {
  console.log("porders_Data : " + JSON.stringify(searchPOrders));
  try {
    const response = await axios.get("http://localhost:8888/api/receive/insertWaiting", {
      data: searchPOrders,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default pOrderWaitIngAxios;
