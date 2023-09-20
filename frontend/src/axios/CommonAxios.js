import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

export let alertShown = false;

export function resetAlertStatus() {
  alertShown = false;
}

const CommonAxios = () => {
  const navigate = useNavigate();

  const instance = axios.create({
    baseURL: "/", // '/' 로 변경하여 proxy 설정 사용
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        if (!alertShown) {
          console.log("세션 만료");
          alert("로그인 세션 만료");
          alertShown = true;
          navigate("/");
        }
        return;
      }

      if (error.response.status === 403) {
        if (!alertShown) {

          console.log("권한 없음");
          alert("권한이 없습니다.");
          alertShown = true;
        }
        return;
      }

      throw error;
    }
  );

  return instance;
};

export default CommonAxios;
