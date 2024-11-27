import {
    IActivateToken,
    IAuthRes,
    ICreateManager,
    ILogin,
    IManager,
    IManagerWithOrderStatistics,
    IToken,
} from '../interfaces';
import { apiService } from './apiService';
import { urls } from '../constants';

const ACCESS_TOKEN = 'access-token';
const REFRESH_TOKEN = 'refresh-token';

const authService = {
    async login(loginData: ILogin): Promise<IManager> {
        const { data } = await apiService.post<IAuthRes>(
            urls.auth.login,
            loginData
        );
        this.setTokens(data.tokens);
        return data.manager;
    },

    async refresh(): Promise<void> {
        this.removeAccessToken();
        const refresh = this.getRefreshToken();
        const { data } = await apiService.post<IToken>(
            urls.auth.refresh,
            {},
            { headers: { Authorization: `Bearer ${refresh}` } }
        );
        this.setTokens(data);
    },
    async logout(): Promise<void> {
        await apiService.post<void>(urls.auth.logout);
        this.removeTokens();
    },

    async register(
        manager: ICreateManager
    ): Promise<IManagerWithOrderStatistics> {
        const { data } = await apiService.post<IManagerWithOrderStatistics>(
            urls.auth.register,
            manager
        );
        return data;
    },
    async activateManager(id: number): Promise<IActivateToken> {
        const { data } = await apiService.post<IActivateToken>(
            urls.auth.activate(id)
        );
        return data;
    },
    async recoveryPassword(id: number): Promise<IActivateToken> {
        const { data } = await apiService.post<IActivateToken>(
            urls.auth.recovery(id)
        );
        return data;
    },
    async banManager(id: number): Promise<IManagerWithOrderStatistics> {
        const { data } = await apiService.patch(urls.auth.ban(id));
        return data;
    },
    async unbanManager(id: number): Promise<IManagerWithOrderStatistics> {
        const { data } = await apiService.patch(urls.auth.unban(id));
        return data;
    },
    async setNewPassword(password: string, token: string): Promise<void> {
        await apiService.put(
            urls.auth.activateManager,
            { password },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
    },
    async setRecoveryPassword(password: string, token: string): Promise<void> {
        await apiService.put(
            urls.auth.recoveryPassword,
            { password },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
    },
    setTokens(tokens: IToken): void {
        localStorage.setItem(ACCESS_TOKEN, tokens.accessToken);
        localStorage.setItem(REFRESH_TOKEN, tokens.refreshToken);
    },
    getAccessToken(): string {
        return localStorage.getItem(ACCESS_TOKEN);
    },

    getRefreshToken(): string {
        return localStorage.getItem(REFRESH_TOKEN);
    },
    removeTokens(): void {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
    },
    removeAccessToken(): void {
        localStorage.removeItem(ACCESS_TOKEN);
    },
};

export { authService };
