export interface IComment {
    id: number;
    created_at: Date;
    manager_name: string;
    text: string;
}

export type ICreateComment = Pick<IComment, 'text'>;
