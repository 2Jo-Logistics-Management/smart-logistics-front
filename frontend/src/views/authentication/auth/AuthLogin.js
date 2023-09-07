import React from 'react';
import {
    Box,
    Typography,
    FormGroup,
    FormControlLabel,
    Button,
    Stack,
    Checkbox
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import loginResponse from '../../../redux/thunks/loginResponse';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { close, success } from '../../../redux/slices/loginResponseReducer';


const AuthLogin = ({ title, subtitle, subtext }) => {
    
    // id, pw
    const [userId, setUserId] = useState();
    const [password, setPassword] = useState();

    // 로그인 실패 alert
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState(''); 

    const dispatch = useDispatch();
    const loginData = useSelector((state) => state.memberData.memberData);
    const navigate = useNavigate();

    useEffect(() => {
        const handleUnload = (e) => {
            e.preventDefault();
            dispatch(close());
        };

        window.addEventListener('beforeunload', handleUnload);

        return () => {
            window.removeEventListener('beforeunload', handleUnload);
        };
    }, [dispatch]);


    useEffect(() => {
        console.log(loginData);
        if (loginData.success === true) {
            dispatch(success);
            navigate('/');
        } else if (loginData.success === false) {
            console.log(loginData.success)
            setAlertMessage('아이디와 비밀번호를 확인해주세요.');
            setShowAlert(true);
        }
    }, [dispatch, loginData, navigate]);

    
    const handleAlertClose = () => {
        setShowAlert(false);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!userId) {
            setAlertMessage('아이디를 입력해주세요.');
            setShowAlert(true);
            return;
        }

        if (!password) {
            setAlertMessage('비밀번호를 입력해주세요.');
            setShowAlert(true);
            return;
        }

        try {
            dispatch(loginResponse(userId, password));
        } catch (error) {
            alert(error);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleLogin(e);
    };


    return (
    <>
    
        {title ? (
            <Typography fontWeight="700" variant="h4" mb={1}>
                {title}
            </Typography>
        ) : null}

        {subtext}

        {showAlert && (
            <div
                style={{
                    backgroundColor: 'white',
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                    borderRadius: '4px',
                    padding: '10px',
                    marginBottom: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: 'red',
                }}
            >
                <div>{alertMessage}</div>
                <button
                    style={{
                        backgroundColor: '#bbb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '5px 10px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s', // hover 효과에 사용할 전환 효과
                    }}
                    onClick={handleAlertClose}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#444'} // hover 효과 적용
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#bbb'} // hover 효과 해제
                >
                    닫기
                </button>
            </div>
        )}
    <form onSubmit={handleFormSubmit}>
        <Stack>
            <Box>
                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='userId' mb="5px">ID</Typography>
                <CustomTextField id="userId" variant="outlined" fullWidth
                onChange={(e) => {setUserId(e.target.value)}} required  />
            </Box>
            <Box mt="25px">
                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='password' mb="5px" >Password</Typography>
                <CustomTextField id="password" type="password" variant="outlined" fullWidth 
                onChange={(e) => {setPassword(e.target.value)}} required/>
            </Box>
            <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
                <FormGroup>
                    <FormControlLabel
                        control={<Checkbox defaultChecked />}
                        label="Remeber this Device"
                    />
                </FormGroup>
            </Stack>
        </Stack>
        <Box>
            <Button
                color="primary"
                variant="contained"
                size="large"
                fullWidth
                type="submit"
            >
                Sign In
            </Button>
        </Box>
        </form>
        {subtitle}
    </>
)};

export default AuthLogin;
