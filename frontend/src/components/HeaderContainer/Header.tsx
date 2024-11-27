import { NavLink, useNavigate } from 'react-router-dom';
import {
    faRightFromBracket,
    faScrewdriverWrench,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';

import style from './Header.module.css';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { authActions, managerActions } from '../../redux/slices';
import { EUserRole } from '../../enums';

const Header = () => {
    const { manager, isAuthenticated } = useAppSelector(
        (state) => state.manager
    );
    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    useEffect(() => {
        if (!manager && isAuthenticated) {
            dispatch(managerActions.getMe());
        }
    }, [dispatch, isAuthenticated, manager]);

    const handleLogout = () => {
        dispatch(authActions.logout());
        navigate('/login');
    };

    return (
        <div>
            <nav className={`navbar navbar-expand-lg bg-body-tertiary`}>
                <div className={`container-fluid`}>
                    <NavLink
                        className={`navbar-brand h1 mt-2 ${style.NavLink}`}
                        to={'/orders'}
                    >
                        CRM
                    </NavLink>

                    <div className={`${style.NavBox}`}>
                        <p className={`${style.NavItem}`}>{manager?.name}</p>
                        {manager?.user_role === EUserRole.ADMIN && (
                            <FontAwesomeIcon
                                icon={faScrewdriverWrench}
                                className={`${style.NavItem}`}
                                onClick={() => navigate('/adminPanel')}
                            />
                        )}
                        <FontAwesomeIcon
                            icon={faRightFromBracket}
                            className={`${style.NavItem}`}
                            onClick={() => handleLogout()}
                        />
                    </div>
                </div>
            </nav>
            <div className={`${style.Nav}`}></div>
        </div>
    );
};

export { Header };
