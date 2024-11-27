export interface IGroup {
    id: number;
    name: string;
}
export type ICreateGroup = Pick<IGroup, 'name'>;
