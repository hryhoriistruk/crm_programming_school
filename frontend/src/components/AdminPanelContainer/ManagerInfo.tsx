import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBan,
    faCopy,
    faUnlockAlt,
    faUserCheck,
    faUserShield,
} from '@fortawesome/free-solid-svg-icons';
import { FC } from 'react';

import { authActions } from '../../redux/slices';
import { IActivationLink, IManagerWithOrderStatistics } from '../../interfaces';
import { useAppDispatch } from '../../hooks';
import { formatDateToUkrainianLocale } from '../../utils';

interface IProps {
    manager: IManagerWithOrderStatistics;
    handleActivateClick: (managerId: number) => void;
    handleRecoveryPassword: (managerId: number) => void;
    handleCopyToClipboard: () => void;
    activationDoneForManager: number | null;
    copied: boolean;
    activatingLink: IActivationLink;
}
const ManagerInfo: FC<IProps> = ({
    manager,
    handleActivateClick,
    handleCopyToClipboard,
    handleRecoveryPassword,
    activationDoneForManager,
    copied,
    activatingLink,
}) => {
    const {
        id,
        name,
        surname,
        email,
        orders_statistics,
        last_login,
        is_active,
    } = manager;

    const dispatch = useAppDispatch();

    return (
        <div key={id} className={`card mb-3`}>
            <div className="card-body">
                <h5 className="card-title">
                    №{id} {name} {surname}
                </h5>
                <p className="card-text">
                    <strong>Email:</strong> {email}
                    <br />
                    <strong>Status:</strong> {is_active ? 'Active' : 'Inactive'}
                    <br />
                    <strong>Last Login:</strong>{' '}
                    {last_login
                        ? formatDateToUkrainianLocale(last_login)
                        : 'Never'}
                    <br />
                    <strong>Orders:</strong> Total: {orders_statistics.total}
                    {orders_statistics.inWork > 0 &&
                        ` | In Work: ${orders_statistics.inWork}`}
                    {orders_statistics.agree > 0 &&
                        ` | Agree: ${orders_statistics.agree}`}
                    {orders_statistics.disagree > 0 &&
                        ` | Disagree: ${orders_statistics.disagree}`}
                    {orders_statistics.dubbing > 0 &&
                        ` | Dubbing: ${orders_statistics.dubbing}`}
                    {orders_statistics.new > 0 &&
                        ` | New: ${orders_statistics.new}`}
                </p>
                <div className="d-flex gap-2">
                    {!is_active ? (
                        activationDoneForManager === id ? (
                            <button
                                className={`btn btn-outline-success`}
                                onClick={() => handleCopyToClipboard()}
                            >
                                <FontAwesomeIcon icon={faCopy} /> Copy to
                                clipboard
                            </button>
                        ) : (
                            <button
                                className={`btn btn-outline-success`}
                                onClick={() => handleActivateClick(id)}
                            >
                                <FontAwesomeIcon icon={faUserCheck} /> Activate
                            </button>
                        )
                    ) : activationDoneForManager === id ? (
                        <button
                            className={`btn btn-outline-success`}
                            onClick={() => handleCopyToClipboard()}
                        >
                            <FontAwesomeIcon icon={faCopy} /> Copy to clipboard
                        </button>
                    ) : (
                        <button
                            className={`btn btn-outline-secondary`}
                            onClick={() => handleRecoveryPassword(id)}
                        >
                            <FontAwesomeIcon icon={faUserShield} /> Recovery
                            Password
                        </button>
                    )}
                    <button
                        className={`btn btn-outline-danger`}
                        onClick={() =>
                            dispatch(
                                authActions.banManager({
                                    managerId: id,
                                })
                            )
                        }
                    >
                        <FontAwesomeIcon icon={faBan} /> Ban
                    </button>
                    <button
                        className={`btn btn-outline-success`}
                        onClick={() =>
                            dispatch(
                                authActions.unbanManager({
                                    managerId: id,
                                })
                            )
                        }
                    >
                        <FontAwesomeIcon icon={faUnlockAlt} /> Unban
                    </button>
                </div>
                {copied && activatingLink.managerId === id && (
                    <p className="alert alert-success mt-3 p-2 copied-alert">
                        Link copied to clipboard
                    </p>
                )}
            </div>
        </div>
    );
};

export { ManagerInfo };
