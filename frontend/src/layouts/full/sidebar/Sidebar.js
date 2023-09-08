import { useMediaQuery, Box, Drawer } from '@mui/material';
import Logo from '../shared/logo/Logo';
import SidebarItems from './SidebarItems';
import { Upgrade } from './Updrade';

const Sidebar = (props) => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const sidebarWidth = '270px';
  const shouldOpen = lgUp ? props.isSidebarOpen : props.isMobileSidebarOpen;

  return (
    <Box
      sx={{
        width: shouldOpen ? sidebarWidth : 0,
        flexShrink: 0,
        transition: 'width 0.3s',  
      }}
    >
      {lgUp ? (
        <Drawer
          anchor="left"
          open={props.isSidebarOpen}
          variant="persistent"
          PaperProps={{
            sx: {
              width: sidebarWidth,
              boxSizing: 'border-box',
              zIndex: 1000
            },
          }}
        >
          <Box
            sx={{
              height: '100%',
            }}
          >
            <Box px={3}>
              <Logo />
            </Box>
            <SidebarItems />
            <Upgrade />
          </Box>
        </Drawer>
      ) : (
        <Drawer
          anchor="left"
          open={props.isMobileSidebarOpen}
          onClose={props.onSidebarClose}
          variant="temporary"
          PaperProps={{
            sx: {
              width: sidebarWidth,
              boxShadow: (theme) => theme.shadows[8],
              zIndex: 1000
            },
          }}
        >
          <Box px={2}>
            <Logo />
          </Box>
          <SidebarItems />
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
