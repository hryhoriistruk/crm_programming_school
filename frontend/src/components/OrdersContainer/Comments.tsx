import { FC, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';

import { IComment, ICreateComment } from '../../interfaces';
import style from './Order.module.css';
import { Comment } from './Comment';
import { Pagination } from '../PaginationContainer';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { orderActions } from '../../redux/slices';
import { commentValidator } from '../../validators';

interface IProps {
    comments: IComment[];
    orderId: number;
    managerName: string;
}

const Comments: FC<IProps> = ({ comments, orderId, managerName }) => {
    const dispatch = useAppDispatch();

    const { paginationComments } = useAppSelector((state) => state.order);
    const { manager } = useAppSelector((state) => state.manager);

    const orderPagination = paginationComments.find(
        (obj) => obj.orderId === orderId
    );

    const currentComments = orderPagination?.data || [];
    const page = orderPagination?.page || 1;
    const totalCount = orderPagination?.totalCount || 0;
    const limit = orderPagination?.limit || 3;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ICreateComment>({
        mode: 'onBlur',
        resolver: joiResolver(commentValidator),
    });

    useEffect(() => {
        if (comments?.length > 0) {
            const skip = (page - 1) * limit;
            dispatch(
                orderActions.setPagination({
                    data: comments.slice(skip, skip + limit),
                    totalCount: comments.length,
                    orderId,
                    page,
                    limit,
                })
            );
        }
    }, [comments, orderId, page, dispatch, limit]);

    const selectPage = (newPage: number) => {
        dispatch(
            orderActions.setPagination({
                orderId,
                page: newPage,
                limit,
                data: comments.slice((newPage - 1) * limit, newPage * limit),
                totalCount: comments.length,
            })
        );
    };

    const handleCommentSave: SubmitHandler<ICreateComment> = (value) => {
        if (!managerName || managerName === manager.name) {
            dispatch(
                orderActions.saveComment({ comment: value.text, id: orderId })
            );
        }
        reset();
    };

    return (
        <>
            <div
                className={`d-flex flex-column ${style.MainCommentsContainer}`}
            >
                {currentComments && currentComments.length > 0 && (
                    <div className={`${style.CommentsContainer}`}>
                        {currentComments.map((comment) => (
                            <Comment comment={comment} key={comment.id} />
                        ))}
                        <div className={'mt-2'}>
                            <Pagination
                                page={page}
                                selectPage={selectPage}
                                totalPages={Math.ceil(totalCount / limit)}
                                maxEdgePages={5}
                                maxCenterPages={3}
                            />
                        </div>
                    </div>
                )}
                <div className={`${style.InputButtonContainer}`}>
                    <form onSubmit={handleSubmit(handleCommentSave)}>
                        {errors.text && (
                            <div className="form-text">
                                {errors.text.message}
                            </div>
                        )}
                        <input
                            type="text"
                            placeholder="Comment"
                            {...register('text')}
                            className={`${style.CommentInput}`}
                        />
                        <button
                            type={'submit'}
                            className={`${errors?.text?.message || (managerName !== null && managerName !== manager.name) ? style.DisabledButton : style.Button}`}
                            disabled={
                                !!errors?.text?.message ||
                                (managerName !== null &&
                                    managerName !== manager.name)
                            }
                        >
                            Save
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export { Comments };
