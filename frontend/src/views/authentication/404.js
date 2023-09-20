import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const ErrorImgSource = `https://www.douzone.com/html/images/lg-douzone-color.svg`;

const Error = () => (
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
        alt="404"
        style={{ width: '100%', maxWidth: '500px' }}
      />
      <Typography align="center" variant="h1" mb={4}>
      </Typography>
      <Typography align="center" variant="h4" mb={4}>
        해당 페이지는 없는 페이지입니다.
      </Typography>
      <Button color="primary" variant="contained" component={Link} to="/auth/login" disableElevation>
        Go Back to page
      </Button>
    </Container>
  </Box>
);

export default Error;
