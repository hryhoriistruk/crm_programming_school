import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { joiResolver } from '@hookform/resolvers/joi';
import { v4 as uuidv4 } from 'uuid';

import style from './Auth.module.css';
import { ILogin } from '../../interfaces';
import { loginValidator } from '../../validators';
import { authActions } from '../../redux/slices';
import { useAppDispatch, useAppSelector } from '../../hooks';

const Login = () => {
    const DEVICE_ID = 'deviceId';

    const [checkPassword, setCheckPassword] = useState<boolean>(false);

    const dispatch = useAppDispatch();

    const { error, isLoading } = useAppSelector((state) => state.auth);
    const { manager } = useAppSelector((state) => state.manager);

    const navigate = useNavigate();

    useEffect(() => {
        if (!error && !isLoading && manager) {
            navigate('/orders');
        }
    }, [error, isLoading, manager, navigate]);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ILogin>({
        mode: 'onBlur',
        resolver: joiResolver(loginValidator),
    });

    const handleLogin: SubmitHandler<ILogin> = async (value) => {
        let deviceId = localStorage.getItem(DEVICE_ID);
        if (!deviceId) {
            deviceId = uuidv4();
            localStorage.setItem(DEVICE_ID, deviceId);
        }
        dispatch(
            authActions.login({
                loginData: {
                    ...value,
                    deviceId,
                },
            })
        );
    };
    return (
        <div
            className={
                'd-flex justify-content-center align-items-center min-vh-100'
            }
        >
            <div className={`p-4 ${style.FormCard}`}>
                <h3 className={`text-lg-start text-white mb-4`}>
                    Login
                    <hr />
                </h3>
                <form onSubmit={handleSubmit(handleLogin)}>
                    <div className="mb-3">
                        <input
                            type="email"
                            className={`form-control ${style.Input}`}
                            placeholder="Email"
                            required
                            {...register('email')}
                        />
                        {errors.email && (
                            <div className="form-text top-0">
                                {errors.email.message}
                            </div>
                        )}
                    </div>

                    <div className={`mb-3 ${style.PasswordContainer}`}>
                        <input
                            type={checkPassword ? 'text' : 'password'}
                            className={`form-control ${style.Input}`}
                            placeholder="Password"
                            required
                            {...register('password')}
                        />
                        <span onClick={() => setCheckPassword(!checkPassword)}>
                            <FontAwesomeIcon
                                icon={checkPassword ? faEye : faEyeSlash}
                            />
                        </span>
                        {errors.password && (
                            <div className="form-text">
                                {errors.password.message}
                            </div>
                        )}
                    </div>
                    {error && (
                        <div className="alert alert-warning" role="alert">
                            {error.message}
                        </div>
                    )}
                    <button type="submit" className={`btn ${style.Button}`}>
                        {isLoading ? '...' : 'Submit'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export { Login };
