import { IToken } from './tokenInterface';
import { IManager } from './managerInterface';

export interface IAuthRes {
    tokens: IToken;
    manager: IManager;
}
