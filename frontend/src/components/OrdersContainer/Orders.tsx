import { useSearchParams } from 'react-router-dom';
import { ChangeEvent, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faRotateRight } from '@fortawesome/free-solid-svg-icons';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { managerActions, orderActions } from '../../redux/slices';
import {
    ECourse,
    ECourseFormat,
    ECourseType,
    EOrderFieldsAsc,
    EOrderFieldsDesc,
    EOrderStatus,
} from '../../enums';
import { Order } from './Order';
import style from './Order.module.css';
import { Spinner } from '../SpinnerContainer';
import { ApiError } from '../ErrorContainer';
import { Pagination } from '../PaginationContainer';
import { IQuery } from '../../interfaces';
import { DropdownMenu } from './DropdownMenu';
import { TextInput } from './TextInput';

const Orders = () => {
    const defaultParams = {
        page: '1',
        limit: '25',
        order: '-id',
    };

    const dispatch = useAppDispatch();

    const {
        error,
        isLoading,
        orders,
        filters,
        course_types,
        courses,
        course_formats,
        groups,
        statuses,
    } = useAppSelector((state) => state.order);

    const { manager: authManager, isAuthenticated } = useAppSelector(
        (state) => state.manager
    );

    const [searchParams, setSearchParams] = useSearchParams(defaultParams);

    const { register } = useForm<IQuery>();

    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    const order = searchParams.get('order') as
        | EOrderFieldsAsc
        | EOrderFieldsDesc;
    const name = searchParams.get('name');
    const surname = searchParams.get('surname');
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');
    const age = Number(searchParams.get('age'));
    const course = searchParams.get('course') as ECourse;
    const course_format = searchParams.get('course_format') as ECourseFormat;
    const course_type = searchParams.get('course_type') as ECourseType;
    const status = searchParams.get('status') as EOrderStatus;
    const group = Number(searchParams.get('group'));
    const start_date = searchParams.get('start_date');
    const end_date = searchParams.get('end_date');
    const manager = searchParams.get('manager');

    const getQueryParams = useCallback((): Partial<IQuery> => {
        const query: Partial<IQuery> = {
            limit,
            page,
            order,
        };

        if (name) query.name = name;
        if (surname) query.surname = surname;
        if (email) query.email = email;
        if (phone) query.phone = phone;
        if (age && age !== 0) query.age = age;
        if (group && group !== 0) query.group = group;
        if (course) query.course = course;
        if (course_format) query.course_format = course_format;
        if (course_type) query.course_type = course_type;
        if (status) query.status = status;
        if (start_date && start_date !== '1970-01-01')
            query.start_date = new Date(start_date);
        if (end_date && end_date !== '1970-01-01')
            query.end_date = new Date(end_date);
        if (manager) query.manager = manager;

        return query;
    }, [
        limit,
        order,
        page,
        name,
        surname,
        email,
        phone,
        age,
        course,
        course_format,
        course_type,
        status,
        group,
        start_date,
        end_date,
        manager,
    ]);

    const handleOrderBy = (selectedOrder: EOrderFieldsAsc) => {
        if (!order.startsWith('-') && selectedOrder === order) {
            setSearchParams((prev) => {
                prev.set('order', `-${selectedOrder}`);
                return prev;
            });
        } else {
            setSearchParams((prev) => {
                prev.set('order', selectedOrder);
                return prev;
            });
        }
    };

    const handleFilterChange = useCallback(
        (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            e.preventDefault();
            const { name: inputName, value } = e.target;

            setSearchParams((prev) => {
                if (value) {
                    prev.set(inputName, value);
                } else {
                    prev.delete(inputName);
                }
                return prev;
            });
            dispatch(orderActions.setFilter({ inputName, value }));
        },
        [dispatch, setSearchParams]
    );

    const handleReloadPage = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        dispatch(orderActions.resetFilter());
        setSearchParams(defaultParams);
    };
    const handleDownloadExcelFile = (
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        e.preventDefault();
        const query = getQueryParams();
        dispatch(orderActions.downloadExcel(query));
    };
    const handleCheckboxChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            e.preventDefault();
            const { name: inputName, checked } = e.target;

            setSearchParams((prev) => {
                if (checked) {
                    prev.set(inputName, authManager?.name || '');
                } else {
                    prev.delete(inputName);
                }
                return prev;
            });
        },
        [authManager?.name, setSearchParams]
    );
    useEffect(() => {
        if (!manager && isAuthenticated) {
            dispatch(managerActions.getMe());
        }
    }, [dispatch, isAuthenticated, manager]);

    useEffect(() => {
        dispatch(managerActions.isAuthenticated());
        dispatch(orderActions.getGroups());
        dispatch(orderActions.getCourses());
        dispatch(orderActions.getStatuses());
        dispatch(orderActions.getCourseTypes());
        dispatch(orderActions.getCourseFormats());
    }, [dispatch]);

    useEffect(() => {
        const query: Partial<IQuery> = getQueryParams();

        dispatch(orderActions.getAll({ query }));
    }, [dispatch, getQueryParams]);

    const selectPage = (selectedPage: number) => {
        setSearchParams((prev) => {
            prev.set('page', `${selectedPage}`);
            return prev;
        });
    };

    return (
        <>
            <form>
                <div className={'row'}>
                    {
                        <TextInput
                            placeholder={'Name'}
                            value={filters.name || name}
                            handleInputChange={handleFilterChange}
                            inputName={'name'}
                            register={register}
                        />
                    }
                    {
                        <TextInput
                            placeholder={'Surname'}
                            value={filters.surname || surname}
                            handleInputChange={handleFilterChange}
                            inputName={'surname'}
                            register={register}
                        />
                    }
                    {
                        <TextInput
                            placeholder={'Email'}
                            value={filters.email || email}
                            handleInputChange={handleFilterChange}
                            inputName={'email'}
                            register={register}
                        />
                    }
                    {
                        <TextInput
                            placeholder={'Phone'}
                            value={filters.phone || phone}
                            handleInputChange={handleFilterChange}
                            inputName={'phone'}
                            register={register}
                        />
                    }
                    {
                        <TextInput
                            placeholder={'Age'}
                            value={
                                (filters.age && filters.age.toString()) ||
                                (age && age.toString())
                            }
                            handleInputChange={handleFilterChange}
                            inputName={'age'}
                            register={register}
                        />
                    }
                    {
                        <div className={'col-md-2'}>
                            <DropdownMenu
                                handleOptionChange={handleFilterChange}
                                items={courses}
                                itemKey={'id'}
                                itemLabel={'courseName'}
                                placeholder={'All courses'}
                                selectName={'course'}
                                selectValue={course}
                            />
                        </div>
                    }
                    {
                        <div className={'col-md-2'}>
                            <DropdownMenu
                                handleOptionChange={handleFilterChange}
                                items={course_formats}
                                itemKey={'id'}
                                itemLabel={'format'}
                                placeholder={'All formats'}
                                selectName={'course_format'}
                                selectValue={course_format}
                            />
                        </div>
                    }
                    {
                        <div className={'col-md-2'}>
                            <DropdownMenu
                                handleOptionChange={handleFilterChange}
                                items={course_types}
                                itemKey={'id'}
                                itemLabel={'type'}
                                placeholder={'All types'}
                                selectName={'course_type'}
                                selectValue={course_type}
                            />
                        </div>
                    }
                    {
                        <div className={'col-md-2'}>
                            <DropdownMenu
                                handleOptionChange={handleFilterChange}
                                items={statuses}
                                itemKey={'id'}
                                itemLabel={'status'}
                                placeholder={'All statuses'}
                                selectName={'status'}
                                selectValue={status}
                            />
                        </div>
                    }

                    {
                        <div className={'col-md-2'}>
                            <DropdownMenu
                                selectName={'group'}
                                items={groups}
                                handleOptionChange={handleFilterChange}
                                selectValue={group}
                                placeholder={'All groups'}
                                itemKey={'id'}
                                itemLabel={'name'}
                            />
                        </div>
                    }

                    {
                        <TextInput
                            placeholder={'Start date'}
                            value={start_date}
                            handleInputChange={handleFilterChange}
                            inputName={'start_date'}
                            register={register}
                        />
                    }

                    {
                        <TextInput
                            placeholder={'End date'}
                            value={end_date}
                            handleInputChange={handleFilterChange}
                            inputName={'end_date'}
                            register={register}
                        />
                    }

                    <div className={'d-flex align-items-center mb-3'}>
                        <div className={'col-auto'}>
                            <div className="input-group-text ms-3">
                                <input
                                    className={`form-check-input mt-0 ${style.CheckBox}`}
                                    type="checkbox"
                                    id="managerCheckbox"
                                    {...register('manager')}
                                    checked={manager === authManager?.name}
                                    onChange={handleCheckboxChange}
                                />
                                <label
                                    htmlFor="managerCheckbox"
                                    className={'ms-2'}
                                >
                                    {'My'}
                                </label>
                            </div>
                        </div>
                        <div className={'ms-3'}>
                            <button
                                className={`btn ${style.ReloadButton}`}
                                onClick={handleReloadPage}
                            >
                                <FontAwesomeIcon icon={faRotateRight} />
                            </button>
                        </div>
                        <div className={'ms-3'}>
                            <button
                                className={`btn ${style.ReloadButton}`}
                                onClick={handleDownloadExcelFile}
                            >
                                <FontAwesomeIcon icon={faFileExcel} />
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            {isLoading ? (
                <Spinner />
            ) : error ? (
                <ApiError error={error} />
            ) : (
                <div>
                    <table className={`${style.Table}`}>
                        <thead>
                            <tr>
                                {Object.values(EOrderFieldsAsc).map((value) => (
                                    <th
                                        scope="col"
                                        key={value}
                                        className={style.TableHead}
                                        style={{
                                            backgroundColor: '#a927ba',
                                            color: 'white',
                                        }}
                                        onClick={() => handleOrderBy(value)}
                                    >
                                        {value}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {orders &&
                                orders.data.length > 0 &&
                                !isLoading &&
                                orders.data.map((item) => (
                                    <Order key={item.id} order={item} />
                                ))}
                        </tbody>
                    </table>
                    <Pagination
                        page={orders?.page}
                        totalPages={Math.ceil(
                            orders?.totalCount / orders?.limit
                        )}
                        selectPage={selectPage}
                        maxCenterPages={5}
                        maxEdgePages={7}
                    />
                </div>
            )}
        </>
    );
};

export { Orders };
