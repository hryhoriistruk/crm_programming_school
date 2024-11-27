import {
    createAsyncThunk,
    createSlice,
    isFulfilled,
    isPending,
    isRejected,
} from '@reduxjs/toolkit';

import {
    ICommentPaginationRes,
    ICourse,
    ICourseFormat,
    ICourseType,
    ICreateGroup,
    IError,
    IGroup,
    IOrder,
    IOrderStatus,
    IOrderUpdate,
    IPaginationRes,
    IQuery,
    ISearchParams,
} from '../../interfaces';
import { orderService } from '../../services';
import { handleAsyncThunkError } from '../../utils';

interface IState {
    isLoading: boolean;
    error: IError;
    orders: IPaginationRes<IOrder>;
    paginationComments: ICommentPaginationRes[];
    filters: IQuery;
    groups: IGroup[];
    statuses: IOrderStatus[];
    courses: ICourse[];
    course_formats: ICourseFormat[];
    course_types: ICourseType[];
}
const initialState: IState = {
    isLoading: false,
    error: null,
    orders: null,
    filters: {},
    course_formats: [],
    course_types: [],
    courses: [],
    groups: [],
    statuses: [],
    paginationComments: [],
};

const getAll = createAsyncThunk<
    IPaginationRes<IOrder>,
    { query?: IQuery },
    { rejectValue: IError }
>('orderSlice/getAll', async ({ query }, { rejectWithValue }) => {
    try {
        const { data } = await orderService.getAll(query);
        return data;
    } catch (err) {
        return rejectWithValue(handleAsyncThunkError(err));
    }
});

const getGroups = createAsyncThunk<IGroup[], void, { rejectValue: IError }>(
    'orderSlice/getGroups',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await orderService.getGroups();
            return data;
        } catch (err) {
            return rejectWithValue(handleAsyncThunkError(err));
        }
    }
);

const getStatuses = createAsyncThunk<
    IOrderStatus[],
    void,
    { rejectValue: IError }
>('orderSlice/getStatuses', async (_, { rejectWithValue }) => {
    try {
        const { data } = await orderService.getStatuses();
        return data;
    } catch (err) {
        return rejectWithValue(handleAsyncThunkError(err));
    }
});

const getCourses = createAsyncThunk<ICourse[], void, { rejectValue: IError }>(
    'orderSlice/getCourses',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await orderService.getCourses();
            return data;
        } catch (err) {
            return rejectWithValue(handleAsyncThunkError(err));
        }
    }
);

const getCourseFormats = createAsyncThunk<
    ICourseFormat[],
    void,
    { rejectValue: IError }
>('orderSlice/getCourseFormats', async (_, { rejectWithValue }) => {
    try {
        const { data } = await orderService.getCourseFormats();
        return data;
    } catch (err) {
        return rejectWithValue(handleAsyncThunkError(err));
    }
});

const getCourseTypes = createAsyncThunk<
    ICourseType[],
    void,
    { rejectValue: IError }
>('orderSlice/getCourseTypes', async (_, { rejectWithValue }) => {
    try {
        const { data } = await orderService.getCourseTypes();
        return data;
    } catch (err) {
        return rejectWithValue(handleAsyncThunkError(err));
    }
});

const downloadExcel = createAsyncThunk<void, IQuery, { rejectValue: IError }>(
    'orderSlice/downloadExcel',
    async (query, { rejectWithValue }) => {
        try {
            const { data } = await orderService.getExcelFile(query);

            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'report.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            return rejectWithValue(handleAsyncThunkError(err));
        }
    }
);

const saveComment = createAsyncThunk<
    IOrder,
    { id: number; comment: string },
    { rejectValue: IError }
>('orderSlice/saveComment', async ({ id, comment }, { rejectWithValue }) => {
    try {
        const { data } = await orderService.saveComment(id, comment);
        return data;
    } catch (err) {
        return rejectWithValue(handleAsyncThunkError(err));
    }
});

const updateOrder = createAsyncThunk<
    IOrder,
    { id: number; order: IOrderUpdate },
    { rejectValue: IError }
>('orderSlice/updateOrder', async ({ id, order }, { rejectWithValue }) => {
    try {
        const { data } = await orderService.updateById(id, order);
        return data;
    } catch (err) {
        return rejectWithValue(handleAsyncThunkError(err));
    }
});

const createGroup = createAsyncThunk<
    IGroup,
    { group: ICreateGroup },
    { rejectValue: IError }
>('orderSlice/createGroup', async ({ group }, { rejectWithValue }) => {
    try {
        const { data } = await orderService.createGroup(group);
        return data;
    } catch (err) {
        return rejectWithValue(handleAsyncThunkError(err));
    }
});

const orderSlice = createSlice({
    name: 'orderSlice',
    initialState,
    reducers: {
        setFilter: (state, action) => {
            const { key, value } = action.payload as ISearchParams;
            state.filters = {
                ...state.filters,
                [key]: value,
            };
        },
        resetFilter: (state) => {
            state.filters = {
                name: '',
                surname: '',
                email: '',
                phone: '',
                age: null,
            };
        },
        setPagination: (state, action) => {
            const pagination = action.payload as ICommentPaginationRes;
            const index = state.paginationComments.findIndex(
                (obj) => obj.orderId === pagination.orderId
            );

            if (index !== -1) {
                state.paginationComments[index] = pagination;
            } else {
                state.paginationComments.push(pagination);
            }
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(getAll.fulfilled, (state, action) => {
                state.orders = action.payload;
            })
            .addCase(saveComment.fulfilled, (state, action) => {
                const updatedOrder = action.payload;

                const orderIndex = state.orders.data.findIndex(
                    (order) => order.id === updatedOrder.id
                );

                if (orderIndex !== -1) {
                    state.orders.data[orderIndex] = updatedOrder;
                }

                const commentPaginationIndex =
                    state.paginationComments.findIndex(
                        (obj) => obj.orderId === updatedOrder.id
                    );

                const page = 1;
                const limit = 3;

                if (commentPaginationIndex !== -1) {
                    state.paginationComments[commentPaginationIndex] = {
                        limit,
                        page,
                        orderId: updatedOrder.id,
                        data: updatedOrder.comments.slice(0, limit),
                        totalCount: updatedOrder.comments.length,
                    };
                }
            })
            .addCase(updateOrder.fulfilled, (state, action) => {
                const updatedOrder = action.payload;

                const orderIndex = state.orders.data.findIndex(
                    (order) => order.id === updatedOrder.id
                );

                if (orderIndex !== -1) {
                    state.orders.data[orderIndex] = updatedOrder;
                }
            })
            .addCase(createGroup.fulfilled, (state, action) => {
                const group = action.payload;

                state.groups.push(group);
            })
            .addCase(getGroups.fulfilled, (state, action) => {
                state.groups = action.payload;
            })
            .addCase(getStatuses.fulfilled, (state, action) => {
                state.statuses = action.payload;
            })
            .addCase(getCourses.fulfilled, (state, action) => {
                state.courses = action.payload;
            })
            .addCase(getCourseFormats.fulfilled, (state, action) => {
                state.course_formats = action.payload;
            })
            .addCase(getCourseTypes.fulfilled, (state, action) => {
                state.course_types = action.payload;
            })
            .addMatcher(isPending(getAll), (state) => {
                state.isLoading = true;
            })
            .addMatcher(
                isRejected(
                    getAll,
                    getGroups,
                    getStatuses,
                    getCourses,
                    getCourseFormats,
                    getCourseTypes,
                    downloadExcel,
                    saveComment,
                    updateOrder,
                    createGroup
                ),
                (state, action) => {
                    state.isLoading = false;
                    state.error = action.payload;
                }
            )
            .addMatcher(
                isFulfilled(
                    getAll,
                    getGroups,
                    getStatuses,
                    getCourses,
                    getCourseFormats,
                    getCourseTypes,
                    saveComment,
                    updateOrder,
                    createGroup
                ),
                (state) => {
                    state.isLoading = false;
                    state.error = null;
                }
            ),
});

const { actions, reducer: orderReducer } = orderSlice;

const orderActions = {
    ...actions,
    getAll,
    getGroups,
    getCourseTypes,
    getCourseFormats,
    getCourses,
    getStatuses,
    downloadExcel,
    saveComment,
    updateOrder,
    createGroup,
};

export { orderActions, orderSlice, orderReducer };
