import {
    createAsyncThunk,
    createSlice,
    isFulfilled,
    isPending,
    isRejected,
} from '@reduxjs/toolkit';

import {
    IError,
    IManager,
    IManagerStatistics,
    IManagerWithOrderStatistics,
    IQuery,
} from '../../interfaces';
import { managerService, authService } from '../../services';
import { handleAsyncThunkError } from '../../utils';

interface IState {
    isLoading: boolean;
    error: IError;
    statistics: IManagerStatistics;
    manager: IManager;
    isAuthenticated: boolean;
}

const initialState: IState = {
    isLoading: false,
    error: null,
    manager: null,
    isAuthenticated: null,
    statistics: {
        orders_statistics: null,
        managers: null,
    },
};

const getStatistics = createAsyncThunk<
    IManagerStatistics,
    { query: IQuery },
    { rejectValue: IError }
>('managerSlice/getStatistics', async ({ query }, { rejectWithValue }) => {
    try {
        const { data } =
            await managerService.getManagersAndOrdersStatistics(query);
        return data;
    } catch (err) {
        return rejectWithValue(handleAsyncThunkError(err));
    }
});

const getMe = createAsyncThunk<IManager, void, { rejectValue: IError }>(
    'managerSlice/getMe',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await managerService.getMe();
            return data;
        } catch (err) {
            return rejectWithValue(handleAsyncThunkError(err));
        }
    }
);

const managerSlice = createSlice({
    name: 'managerSlice',
    initialState,
    reducers: {
        isAuthenticated: (state) => {
            const access = authService.getAccessToken();
            access
                ? (state.isAuthenticated = true)
                : (state.isAuthenticated = false);
        },
        addManager: (state, action) => {
            state.statistics.managers.data.push(action.payload);
            state.statistics.managers.data.sort(
                (a, b) => Number(b.id) - Number(a.id)
            );
        },
        updateManager: (state, action) => {
            const updatedManager =
                action.payload as IManagerWithOrderStatistics;
            const index = state.statistics.managers.data.findIndex(
                (manager) => manager.id === updatedManager.id
            );
            state.statistics.managers.data[index] = updatedManager;
        },
        setManager: (state, action) => {
            state.manager = action.payload;
        },
        resetManager: (state) => {
            state.manager = null;
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(getStatistics.fulfilled, (state, action) => {
                state.statistics = action.payload;
            })
            .addCase(getMe.fulfilled, (state, action) => {
                state.manager = action.payload;
                state.isAuthenticated = true;
            })
            .addMatcher(isPending(getStatistics), (state) => {
                state.isLoading = true;
            })
            .addMatcher(isFulfilled(getStatistics, getMe), (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addMatcher(isRejected(getStatistics, getMe), (state, action) => {
                state.isLoading = false;
                state.error = {
                    message: action.payload.message,
                    statusCode: action.payload.statusCode,
                };
            }),
});

const { actions, reducer: managerReducer } = managerSlice;

const managerActions = { ...actions, getStatistics, getMe };

export { managerSlice, managerReducer, managerActions };
