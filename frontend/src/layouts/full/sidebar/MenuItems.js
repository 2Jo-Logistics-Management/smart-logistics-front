import {
  IconAperture, IconCopy, IconLayoutDashboard, IconLogin, IconMoodHappy, IconTypography, IconUserPlus
} from '@tabler/icons';
import { uniqueId } from 'lodash';
//사이드바 종류(주소 바꾸고싶으면 여기서 바꾸면 됨)

const subheaderStyle = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#333',
  marginLeft:'10px',
  marginBottom: '8px',
  textTransform: 'uppercase',
};



const Menuitems = [
  {
    navlabel: true,
    subheader: <div style= {subheaderStyle} >재고관리시스템</div>,
  },

  {
    id: uniqueId(),
    title: '메인페이지',
    icon: IconLayoutDashboard,
    href: '/dashboard',
  },
  
  {
    id: uniqueId(),
    title: '재고 등록/수정/삭제',
    icon: IconLayoutDashboard,
    href: '/warehouse/list',
  },
  {
    navlabel: true,
    subheader: <div style= {subheaderStyle}>물류관리시스템</div>,
  },
  {
    id: uniqueId(),
    title: '거래처 관리시스템',
    icon: IconTypography,
    href: '/Logistic/Account',
  },
  {
    id: uniqueId(),
    title: '발주 업무시스템',
    icon: IconCopy,
    href: '/Logistic/POrder',
  },
  {
    id: uniqueId(),
    title: '입고 업무시스템',
    icon: IconCopy,
    href: '/Logistic/Receive',
  },
 
  {
    navlabel: true,
    subheader: <div style= {subheaderStyle} >인사관리시스템</div>,
  },
  {
    id: uniqueId(),
    title: '사원 관리 시스템',
    icon: IconCopy,
    href: '/member/list',
  },
  
];

export default Menuitems;
