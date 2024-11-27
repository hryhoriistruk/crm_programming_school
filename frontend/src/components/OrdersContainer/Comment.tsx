import { FC } from 'react';

import { IComment } from '../../interfaces';
import style from './Order.module.css';
import { formatDateToUkrainianLocale } from '../../utils';

interface IProps {
    comment: IComment;
}

const Comment: FC<IProps> = ({ comment }) => {
    return (
        <>
            <div className={`${style.Comment}`} key={comment.id}>
                <p>{comment.text}</p>
                <div className={'d-flex justify-content-between'}>
                    <p>{comment.manager_name}</p>
                    <p>{formatDateToUkrainianLocale(comment.created_at)}</p>
                </div>
            </div>
            <p className={`${style.HorizontalLine}`}></p>
        </>
    );
};

export { Comment };
