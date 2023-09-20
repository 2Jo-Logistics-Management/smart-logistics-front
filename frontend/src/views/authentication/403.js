import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const ErrorImgSource = `https://img.freepik.com/free-vector/403-error-forbidden-with-police-concept-illustration_114360-1935.jpg?size=626&ext=jpg`;

const Forbidden = () => (
  <Box
    display="flex"
    flexDirection="column"
    height="100vh"
    textAlign="center"
    justifyContent="center"
  >
    <Container maxWidth="md">
      {/* 이미지 URL을 직접 사용 */}
      <img
        src={ErrorImgSource}
        alt="403"
        style={{ width: '100%', maxWidth: '500px' }}
      />
      <Typography align="center" variant="h1" mb={4}>
      </Typography>
      <Typography align="center" variant="h4" mb={4}>
        권한이 없습니다.
      </Typography>
      <Button color="primary" variant="contained" component={Link} to="/auth/login" disableElevation>
        Go Back to page
      </Button>
    </Container>
  </Box>
);

export default Forbidden;
