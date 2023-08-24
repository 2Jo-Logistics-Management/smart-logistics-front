import React from 'react';
import { Box, AppBar, Toolbar, styled, Stack, IconButton, Badge, Button, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import axios from 'axios';

// components
import Profile from './Profile';
import { IconBellRinging, IconMenu } from '@tabler/icons';
import { useNavigate } from 'react-router-dom';
axios.defaults.withCredentials = true;

const Header = (props) => {
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

  const handleLogout = async () => {
    try {
      axios.post('http://localhost:8888/api/member/logout')
      .then((response) => {
        if(response.data.success) {
          navigate("/auth/login");  
        }
      })

    } catch (error) {
      if(error.response && error.response.status === 401){
        alert("로그인세션만료");
        navigate("/auth/login");
      }
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
