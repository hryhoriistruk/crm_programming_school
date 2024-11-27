import { createBrowserRouter, Navigate } from 'react-router-dom';

import { MainLayout } from './layouts';
import {
    AdminPanelPage,
    LoginPage,
    OrdersPage,
    SetPasswordPage,
} from './pages';
import { RouteError } from './components';

const router = createBrowserRouter([
    {
        path: '',
        element: <MainLayout />,
        errorElement: <RouteError />,
        children: [
            { index: true, element: <Navigate to={'login'} /> },
            { path: 'login', element: <LoginPage /> },
            { path: 'orders', element: <OrdersPage /> },
            { path: 'adminPanel', element: <AdminPanelPage /> },
            { path: 'activate/:token', element: <SetPasswordPage /> },
            { path: 'reset-password/:token', element: <SetPasswordPage /> },
        ],
    },
]);

export { router };
