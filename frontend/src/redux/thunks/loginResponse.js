import axios from 'axios';

import { success } from '../slices/loginResponseReducer';

const loginRepsonse = (memberId, password) => async (dispatch) => {
    try {
        axios.post('http://localhost:8888/api/member/login', { memberId, password })
        .then((response) => {
            console.log("response : ",response.data);
            dispatch(success(response.data));
        })
        .catch((error) => {
          console.log("login Processing Error : ",error);
        });
    } catch(error) {
        console.error('Error login processing:', error);
    }
};

export default loginRepsonse;






