import axios from "axios";

//입고 등록시 발주 "wait", "ing" 리스트 조회
axios.defaults.withCredentials = true;
const pOrderWaitIngAxios = async (searchPOrders) => {
  console.log("porders_Data : " + JSON.stringify(searchPOrders));
  try {
    const response = await axios.get("http://localhost:8888/api/porder/list?type=receive", {
      data: searchPOrders,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default pOrderWaitIngAxios;
