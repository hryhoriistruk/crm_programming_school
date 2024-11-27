import { ECourse, ECourseFormat, ECourseType, EOrderStatus } from '../enums';
import { IComment } from './commentInterface';

export interface IOrder {
    id: number;
    name: string;
    surname: string;
    email: string;
    phone: string;
    age: number;
    course: ECourse;
    course_format: ECourseFormat;
    course_type: ECourseType;
    status: EOrderStatus;
    sum: number;
    alreadyPaid: number;
    created_at: Date;
    utm: string;
    msg: string;
    manager_name: string;
    group_name: string;
    comments: IComment[];
}

export interface IOrderUpdate
    extends Pick<
        IOrder,
        | 'name'
        | 'surname'
        | 'email'
        | 'phone'
        | 'age'
        | 'status'
        | 'course'
        | 'course_format'
        | 'course_type'
        | 'sum'
        | 'alreadyPaid'
    > {
    group_id: number;
}
