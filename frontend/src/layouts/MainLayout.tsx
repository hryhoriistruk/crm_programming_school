import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import { Header } from '../components';
import { useAppDispatch, useAppSelector } from '../hooks';
import { managerActions } from '../redux/slices';

const MainLayout = () => {
    const { manager } = useAppSelector((state) => state.manager);
    const dispatch = useAppDispatch();
    const location = useLocation();

    useEffect(() => {
        const publicRoutes = ['/login', '/activate', '/reset-password'];
        const isPublicRoute = publicRoutes.some((route) =>
            location.pathname.startsWith(route)
        );

        if (!manager && !isPublicRoute) {
            dispatch(managerActions.getMe());
        }
    }, [dispatch, manager, location.pathname]);

    return (
        <div>
            {manager && <Header />}
            <Outlet />
        </div>
    );
};

export { MainLayout };
