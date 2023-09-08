import axios from 'axios';

import { success } from '../slices/loginResponseReducer';
axios.defaults.withCredentials = true;

const loginResponse = (memberId, password) => async (dispatch) => {
    try {
        const response = await axios.post('http://localhost:8888/api/member/login', { memberId, password });
        // 로그인 성공 시 세션 정보 저장
        if (response.data.success) {
            const getMemberData = response.data;
            dispatch(success(getMemberData));          
        }
    } catch (error) {
        console.error('Error login processing:', error);
    }
};

export default loginResponse;






