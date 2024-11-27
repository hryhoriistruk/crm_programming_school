import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

import { IError } from '../../interfaces';
import style from './Error.module.css';
import { handleDisplayError } from '../../utils';

interface IProps {
    error: IError;
}

const ApiError: FC<IProps> = ({ error }) => {
    return (
        <div className={style.ApiContainer}>
            <div>
                {' '}
                <FontAwesomeIcon
                    icon={faTriangleExclamation}
                    className={style.ApiIcon}
                />{' '}
            </div>
            <h1>{handleDisplayError(error)}</h1>
        </div>
    );
};

export { ApiError };
