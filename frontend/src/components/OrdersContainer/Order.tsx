import { ChangeEvent, FC, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';

import style from './Order.module.css';
import { ICreateGroup, IOrder, IOrderUpdate } from '../../interfaces';
import { formatDateToUkrainianLocale } from '../../utils';
import { Comments } from './Comments';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { DropdownMenu } from './DropdownMenu';
import { groupValidator, orderValidator } from '../../validators';
import { orderActions } from '../../redux/slices';

interface IProps {
    order: IOrder;
}
const Order: FC<IProps> = ({ order }) => {
    const {
        id,
        age,
        sum,
        course,
        course_format,
        course_type,
        email,
        created_at,
        name,
        group_name,
        manager_name,
        phone,
        status,
        surname,
        alreadyPaid,
        utm,
        msg,
        comments,
    } = order;

    const [showInfo, setShowInfo] = useState<boolean>(false);
    const [textInput, setTextInput] = useState<boolean>(false);

    const { manager } = useAppSelector((state) => state.manager);
    const { groups, statuses, courses, course_formats, course_types } =
        useAppSelector((state) => state.order);

    const dispatch = useAppDispatch();

    const groupObj = groups.find((group) => group.name === group_name);

    const {
        register,
        reset,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<IOrderUpdate>({
        defaultValues: {
            group_id: groupObj?.id,
            status,
            course,
            course_format,
            course_type,
            sum,
            phone,
            age,
            surname,
            alreadyPaid,
            name,
            email,
        },
        mode: 'onBlur',
        resolver: joiResolver(orderValidator),
    });

    const {
        register: groupRegister,
        formState: { errors: groupErrors },
        handleSubmit: groupHandleSubmit,
        resetField: resetGroupField,
    } = useForm<ICreateGroup>({
        mode: 'onBlur',
        resolver: joiResolver(groupValidator),
    });

    useEffect(() => {
        reset({ ...order, group_id: groupObj?.id });
    }, [order, reset]);

    const rowColor =
        Number(id) % 2 === 0
            ? `${style.TableRowDark}`
            : `${style.TableRowLight}`;
    const expandedRowColor = showInfo ? rowColor : '';

    const handleOrderUpdate: SubmitHandler<IOrderUpdate> = (value) => {
        dispatch(orderActions.updateOrder({ id, order: value }));
        const closeBtn = document.getElementById(`closeBtn-${id}`);
        closeBtn.click();
    };

    const handleDropdownChange = (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const { name: inputName, value } = e.target;
        setValue(inputName as keyof IOrderUpdate, value);
    };

    const handleGroupCreate: SubmitHandler<ICreateGroup> = (value) => {
        dispatch(orderActions.createGroup({ group: value }));
        setTextInput(false);
    };

    return (
        <>
            <tr
                onClick={() => setShowInfo((prevState) => !prevState)}
                className={`${style.TableRow} ${rowColor}`}
            >
                <td scope="row">{id}</td>
                <td>{!name ? '-' : name}</td>
                <td>{!surname ? '-' : surname}</td>
                <td>{!email ? '-' : email}</td>
                <td>{!phone ? '-' : phone}</td>
                <td>{!age ? '-' : age}</td>
                <td>{!course ? '-' : course}</td>
                <td>{!course_format ? '-' : course_format}</td>
                <td>{!course_type ? '-' : course_type}</td>
                <td>{!status ? '-' : status}</td>
                <td>{!sum ? '-' : sum}</td>
                <td>{!alreadyPaid ? '-' : alreadyPaid}</td>
                <td>{!group_name ? '-' : group_name}</td>
                <td>
                    {!created_at
                        ? '-'
                        : formatDateToUkrainianLocale(created_at)}
                </td>
                <td>{!manager_name ? '-' : manager_name}</td>
            </tr>
            {showInfo && (
                <tr>
                    <td
                        colSpan={15}
                        className={`${style.ExpandedCell} ${expandedRowColor}`}
                    >
                        <div className="d-flex flex-column ms-3 w-100">
                            <div className="d-flex justify-content-between mb-2">
                                <div>
                                    <p>Message: {msg || '-'}</p>
                                    <p>UTM: {utm || '-'}</p>
                                    <button
                                        type={'button'}
                                        data-bs-target={`#updateOrderModal-${id}`}
                                        data-bs-toggle="modal"
                                        className={`${manager_name !== null && manager_name !== manager.name ? style.DisabledButton : style.Button}`}
                                        disabled={
                                            manager_name !== null &&
                                            manager_name !== manager.name
                                        }
                                        style={{ marginLeft: 0 }}
                                    >
                                        Update order
                                    </button>
                                </div>
                                {/*start*/}
                                <div
                                    className="modal fade"
                                    id={`updateOrderModal-${id}`}
                                    tabIndex={+'-1'}
                                    aria-labelledby={`modalLabel-${id}`}
                                    aria-hidden="true"
                                    data-bs-keyboard="false"
                                >
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h1
                                                    className="modal-title fs-5"
                                                    id={`modalLabel-${id}`}
                                                >
                                                    Order #{id}
                                                </h1>
                                                <button
                                                    type="button"
                                                    className="btn-close"
                                                    data-bs-dismiss="modal"
                                                    aria-label="Close"
                                                    onClick={() => reset()}
                                                ></button>
                                            </div>
                                            <div className="modal-body">
                                                <form>
                                                    <div className={'mb-3'}>
                                                        <label
                                                            htmlFor="name"
                                                            className="form-label"
                                                        >
                                                            Name
                                                        </label>
                                                        <input
                                                            id={'name'}
                                                            type="text"
                                                            className="form-control"
                                                            placeholder={'Name'}
                                                            {...register(
                                                                'name'
                                                            )}
                                                        />
                                                        {errors.name && (
                                                            <div className="form-text text-danger">
                                                                {
                                                                    errors.name
                                                                        .message
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className={'mb-3'}>
                                                        <label
                                                            htmlFor="surname"
                                                            className="form-label"
                                                        >
                                                            Surname
                                                        </label>
                                                        <input
                                                            id={'surname'}
                                                            type="text"
                                                            className="form-control"
                                                            placeholder={
                                                                'Surname'
                                                            }
                                                            {...register(
                                                                'surname'
                                                            )}
                                                        />
                                                        {errors.surname && (
                                                            <div className="form-text text-danger">
                                                                {
                                                                    errors
                                                                        .surname
                                                                        .message
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className={'mb-3'}>
                                                        <label
                                                            htmlFor="email"
                                                            className="form-label"
                                                        >
                                                            Email
                                                        </label>
                                                        <input
                                                            id={'email'}
                                                            type="text"
                                                            className="form-control"
                                                            placeholder={
                                                                'Email'
                                                            }
                                                            {...register(
                                                                'email'
                                                            )}
                                                        />
                                                        {errors.email && (
                                                            <div className="form-text text-danger">
                                                                {
                                                                    errors.email
                                                                        .message
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className={'mb-3'}>
                                                        <label
                                                            htmlFor="phone"
                                                            className="form-label"
                                                        >
                                                            Phone
                                                        </label>
                                                        <input
                                                            id={'phone'}
                                                            type="text"
                                                            className="form-control"
                                                            placeholder={
                                                                'Phone'
                                                            }
                                                            {...register(
                                                                'phone'
                                                            )}
                                                        />
                                                        {errors.phone && (
                                                            <div className="form-text text-danger">
                                                                {
                                                                    errors.phone
                                                                        .message
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className={'mb-3'}>
                                                        <label
                                                            htmlFor="age"
                                                            className="form-label"
                                                        >
                                                            Age
                                                        </label>
                                                        <input
                                                            id={'age'}
                                                            type="text"
                                                            className="form-control"
                                                            placeholder={'Age'}
                                                            {...register('age')}
                                                        />
                                                        {errors.age && (
                                                            <div className="form-text text-danger">
                                                                {
                                                                    errors.age
                                                                        .message
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className={'mb-3'}>
                                                        <label
                                                            htmlFor="sum"
                                                            className="form-label"
                                                        >
                                                            Sum
                                                        </label>
                                                        <input
                                                            id={'sum'}
                                                            type="text"
                                                            className="form-control"
                                                            placeholder={'Sum'}
                                                            {...register('sum')}
                                                        />
                                                        {errors.sum && (
                                                            <div className="form-text text-danger">
                                                                {
                                                                    errors.sum
                                                                        .message
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className={'mb-3'}>
                                                        <label
                                                            htmlFor="alreadyPaid"
                                                            className="form-label"
                                                        >
                                                            Already paid
                                                        </label>
                                                        <input
                                                            id={'alreadyPaid'}
                                                            type="text"
                                                            className="form-control"
                                                            placeholder={
                                                                'Already paid'
                                                            }
                                                            {...register(
                                                                'alreadyPaid'
                                                            )}
                                                        />
                                                        {errors.alreadyPaid && (
                                                            <div className="form-text text-danger">
                                                                {
                                                                    errors
                                                                        .alreadyPaid
                                                                        .message
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                    {
                                                        <div className={'mb-3'}>
                                                            <label className="form-label">
                                                                Group
                                                            </label>
                                                            {textInput ? (
                                                                <div
                                                                    className={
                                                                        'mb-3'
                                                                    }
                                                                >
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder={
                                                                            'Group'
                                                                        }
                                                                        {...groupRegister(
                                                                            'name'
                                                                        )}
                                                                    />
                                                                    {groupErrors.name && (
                                                                        <div className="form-text text-danger">
                                                                            {
                                                                                groupErrors
                                                                                    .name
                                                                                    .message
                                                                            }
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <DropdownMenu
                                                                    selectName={
                                                                        'group'
                                                                    }
                                                                    items={
                                                                        groups
                                                                    }
                                                                    handleOptionChange={
                                                                        handleDropdownChange
                                                                    }
                                                                    selectValue={watch(
                                                                        'group_id'
                                                                    )}
                                                                    placeholder={
                                                                        'All groups'
                                                                    }
                                                                    itemKey={
                                                                        'id'
                                                                    }
                                                                    itemLabel={
                                                                        'name'
                                                                    }
                                                                    register={register(
                                                                        'group_id'
                                                                    )}
                                                                />
                                                            )}
                                                            {textInput ? (
                                                                <div>
                                                                    <button
                                                                        type="submit"
                                                                        className="btn btn-success"
                                                                        onClick={groupHandleSubmit(
                                                                            handleGroupCreate
                                                                        )}
                                                                    >
                                                                        Add
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-success ms-2"
                                                                        onClick={() => {
                                                                            setTextInput(
                                                                                false
                                                                            );
                                                                            resetGroupField(
                                                                                'name'
                                                                            );
                                                                        }}
                                                                    >
                                                                        Select
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-success"
                                                                    onClick={() =>
                                                                        setTextInput(
                                                                            true
                                                                        )
                                                                    }
                                                                >
                                                                    Add group
                                                                </button>
                                                            )}
                                                            {errors.group_id && (
                                                                <div className="form-text text-danger">
                                                                    {
                                                                        errors
                                                                            .group_id
                                                                            .message
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>
                                                    }
                                                    {
                                                        <>
                                                            <label className="form-label">
                                                                Status
                                                            </label>
                                                            <DropdownMenu
                                                                selectName={
                                                                    'status'
                                                                }
                                                                items={statuses}
                                                                handleOptionChange={
                                                                    handleDropdownChange
                                                                }
                                                                selectValue={watch(
                                                                    'status'
                                                                )}
                                                                placeholder={
                                                                    'All statuses'
                                                                }
                                                                itemKey={'id'}
                                                                itemLabel={
                                                                    'status'
                                                                }
                                                                register={register(
                                                                    'status'
                                                                )}
                                                            />
                                                            {errors.status && (
                                                                <div className="form-text text-danger">
                                                                    {
                                                                        errors
                                                                            .status
                                                                            .message
                                                                    }
                                                                </div>
                                                            )}
                                                        </>
                                                    }
                                                    {
                                                        <>
                                                            <label className="form-label">
                                                                Course
                                                            </label>
                                                            <DropdownMenu
                                                                selectName={
                                                                    'course'
                                                                }
                                                                items={courses}
                                                                handleOptionChange={
                                                                    handleDropdownChange
                                                                }
                                                                selectValue={watch(
                                                                    'course'
                                                                )}
                                                                placeholder={
                                                                    'All courses'
                                                                }
                                                                itemKey={'id'}
                                                                itemLabel={
                                                                    'courseName'
                                                                }
                                                                register={register(
                                                                    'course'
                                                                )}
                                                            />
                                                            {errors.course && (
                                                                <div className="form-text text-danger">
                                                                    {
                                                                        errors
                                                                            .course
                                                                            .message
                                                                    }
                                                                </div>
                                                            )}
                                                        </>
                                                    }
                                                    {
                                                        <>
                                                            <label className="form-label">
                                                                Course format
                                                            </label>
                                                            <DropdownMenu
                                                                selectName={
                                                                    'course_format'
                                                                }
                                                                items={
                                                                    course_formats
                                                                }
                                                                handleOptionChange={
                                                                    handleDropdownChange
                                                                }
                                                                selectValue={watch(
                                                                    'course_format'
                                                                )}
                                                                placeholder={
                                                                    'All formats'
                                                                }
                                                                itemKey={'id'}
                                                                itemLabel={
                                                                    'format'
                                                                }
                                                                register={register(
                                                                    'course_format'
                                                                )}
                                                            />
                                                            {errors.course_format && (
                                                                <div className="form-text text-danger">
                                                                    {
                                                                        errors
                                                                            .course_format
                                                                            .message
                                                                    }
                                                                </div>
                                                            )}
                                                        </>
                                                    }
                                                    {
                                                        <>
                                                            <label className="form-label">
                                                                Course type
                                                            </label>
                                                            <DropdownMenu
                                                                selectName={
                                                                    'course_type'
                                                                }
                                                                items={
                                                                    course_types
                                                                }
                                                                handleOptionChange={
                                                                    handleDropdownChange
                                                                }
                                                                selectValue={watch(
                                                                    'course_type'
                                                                )}
                                                                placeholder={
                                                                    'All types'
                                                                }
                                                                itemKey={'id'}
                                                                itemLabel={
                                                                    'type'
                                                                }
                                                                register={register(
                                                                    'course_type'
                                                                )}
                                                            />
                                                            {errors.course_type && (
                                                                <div className="form-text text-danger">
                                                                    {
                                                                        errors
                                                                            .course_type
                                                                            .message
                                                                    }
                                                                </div>
                                                            )}
                                                        </>
                                                    }
                                                </form>
                                            </div>
                                            <div className="modal-footer">
                                                <button
                                                    type="button"
                                                    id={`closeBtn-${id}`}
                                                    className="btn btn-secondary"
                                                    data-bs-dismiss="modal"
                                                    onClick={() => reset()}
                                                >
                                                    Close
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`${style.Button}`}
                                                    onClick={handleSubmit(
                                                        handleOrderUpdate
                                                    )}
                                                >
                                                    Save changes
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/*end*/}
                                {
                                    <Comments
                                        comments={comments}
                                        orderId={id}
                                        managerName={manager_name}
                                    />
                                }
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};

export { Order };
