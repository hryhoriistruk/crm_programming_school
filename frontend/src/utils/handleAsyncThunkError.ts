import axios from 'axios';

import { IError } from '../interfaces';

export const handleAsyncThunkError = (error: unknown): IError => {
    let errorMsg = 'An unexpected error occurred';
    let statusCode = 500;

    if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.messages[0] || errorMsg;
        statusCode = error.response?.data?.statusCode || 500;
    } else {
        const err = error as Error;
        errorMsg = err?.message;
    }
    return { message: errorMsg, statusCode };
};
