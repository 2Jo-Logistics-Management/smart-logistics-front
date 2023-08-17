import axios from 'axios';

import { success } from '../slices/logoutResponseReducer'; // 수정된 import

const logoutResponse = () => async (dispatch) => {
    try {
        axios.post('http://localhost:8888/api/member/logout')
        .then((response) => {
            dispatch(success(response.data));
            console.log(response.data)
        })
    } catch(error) {
    }
};

export default logoutResponse;