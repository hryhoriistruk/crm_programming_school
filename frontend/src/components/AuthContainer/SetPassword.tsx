import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { setPassword } from '../../validators';
import { ISetPassword } from '../../interfaces';
import style from './Auth.module.css';
import { authActions } from '../../redux/slices';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { ApiError } from '../ErrorContainer';

const SetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const { error, isLoading } = useAppSelector((state) => state.auth);

    const [checkPassword, setCheckPassword] = useState<boolean>(false);
    const [checkConfirmPassword, setCheckConfirmPassword] =
        useState<boolean>(false);

    const location = useLocation();
    const isActivation = location.pathname.startsWith('/activate');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ISetPassword>({
        resolver: joiResolver(setPassword),
        mode: 'onChange',
    });

    const onSubmit: SubmitHandler<ISetPassword> = async ({ password }) => {
        if (isActivation) {
            dispatch(authActions.setManagerPassword({ password, token }));
        } else {
            dispatch(authActions.setRecoveryPassword({ password, token }));
        }
        dispatch(authActions.resetActivatingLink());
        navigate('/login');
    };

    return error ? (
        <ApiError error={error} />
    ) : (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className={`p-4 ${style.FormCard}`}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h2 className={`text-lg-start text-white mb-4`}>
                        Set Your Password
                    </h2>
                    <div className={`mb-3 ${style.PasswordContainer}`}>
                        <input
                            type={checkPassword ? 'text' : 'password'}
                            className={`form-control ${style.Input}`}
                            required
                            placeholder="Password"
                            {...register('password')}
                        />
                        <span onClick={() => setCheckPassword(!checkPassword)}>
                            <FontAwesomeIcon
                                icon={checkPassword ? faEye : faEyeSlash}
                            />
                        </span>
                        {errors.password && (
                            <div
                                className={`form-text top-0 ${style.ValidationMessage}`}
                            >
                                {errors.password.message}
                            </div>
                        )}
                    </div>
                    <div className={`mb-3 ${style.PasswordContainer}`}>
                        <input
                            type={checkConfirmPassword ? 'text' : 'password'}
                            className={`form-control ${style.Input}`}
                            placeholder="Confirm Password"
                            required
                            {...register('confirmPassword')}
                        />
                        <span
                            onClick={() =>
                                setCheckConfirmPassword(!checkConfirmPassword)
                            }
                        >
                            <FontAwesomeIcon
                                icon={checkConfirmPassword ? faEye : faEyeSlash}
                            />
                        </span>
                        {errors.confirmPassword && (
                            <div className="form-text top-0">
                                {errors.confirmPassword.message}
                            </div>
                        )}
                    </div>
                    <button type="submit" className={`btn ${style.Button}`}>
                        {isLoading ? '...' : 'Activate'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export { SetPassword };
