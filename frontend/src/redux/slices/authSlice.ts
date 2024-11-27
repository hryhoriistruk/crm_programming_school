import {
    createAsyncThunk,
    createSlice,
    isFulfilled,
    isPending,
    isRejected,
} from '@reduxjs/toolkit';

import {
    IActivateToken,
    IActivationLink,
    ICreateManager,
    IError,
    ILogin,
    IManager,
    IManagerWithOrderStatistics,
} from '../../interfaces';
import { authService } from '../../services';
import { handleAsyncThunkError } from '../../utils';
import { managerActions } from './managerSlice';

interface IState {
    isLoading: boolean;
    error: IError;
    activatingLink: IActivationLink;
}

const initialState: IState = {
    isLoading: false,
    error: null,
    activatingLink: {
        url: null,
        managerId: null,
    },
};

const login = createAsyncThunk<
    IManager,
    { loginData: ILogin },
    { rejectValue: IError }
>('authSlice/login', async ({ loginData }, { rejectWithValue, dispatch }) => {
    try {
        const loggedManager = await authService.login(loginData);
        dispatch(managerActions.setManager(loggedManager));
    } catch (err) {
        return rejectWithValue(handleAsyncThunkError(err));
    }
});

const logout = createAsyncThunk<void, void, { rejectValue: IError }>(
    'authSlice/logout',
    async (_, { rejectWithValue, dispatch }) => {
        try {
            await authService.logout();
            dispatch(managerActions.resetManager());
        } catch (err) {
            return rejectWithValue(handleAsyncThunkError(err));
        }
    }
);

const register = createAsyncThunk<
    IManagerWithOrderStatistics,
    { managerData: ICreateManager },
    { rejectValue: IError }
>(
    'authSlice/register',
    async ({ managerData }, { rejectWithValue, dispatch }) => {
        try {
            const newManager = await authService.register(managerData);
            dispatch(managerActions.addManager(newManager));
            return newManager;
        } catch (err) {
            return rejectWithValue(handleAsyncThunkError(err));
        }
    }
);

const activateManager = createAsyncThunk<
    { activateToken: IActivateToken; id: number },
    { managerId: number },
    { rejectValue: IError }
>('authSlice/activateManager', async ({ managerId }, { rejectWithValue }) => {
    try {
        const token = await authService.activateManager(managerId);
        return { activateToken: token, id: managerId };
    } catch (err) {
        return rejectWithValue(handleAsyncThunkError(err));
    }
});
const recoveryPassword = createAsyncThunk<
    { activateToken: IActivateToken; id: number },
    { managerId: number },
    { rejectValue: IError }
>('authSlice/recoveryPassword', async ({ managerId }, { rejectWithValue }) => {
    try {
        const token = await authService.recoveryPassword(managerId);
        return { activateToken: token, id: managerId };
    } catch (err) {
        return rejectWithValue(handleAsyncThunkError(err));
    }
});

const banManager = createAsyncThunk<
    void,
    { managerId: number },
    { rejectValue: IError }
>(
    'authSlice/banManager',
    async ({ managerId }, { rejectWithValue, dispatch }) => {
        try {
            const updated = await authService.banManager(managerId);
            dispatch(managerActions.updateManager(updated));
        } catch (err) {
            return rejectWithValue(handleAsyncThunkError(err));
        }
    }
);

const unbanManager = createAsyncThunk<
    void,
    { managerId: number },
    { rejectValue: IError }
>(
    'authSlice/unbanManager',
    async ({ managerId }, { rejectWithValue, dispatch }) => {
        try {
            const updated = await authService.unbanManager(managerId);
            dispatch(managerActions.updateManager(updated));
        } catch (err) {
            return rejectWithValue(handleAsyncThunkError(err));
        }
    }
);

const setManagerPassword = createAsyncThunk<
    void,
    { password: string; token: string },
    { rejectValue: IError }
>(
    'authSlice/setManagerPassword',
    async ({ password, token }, { rejectWithValue }) => {
        try {
            await authService.setNewPassword(password, token);
        } catch (err) {
            return rejectWithValue(handleAsyncThunkError(err));
        }
    }
);

const setRecoveryPassword = createAsyncThunk<
    void,
    { password: string; token: string },
    { rejectValue: IError }
>(
    'authSlice/setRecoveryPassword',
    async ({ password, token }, { rejectWithValue }) => {
        try {
            await authService.setRecoveryPassword(password, token);
        } catch (err) {
            return rejectWithValue(handleAsyncThunkError(err));
        }
    }
);

const authSlice = createSlice({
    name: 'authSlice',
    initialState: initialState,
    reducers: {
        resetActivatingLink: (state) => {
            state.activatingLink = {
                managerId: null,
                url: null,
            };
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(activateManager.fulfilled, (state, action) => {
                state.activatingLink.url = `${window.location.origin}/activate/${action.payload.activateToken.token}`;
                state.activatingLink.managerId = action.payload.id;
            })
            .addCase(recoveryPassword.fulfilled, (state, action) => {
                state.activatingLink.url = `${window.location.origin}/reset-password/${action.payload.activateToken.token}`;
                state.activatingLink.managerId = action.payload.id;
            })
            .addMatcher(isPending(login, logout, register), (state) => {
                state.isLoading = true;
            })
            .addMatcher(
                isRejected(
                    login,
                    logout,
                    register,
                    recoveryPassword,
                    banManager,
                    unbanManager,
                    setManagerPassword,
                    setRecoveryPassword
                ),
                (state, action) => {
                    state.isLoading = false;
                    state.error = {
                        message: action.payload.message,
                        statusCode: action.payload.statusCode,
                    };
                }
            )
            .addMatcher(
                isFulfilled(
                    login,
                    logout,
                    register,
                    activateManager,
                    recoveryPassword,
                    banManager,
                    unbanManager,
                    setManagerPassword,
                    setRecoveryPassword
                ),
                (state) => {
                    state.isLoading = false;
                    state.error = null;
                }
            ),
});

const { actions, reducer: authReducer } = authSlice;

const authActions = {
    ...actions,
    login,
    logout,
    register,
    activateManager,
    recoveryPassword,
    banManager,
    unbanManager,
    setManagerPassword,
    setRecoveryPassword,
};

export { authReducer, authActions, authSlice };
