import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { joiResolver } from '@hookform/resolvers/joi';
import { SubmitHandler, useForm } from 'react-hook-form';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { EOrderFieldsAsc, EOrderFieldsDesc } from '../../enums';
import { ICreateManager, IQuery } from '../../interfaces';
import { Spinner } from '../SpinnerContainer';
import orderModuleStyle from '../OrdersContainer/Order.module.css';
import { authActions, managerActions } from '../../redux/slices';
import { registerValidator } from '../../validators';
import { ManagerInfo } from './ManagerInfo';
import { CreateManagerModal } from './CreateManagerModal';

const AdminPanel = () => {
    const defaultParams = {
        page: '1',
        limit: '25',
        order: '-id',
    };
    const dispatch = useAppDispatch();

    const {
        statistics: { managers, orders_statistics },
        isLoading,
    } = useAppSelector((state) => state.manager);
    const { activatingLink } = useAppSelector((state) => state.auth);

    const [searchParams] = useSearchParams(defaultParams);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ICreateManager>({
        mode: 'onBlur',
        resolver: joiResolver(registerValidator),
    });

    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    const order = searchParams.get('order') as
        | EOrderFieldsAsc
        | EOrderFieldsDesc;
    const name = searchParams.get('name');
    const surname = searchParams.get('surname');
    const email = searchParams.get('email');

    const getQueryParams = useCallback((): Partial<IQuery> => {
        const query: Partial<IQuery> = {
            limit,
            page,
            order,
        };

        if (name) query.name = name;
        if (surname) query.surname = surname;
        if (email) query.email = email;

        return query;
    }, [limit, order, page, name, surname, email]);

    const [copied, setCopied] = useState<boolean>(false);
    const [activationDoneForManager, setActivationDoneForManager] =
        useState<number>(null);

    useEffect(() => {
        const query: Partial<IQuery> = getQueryParams();

        dispatch(managerActions.getStatistics({ query }));
    }, [getQueryParams, dispatch]);

    const handleAddManager: SubmitHandler<ICreateManager> = (value) => {
        dispatch(authActions.register({ managerData: value }));
        const closeBtn = document.getElementById('closeRegisterManager');
        closeBtn.click();
    };

    const handleActivateClick = (managerId: number) => {
        dispatch(authActions.activateManager({ managerId }));
        setActivationDoneForManager(managerId);
    };

    const handleRecoveryPassword = (managerId: number) => {
        dispatch(authActions.recoveryPassword({ managerId }));
        setActivationDoneForManager(managerId);
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(activatingLink.url);
        setCopied(true);
        setActivationDoneForManager(null);

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return isLoading ? (
        <Spinner />
    ) : (
        <div className={`container mt-4`}>
            <div className={`text-center mb-4`}>
                <h2>Orders Statistics</h2>
                <p>
                    Total: {orders_statistics?.total}, In Work:{' '}
                    {orders_statistics?.inWork}, Agree:{' '}
                    {orders_statistics?.agree}, Disagree:{' '}
                    {orders_statistics?.disagree}, Dubbing:{' '}
                    {orders_statistics?.dubbing} New: {orders_statistics?.new}
                </p>
            </div>

            <button
                className={`btn btn-success mb-3 ${orderModuleStyle.Button}`}
                data-bs-target="#createManagerModal"
                data-bs-toggle="modal"
            >
                CREATE
            </button>

            {managers?.data.map((manager) => (
                <ManagerInfo
                    manager={manager}
                    key={manager.id}
                    activatingLink={activatingLink}
                    copied={copied}
                    activationDoneForManager={activationDoneForManager}
                    handleCopyToClipboard={handleCopyToClipboard}
                    handleActivateClick={handleActivateClick}
                    handleRecoveryPassword={handleRecoveryPassword}
                />
            ))}

            <CreateManagerModal
                register={register}
                errorEmail={errors?.email && errors.email.message}
                errorName={errors?.name && errors.name.message}
                errorSurname={errors?.surname && errors.surname.message}
                reset={reset}
                handleAddManager={handleAddManager}
                handleSubmit={handleSubmit}
            />
        </div>
    );
};

export { AdminPanel };
