import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';
// import { exact } from 'prop-types';
// import { Tune } from '@mui/icons-material';



/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Pages***** */
const Dashboard = Loadable(lazy(() => import('../views/dashboard/Dashboard')))




const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Register = Loadable(lazy(() => import('../views/authentication/Register')));
const Login = Loadable(lazy(() => import('../views/authentication/Login')));
const POrder = Loadable(lazy(() => import('../views/dashboard/components/PorderComponets')))
const Receieve = Loadable(lazy(() => import('../views/dashboard/components/ReceiveComponents')))
const Account = Loadable(lazy( () => import('../views/dashboard/components/AccountComponents')))
const Member = Loadable(lazy(() => import("../views/dashboard/components/memeber")))
const Warehouse = Loadable(lazy(() => import("../views/dashboard/components/WarehouseComponents")))
const WarehouseSection = Loadable(lazy(() => import("../views/dashboard/components/WarehouseSection")))
const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', element: <Navigate to="/dashboard" /> },
      { path: '/dashboard', exact: true, element: <Dashboard /> },


      { path: '/Logistic/POrder',exact:true, element:<POrder/>},
      { path: '/Logistic/Receive', exact:true, element:<Receieve/>},
      { path: '/Logistic/Account', exact:true, element:<Account/>},
      { path: "/member/list",exact: true, element:<Member/>},
      { path: "/warehouse/list",exact:true, element:<Warehouse/>},
      { path: "/WarehouseSection/list",exact:true,element:<WarehouseSection/>}
      
//      { path '/table/account', exact: true, element: <Account/>},
//      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: '404', element: <Error /> },
      { path: '/auth/register', element: <Register /> },
      { path: '/auth/login', element: <Login /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
      
    ],
  },
];

export default Router;
