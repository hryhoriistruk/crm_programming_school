import { IComment } from './commentInterface';

export interface IPaginationRes<T> {
    page: number;
    limit: number;
    totalCount: number;
    data: T[];
}
export interface ICommentPaginationRes {
    orderId: number;
    page: number;
    limit: number;
    totalCount: number;
    data: IComment[];
}
