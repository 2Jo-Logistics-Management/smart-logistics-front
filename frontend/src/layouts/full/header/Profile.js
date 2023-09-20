import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogContent,
  Typography,
  TextField,
  Paper,
} from '@mui/material';

import { IconListCheck, IconMail, IconUser } from '@tabler/icons';

import ProfileImg from 'src/assets/images/profile/user-1.jpg';
import { useSelector } from 'react-redux';

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };
  const [modalOpen, setModalOpen] = useState(false);
  const memberData = useSelector((state) => state.memberData.memberData.data);

  return (
    <Box>
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
        onClick={handleClick2}
      >
        <Avatar
          src={ProfileImg}
          alt={ProfileImg}
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '200px',
          },
        }}
      >
        <MenuItem onClick={() => setModalOpen(true)}>
          <ListItemIcon>
            <IconUser width={20} />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>
        {/* <MenuItem>
          <ListItemIcon>
            <IconMail width={20} />
          </ListItemIcon>
          <ListItemText>My Account</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <IconListCheck width={20} />
          </ListItemIcon>
          <ListItemText>My Tasks</ListItemText>
        </MenuItem> */}
        <Box mt={1} py={1} px={2}>
          <Button to="/auth/login" variant="outlined" color="primary" component={Link} fullWidth>
            Logout
          </Button>
        </Box>
      </Menu>
      <Dialog
        open={modalOpen}
        onClose={() => { setModalOpen(false) }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper className="modal-paper" style={{ padding: '30px', margin: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', width: '400px' }}>
            <Typography variant="h6" style={{ fontSize: '18px', marginBottom: '20px' }}>
              회원 정보
            </Typography>
            <div style={{ display: 'flex', marginBottom: '20px', alignItems: 'center' }}>
              <Typography variant="body1" style={{ marginRight: '8px', width: '100px' }}>
                이름
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                margin="normal"
                value={memberData.memberName}
              />
            </div>
            <div style={{ display: 'flex', marginBottom: '20px', alignItems: 'center' }}>
              <Typography variant="body1" style={{ marginRight: '8px', width: '100px' }}>
                아이디
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                margin="normal"
                value={memberData.memberId}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" style={{ marginRight: '8px', width: '100px' }}>
                비밀번호
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                margin="normal"
                type='password'
                value={memberData.password}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" style={{ marginRight: '8px', width: '100px' }}>
                권한
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                margin="normal"
                value={memberData.memberRole}
              />
            </div>
          </div>
        </Paper>
      </Dialog>


    </Box>
  );
};

export default Profile;
