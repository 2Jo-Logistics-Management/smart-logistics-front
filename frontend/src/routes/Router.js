import React, { lazy } from 'react';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import("../layouts/full/FullLayout")));
const BlankLayout = Loadable(lazy(() => import("../layouts/blank/BlankLayout")));

/* ****Pages***** */
const Dashboard = Loadable(lazy(() => import('../views/dashboard/Dashboard')))
const NotFound = Loadable(lazy(() => import('../views/authentication/404')));
const Login = Loadable(lazy(() => import('../views/authentication/Login')));
const POrder = Loadable(lazy(() => import('../views/dashboard/components/PorderComponets')))
const Receieve = Loadable(lazy(() => import('../views/dashboard/components/ReceiveComponents')))
const Account = Loadable(lazy(() => import('../views/dashboard/components/AccountComponents')))
const Member = Loadable(lazy(() => import("../views/dashboard/components/MemberComponents")))
const Warehouse = Loadable(lazy(() => import("../views/dashboard/components/WarehouseComponents")))
const WarehouseSection = Loadable(lazy(() => import("../views/dashboard/components/WarehouseSection")))
const Item = Loadable(lazy(() => import('../views/dashboard/components/ItemsComponents')));
const Forbidden = Loadable(lazy(() => import('../views/authentication/403')));

const useMemberRole = () => {
  const memberData = useSelector((state) => state.memberData.memberData);
  return memberData?.data?.memberRole || "";
};

const ProtectedRoute = ({ children }) => {
  const memberRole = useMemberRole();
  const location = useLocation();

  // 정규 표현식을 사용하여 pathname이 "/member/"로 시작하는지 확인
  const isMemberPath = /^\/member\//.test(location.pathname);

  if (memberRole !== 'ADMIN' && isMemberPath) {
    return <Navigate to="/auth/403" replace />
  }

  if (!memberRole && location.pathname !== '/auth/login') {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

const Router = [

  {
    path: "/",
    element: 
    <ProtectedRoute>
      <FullLayout />
    </ProtectedRoute>,
    children: [
      { path: '/', element: <Navigate to="/dashboard" /> },
      { path: '/dashboard', exact: true, element: <Dashboard /> },
      { path: '/item/list', exact: true, element: <Item /> },
      { path: '/Logistic/POrder', exact: true, element: <POrder /> },
      { path: '/Logistic/Receive', exact: true, element: <Receieve /> },
      { path: '/Logistic/Account', exact: true, element: <Account /> },
      { path: "/member/list", exact: true, element: <Member /> },
      { path: "/warehouse/list", exact: true, element: <Warehouse /> },
      { path: "/WarehouseSection/list", exact: true, element: <WarehouseSection /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: "/auth",
    element: <BlankLayout />,
    children: [
      { path: "/auth/404", element: <NotFound /> },
      { path: "/auth/login", element: <Login /> },
      { path: "/auth/403", element: <Forbidden />}
    ],
  },
];

export default Router;
