import React, { useState } from "react";
import { styled, Container, Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

import Header from './header/Header';
import Sidebar from './sidebar/Sidebar';

const MainWrapper = styled('div')(() => ({
  display: 'flex',
  minHeight: '100vh',
  width: '100%',
}));

const PageWrapper = styled('div')(() => ({
  display: 'flex',
  flexGrow: 1,
  padding: 0,
  paddingBottom: '60px',
  flexDirection: 'column',
  zIndex: 1,
  backgroundColor: 'transparent',
}));

const FullLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(prevState => !prevState);
  };
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
};


  return (
    <MainWrapper className='mainwrapper'>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)}
      />
      <PageWrapper sx={{ padding: 0, width: '100%' }}>
        <Header
          toggleSidebar={toggleSidebar}
          toggleMobileSidebar={toggleMobileSidebar}
        />
        <div sx={{ paddingTop: "20px", width: "100%" }}>
          <Box sx={{ minHeight: 'calc(100vh - 170px)', width: '100%', padding: 0, margin: 0 }}>
            <Outlet />
          </Box>
        </div>
      </PageWrapper>
    </MainWrapper>
  );
};

export default FullLayout;
