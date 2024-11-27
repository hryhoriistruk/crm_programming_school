import {
    ECourse,
    ECourseFormat,
    ECourseType,
    EOrderFieldsAsc,
    EOrderFieldsDesc,
    EOrderStatus,
} from '../enums';

export interface IQuery {
    page?: string;
    limit?: string;
    order?: EOrderFieldsDesc | EOrderFieldsAsc;
    name?: string;
    surname?: string;
    email?: string;
    phone?: string;
    age?: number;
    course?: ECourse;
    course_format?: ECourseFormat;
    course_type?: ECourseType;
    status?: EOrderStatus;
    group?: number;
    start_date?: Date;
    end_date?: Date;
    manager?: string;
}
