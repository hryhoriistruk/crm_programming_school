import axios, { AxiosError } from 'axios';

import { baseURL, urls } from '../constants';
import { authService } from './authService';
import { router } from '../router';

const apiService = axios.create({ baseURL });

apiService.interceptors.request.use((request) => {
    const isRouteWithActionToken = [
        urls.auth.activateManager,
        urls.auth.recoveryPassword,
    ].some((route) => request.url.startsWith(route));

    if (!isRouteWithActionToken) {
        const accessToken = authService.getAccessToken();
        if (accessToken) {
            request.headers.Authorization = `Bearer ${accessToken}`;
        }
    }

    return request;
});

let isRefreshing = false;

type IWait = () => void;
const waitList: IWait[] = [];

const subscribeToWaitList = (cb: IWait): void => {
    waitList.push(cb);
};

const runWaitListAfterRefresh = (): void => {
    while (waitList.length) {
        const cb = waitList.pop();
        cb();
    }
};
apiService.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        console.log(error);
        const originalRequest = error.config;

        if (error.response.status === 401) {
            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    await authService.refresh();
                    isRefreshing = false;
                    runWaitListAfterRefresh();
                    return apiService(originalRequest);
                } catch (e) {
                    authService.removeTokens();
                    isRefreshing = false;
                    await router.navigate('/login?sessionExpired=true');
                    return Promise.reject(error);
                }
            }
            if (originalRequest.url === urls.auth.refresh) {
                return Promise.reject(error);
            }
            return new Promise((resolve) => {
                subscribeToWaitList(() => resolve(apiService(originalRequest)));
            });
        }
        return Promise.reject(error);
    }
);

export { apiService };
