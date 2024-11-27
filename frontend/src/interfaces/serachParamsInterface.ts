import { IQuery } from './queryInterface';

export interface ISearchParams {
    key: keyof IQuery;
    value: any;
}
