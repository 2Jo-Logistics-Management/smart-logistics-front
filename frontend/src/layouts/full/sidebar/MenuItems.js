import { useSelector } from 'react-redux';
import {
   IconCopy, IconLayoutDashboard, IconTypography, IconHammer, IconBuildingWarehouse, IconReceipt, IconUsers
} from '@tabler/icons';
import { uniqueId } from 'lodash';
import { useMemo } from 'react';
import AssignmentIcon from '@mui/icons-material/Assignment';
const subheaderStyle = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#333',
  marginLeft:'10px',
  marginBottom: '8px',
  textTransform: 'uppercase',
};



const MenuItems = () => {
  const memberData = useSelector((state) => state.memberData.memberData);
  const memberRole = memberData?.data?.memberRole || "";

  const items = useMemo(() => [
    {
      navlabel: true,
      subheader: <div style={subheaderStyle}>재고관리시스템</div>,
    },
    {
      id: uniqueId(),
      title: '품목 관리시스템',
      icon: IconHammer,
      href: '/item/list',
    },

    {
      id: uniqueId(),
      title: '거래처 관리시스템',
      icon: IconTypography,
      href: '/Logistic/Account',
    },
    {
      navlabel: true,
      subheader: <div style={subheaderStyle}>물류관리시스템</div>,
    },
    
    {
      id: uniqueId(),
      title: '발주 관리시스템',
      icon: AssignmentIcon,
      href: '/Logistic/POrder',
    },
    {
      id: uniqueId(),
      title: '입고 관리시스템',
      icon: IconReceipt,
      href: '/Logistic/Receive',
    },
    {
      id: uniqueId(),
      title: '창고관리시스템',
      icon: IconBuildingWarehouse,
      href: '/warehouse/list',
    },
    
    ...(memberRole === 'ADMIN' ? [
      {
        navlabel: true,
        subheader: <div style={subheaderStyle}>인사관리시스템</div>,
      },
      {
        id: uniqueId(),
        title: '사원 관리시스템',
        icon: IconUsers,
        href: '/member/list',
      }
    ] : []),
  ], [memberRole]); // `memberRole`이 변경될 때만 `items` 배열을 재생성

  return items;
};


export default MenuItems;
