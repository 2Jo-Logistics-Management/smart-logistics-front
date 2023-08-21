import React from 'react';
import { Box, AppBar, Toolbar, styled, Stack, IconButton, Badge, Button, Typography } from '@mui/material';
import PropTypes from 'prop-types';

// components
import Profile from './Profile';
import { IconBellRinging, IconMenu } from '@tabler/icons';
import logoutAxios from '../../../redux/thunks/logoutResponse';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';



const Header = (props) => {
  const dispatch = useDispatch();
  const loginData = useSelector((state) => state.loginResponse.data);
  const logoutData = useSelector((state) => state.logoutResponse.data);
  const navigate = useNavigate();

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: '10px',
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    [theme.breakpoints.up('lg')]: {
      minHeight: '70px',
    },
    zIndex: 1000
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    color: theme.palette.text.secondary,
  }));

  useEffect(() => {
    if(logoutData.success) {
      navigate("/auth/login");

    }else {
      console.log("로그아웃이 실패했습니다!");
    }
  },[logoutData])

  const handleLogout = async () => {
    try {
      dispatch(logoutAxios());
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    }
  };

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={props.toggleMobileSidebar}
          sx={{
            display: {
              lg: "none",
              xs: "inline",
            },
          }}
        >
          <IconMenu width="20" height="20" />
        </IconButton>

        <IconButton
          size="large"
          aria-label="show 11 new notifications"
          color="inherit"
          aria-controls="msgs-menu"
          aria-haspopup="true"
          sx={{
            ...(typeof anchorEl2 === 'object' && {
              color: 'primary.main',
            }),
          }}
        >
          <Badge variant="dot" color="primary">
            <IconBellRinging size="21" stroke="1.5" />
          </Badge>
        </IconButton>

        <Box flexGrow={1} />

        <Stack spacing={1} direction="row" alignItems="center">
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>
            {loginData}
            로그아웃
          </Typography>
          <Button 
          variant="contained" 
          color="primary" 
          type="submit"
          onClick={handleLogout}>
            Logout
          </Button>
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
