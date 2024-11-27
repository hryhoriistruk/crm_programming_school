import { FC } from 'react';
import {
    SubmitHandler,
    UseFormHandleSubmit,
    UseFormRegister,
    UseFormReset,
} from 'react-hook-form';

import { ICreateManager } from '../../interfaces';
import orderModuleStyle from '../OrdersContainer/Order.module.css';

interface IProps {
    register: UseFormRegister<ICreateManager>;
    reset: UseFormReset<ICreateManager>;
    handleSubmit: UseFormHandleSubmit<ICreateManager>;
    handleAddManager: SubmitHandler<ICreateManager>;
    errorName: string;
    errorSurname: string;
    errorEmail: string;
}

const CreateManagerModal: FC<IProps> = ({
    register,
    errorSurname,
    errorName,
    errorEmail,
    reset,
    handleSubmit,
    handleAddManager,
}) => {
    return (
        <div
            className="modal fade"
            tabIndex={-1}
            id="createManagerModal"
            aria-hidden="true"
            data-bs-keyboard="false"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={() => reset()}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit(handleAddManager)}>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Name"
                                    {...register('name')}
                                />
                                {errorName && (
                                    <p className="text-danger">{errorName}</p>
                                )}
                            </div>

                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Surname"
                                    {...register('surname')}
                                />
                                {errorSurname && (
                                    <p className="text-danger">
                                        {errorSurname}
                                    </p>
                                )}
                            </div>

                            <div className="mb-3">
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Email"
                                    {...register('email')}
                                />
                                {errorEmail && (
                                    <p className="text-danger">{errorEmail}</p>
                                )}
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            id={'closeRegisterManager'}
                            data-bs-dismiss="modal"
                            className="btn btn-secondary"
                            onClick={() => reset()}
                        >
                            Close
                        </button>
                        <button
                            type="button"
                            className={`btn btn-primary ${orderModuleStyle.Button}`}
                            onClick={handleSubmit(handleAddManager)}
                        >
                            Save changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { CreateManagerModal };
